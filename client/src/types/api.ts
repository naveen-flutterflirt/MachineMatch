export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface IPaginatedResponse<T = any> {
  success: boolean;
  data: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    data: T[];
  };
}
