export interface Message {
  message: string;
}

export interface ErrorResponse {
  name: 'TypeError' | 'ValidationError' | 'ServerError' | 'NotFoundError';
  message: string;
  statusCode: number;
  error: string;
  errors?: Record<string, string>;
}

export interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface CreateCategory {
  name: string;
  color: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  category: Category;
  quantityStock: number;
  name: string;
  averageUnitCost: number;
  currentSalePrice: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  _id: string;
  product: Product;
  category: Category;
  quantityOrder: number;
  unitCost: number;
  createdAt: string;
  updatedAt: string;
}
