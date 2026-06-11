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

// 顧客（ユーザー認証）用
export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

// Shopifyのバリデーションエラー
export type CustomerUserError = {
  code: string | null;
  field: string[] | null;
  message: string;
};

// 注文の明細1行
export type OrderLineItem = {
  title: string;
  quantity: number;
  variant: {
    image: ProductImage | null;
    price: Money;
    product: {
      handle: string;
    } | null;
  } | null;
};

// 注文1件
export type Order = {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  totalPrice: Money;
  lineItems: {
    edges: Array<{ node: OrderLineItem }>;
  };
};

// 顧客情報（注文履歴含む）
export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  orders: {
    edges: Array<{ node: Order }>;
  };
};
