type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type ParamLiteral = string | number | boolean | null;

type PathParameterLike = `${string}/${":" | "*"}${string}`;

type IsPathParameter<Part extends string> = Part extends `:${infer Param}`
  ? Param
  : Part extends "*"
  ? "*"
  : never;

type GetPathParameter<Path extends string> =
  Path extends `${infer A}/${infer B}`
    ? IsPathParameter<A> | GetPathParameter<B>
    : IsPathParameter<Path>;

type _ResolvePath<Path extends string> = Prettify<
  {
    [Param in GetPathParameter<Path> as Param extends `${string}?`
      ? never
      : Param]: ParamLiteral;
  } & {
    [Param in GetPathParameter<Path> as Param extends `${infer OptionalParam}?`
      ? OptionalParam
      : never]?: ParamLiteral;
  }
>;
export type ResolvePath<Path extends string> = Path extends PathParameterLike
  ? _ResolvePath<Path>
  : {};

export type FetchBaseOptions = {
  baseHeaders?: Record<string, string>;
};

export type FetchOptions<
  TParams = Record<string, string | number>,
  TQuery = Record<string, any>,
  TBody = Record<string, any>
> = {
  queries?: TQuery;
  body?: TBody;
  params?: TParams;
};

export type AllowedFetchHttpMethods =
  | "GET"
  | "POST"
  | "PATCH"
  | "DELETE"
  | "PUT";

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
