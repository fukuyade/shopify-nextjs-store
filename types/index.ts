export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags?: string[]; // 小分類フィルタ用（getProductsByTagでのみ取得）
  priceRange: {
    minVariantPrice: Money;
  };
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
};

export type ProductEdge = {
  node: Product;
};

export type ProductsResponse = {
  data: {
    products: {
      edges: ProductEdge[];
    };
  };
};

// 商品詳細ページ用
export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
};

export type ProductDetail = Product & {
  descriptionHtml: string;
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
};

export type ProductDetailResponse = {
  data: {
    productByHandle: ProductDetail;
  };
};

// カート用
export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    product: {
      title: string;
      handle: string;
      images: {
        edges: Array<{ node: ProductImage }>;
      };
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: Money;
  };
  lines: {
    edges: Array<{ node: CartLine }>;
  };
};

/* =========================================================
 * Customer Account API（新方式・OAuth2）用の型
 * Storefront APIとはスキーマが異なる（emailAddressがオブジェクト等）
 * ======================================================= */

// 注文の明細1行（Customer Account APIのLineItem）
export type AccountLineItem = {
  name: string;
  quantity: number;
  image: ProductImage | null;
  totalPrice: Money | null;
};

// 注文1件（Customer Account APIのOrder）
export type AccountOrder = {
  id: string;
  name: string; // 表示用の注文番号（例: #1001）
  number: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  totalPrice: Money;
  lineItems: {
    nodes: AccountLineItem[];
  };
};

// 顧客情報（注文履歴含む）。APIの入れ子を平坦化した後の形
export type AccountCustomer = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null; // 顧客メタフィールド custom.phone に保存
  orders: AccountOrder[];
};

// OAuthトークン交換のレスポンス
export type TokenSet = {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token: string;
};
