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
