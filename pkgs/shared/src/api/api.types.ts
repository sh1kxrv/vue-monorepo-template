export type FetchBaseOptions = {
  baseHeaders?: Record<string, string>;
};

export type FetchOptions = {
  queries?: Record<string, any>;
  body?: Record<string, any>;
  params?: Record<string, string | number>;
};

export type AllowedFetchHttpMethods = "GET" | "POST" | "PATCH" | "DELETE";

export type InterceptorOptions = {
  method: AllowedFetchHttpMethods;
  headers: Record<string, string>;
  url: string;
  options: FetchOptions;
};

export type InterceptorResponseOptions = InterceptorOptions & {
  data: Record<string, any>;
};

export type Interceptor = (options: InterceptorOptions) => Promise<any> | any;

export type InterceptorResponse = (
  options: InterceptorResponseOptions
) => Promise<any> | any;
