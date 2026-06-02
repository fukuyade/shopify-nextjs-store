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
