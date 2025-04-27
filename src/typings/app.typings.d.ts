export as namespace IApp;

export interface DataKeys {
  [key: string]: any;
}

export interface IRequest {
  [key: string]: any;
}

export interface IResponse<T> {
  data?: T;
  type?: string;
}

export interface Entity<T> {
  success?: boolean;
  data?: T;
  type?: string;
}

export interface Dispatcher {
  httpCode: number;
  statusCode: number;
  message: string;
  data?: DataKeys;
}

export interface PaginationResult {
  next: boolean;
  result: any[];
  page: number;
  total?: number;
}
