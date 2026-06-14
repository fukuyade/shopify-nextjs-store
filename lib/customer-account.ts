import crypto from 'node:crypto';
import { AccountCustomer, AccountOrder, TokenSet } from '@/types';

/* =========================================================
 * Customer Account API（新方式）— OAuth2 Confidentialクライアント
 * - Shopifyホスト型ログインへのリダイレクト
 * - 認可コード → トークン交換 / リフレッシュ / ログアウト
 * - トークンでCustomer Account API（GraphQL）から顧客・注文取得
 *
 * トークンはroute handler側でhttpOnly Cookieに保存する。
 * このファイルはサーバー専用（'server-only'）。
 * ======================================================= */

// 環境変数（Vercel・.env.local に設定）
const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!; // 例: fuku-dev-store.myshopify.com
const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!;
const CLIENT_SECRET = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI!; // 例: https://xxx.vercel.app/api/auth/callback
const APP_BASE_URL = process.env.APP_BASE_URL!; // 例: https://xxx.vercel.app
const API_VERSION = '2025-07';

// 認可で要求するスコープ
const SCOPE = 'openid email customer-account-api:full';

// ---- ディスカバリ（エンドポイントの自動取得＆メモ化） ----

type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
};

let openIdCache: OpenIdConfig | null = null;
let graphqlEndpointCache: string | null = null;

async function getOpenIdConfig(): Promise<OpenIdConfig> {
  if (openIdCache) return openIdCache;
  const res = await fetch(`https://${SHOP_DOMAIN}/.well-known/openid-configuration`);
  if (!res.ok) throw new Error(`OpenID discovery failed: ${res.status}`);
  openIdCache = (await res.json()) as OpenIdConfig;
  return openIdCache;
}

async function getGraphqlEndpoint(): Promise<string> {
  if (graphqlEndpointCache) return graphqlEndpointCache;
  const res = await fetch(`https://${SHOP_DOMAIN}/.well-known/customer-account-api`);
  if (!res.ok) throw new Error(`Customer Account API discovery failed: ${res.status}`);
  const cfg = (await res.json()) as { graphql_api: string };
  // 念のため希望のAPIバージョンに差し替え（discoveryは最新を返すことがある）
  graphqlEndpointCache = cfg.graphql_api.replace(/\/customer\/api\/[^/]+\//, `/customer/api/${API_VERSION}/`);
  return graphqlEndpointCache;
}

// ---- ランダム値生成（state / nonce） ----

export function randomString(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

// ---- 認可URLの生成（ログイン開始） ----

export async function buildAuthorizationUrl(state: string, nonce: string): Promise<string> {
  const { authorization_endpoint } = await getOpenIdConfig();
  const url = new URL(authorization_endpoint);
  url.searchParams.set('scope', SCOPE);
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);
  return url.toString();
}

// Confidentialクライアントの認証ヘッダ（Basic base64(client_id:client_secret)）
function basicAuthHeader(): string {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  return `Basic ${credentials}`;
}

// ---- 認可コード → アクセストークン交換 ----

export async function exchangeCodeForToken(code: string): Promise<TokenSet> {
  const { token_endpoint } = await getOpenIdConfig();
  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('client_id', CLIENT_ID);
  body.set('redirect_uri', REDIRECT_URI);
  body.set('code', code);

  const res = await fetch(token_endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: basicAuthHeader(),
      // Shopifyの仕様上、これらが無いと401/403になる場合がある
      Origin: APP_BASE_URL,
      'User-Agent': 'fuku-dev-store-nextjs',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }
  return (await res.json()) as TokenSet;
}

// ---- リフレッシュトークン → 新しいアクセストークン ----

export async function refreshAccessToken(refreshToken: string): Promise<TokenSet> {
  const { token_endpoint } = await getOpenIdConfig();
  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('client_id', CLIENT_ID);
  body.set('refresh_token', refreshToken);

  const res = await fetch(token_endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: basicAuthHeader(),
      Origin: APP_BASE_URL,
      'User-Agent': 'fuku-dev-store-nextjs',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed: ${res.status} ${text}`);
  }
  // refresh時はid_tokenは返らない
  return (await res.json()) as TokenSet;
}

// ---- ログアウトURL（Shopifyのセッションも終了させる） ----

export async function buildLogoutUrl(idToken: string | undefined): Promise<string> {
  const { end_session_endpoint } = await getOpenIdConfig();
  const url = new URL(end_session_endpoint);
  if (idToken) url.searchParams.set('id_token_hint', idToken);
  url.searchParams.set('post_logout_redirect_uri', APP_BASE_URL);
  return url.toString();
}

// ---- Customer Account API（GraphQL）呼び出し ----

const CUSTOMER_QUERY = `
  query CustomerOrders {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          number
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            nodes {
              name
              quantity
              image {
                url
                altText
              }
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

// APIの生レスポンス型（入れ子）
type RawCustomerResponse = {
  data?: {
    customer: {
      firstName: string | null;
      lastName: string | null;
      emailAddress: { emailAddress: string | null } | null;
      orders: { nodes: AccountOrder[] };
    } | null;
  };
  errors?: Array<{ message: string }>;
};

/**
 * アクセストークンで顧客情報＋注文履歴を取得。
 * トークン失効時は401を投げる（呼び出し側でリフレッシュへ誘導）。
 */
export async function getCustomerWithOrders(accessToken: string): Promise<AccountCustomer> {
  const endpoint = await getGraphqlEndpoint();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken, // Customer Account APIは "Bearer" を付けない
      'User-Agent': 'fuku-dev-store-nextjs',
    },
    body: JSON.stringify({ query: CUSTOMER_QUERY }),
    cache: 'no-store',
  });

  if (res.status === 401) {
    throw new UnauthorizedError();
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Customer Account API error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as RawCustomerResponse;
  if (json.errors?.length || !json.data?.customer) {
    throw new Error(json.errors?.[0]?.message ?? '顧客情報を取得できませんでした。');
  }

  const c = json.data.customer;
  // 入れ子を平坦化して扱いやすい形に
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.emailAddress?.emailAddress ?? null,
    orders: c.orders.nodes,
  };
}

// トークン失効を表す専用エラー
export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized: access token expired or invalid');
    this.name = 'UnauthorizedError';
  }
}
