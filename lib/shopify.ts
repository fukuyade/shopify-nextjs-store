import { Product, ProductsResponse, ProductDetail, ProductDetailResponse, Cart } from '@/types';

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
