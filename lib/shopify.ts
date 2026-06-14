import {
  Product,
  ProductsResponse,
  ProductDetail,
  ProductDetailResponse,
  Cart,
} from '@/types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function shopifyFetch(query: string, variables = {}) {
  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    // Next.js の Server Component キャッシュ設定
    next: { revalidate: 60 }, // 60秒ごとに再検証
  });
  return response.json();
}

// タグで商品を絞り込み（コレクションページ用）
const PRODUCTS_BY_TAG_QUERY = `
  query GetProductsByTag($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProductsByTag(tag: string, count = 24): Promise<Product[]> {
  const response: ProductsResponse = await shopifyFetch(PRODUCTS_BY_TAG_QUERY, {
    query: `tag:${tag}`,
    first: count,
  });
  return response.data.products.edges.map((edge) => edge.node);
}

// 商品検索
const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function searchProducts(keyword: string, count = 24): Promise<Product[]> {
  if (!keyword.trim()) return [];
  const query = `title:*${keyword}* OR tag:${keyword}`;
  const response: ProductsResponse = await shopifyFetch(SEARCH_PRODUCTS_QUERY, {
    query,
    first: count,
  });
  return response.data.products.edges.map((edge) => edge.node);
}

// 商品一覧取得
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProducts(count = 12): Promise<Product[]> {
  const response: ProductsResponse = await shopifyFetch(PRODUCTS_QUERY, {
    first: count,
  });
  return response.data.products.edges.map((edge) => edge.node);
}

// 商品詳細取得
const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const response: ProductDetailResponse = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, {
    handle,
  });
  return response.data.productByHandle ?? null;
}

// カートのフィールド（クエリ・ミューテーションで共通利用）
const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// カート作成
const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ${CART_FIELDS}
      }
    }
  }
`;

export async function createCart(variantId: string, quantity = 1): Promise<Cart> {
  const response = await shopifyFetch(CART_CREATE_MUTATION, {
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return response.data.cartCreate.cart;
}

// カートに商品追加
const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
    }
  }
`;

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  const response = await shopifyFetch(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return response.data.cartLinesAdd.cart;
}

// カートをIDで取得（ページ更新時の復元用）
const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

export async function getCart(cartId: string): Promise<Cart | null> {
  const response = await shopifyFetch(CART_QUERY, { cartId });
  return response.data.cart ?? null;
}

// カートの商品個数を変更
const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
    }
  }
`;

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const response = await shopifyFetch(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  return response.data.cartLinesUpdate.cart;
}

// カートから商品を削除
const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
    }
  }
`;

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const response = await shopifyFetch(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  return response.data.cartLinesRemove.cart;
}
