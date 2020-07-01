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
