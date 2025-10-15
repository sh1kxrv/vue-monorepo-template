import type {
  AllowedFetchHttpMethods,
  FetchBaseOptions,
  FetchOptions,
  Interceptor,
  InterceptorResponse,
  ResolvePath,
} from "#/api/api.types";
import { parseParams, parseQueries } from "#/api/utils/api.utils";

export class ApiFetchError extends Error {
  code: number;
  data: any;
  constructor(code: number, message: string, data: any) {
    super("ApiFetchError");
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

export function createFetch<const BaseURL extends string>(
  baseUrl: BaseURL,
  { baseHeaders }: FetchBaseOptions = {}
) {
  baseHeaders = baseHeaders || {};
  baseUrl = baseUrl || ("" as BaseURL);

  const _interceptorsRequest = [] as Interceptor[];
  const _interceptorsResponse = [] as InterceptorResponse[];

  function makeRequest<
    TMethod extends AllowedFetchHttpMethods = AllowedFetchHttpMethods
  >(method: TMethod) {
    return async function <
      TResponse = any,
      TQuery = Record<string, any>,
      TBody = Record<string, any>,
      const PathURL extends string = ""
    >(
      url: PathURL,
      options: TMethod extends "GET" | "DELETE"
        ? Omit<
            FetchOptions<ResolvePath<`${BaseURL}${PathURL}`>, TQuery, TBody>,
            "body"
          >
        : FetchOptions<ResolvePath<`${BaseURL}${PathURL}`>, TQuery, TBody>
    ) {
      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
        ...baseHeaders,
      };

      const results = [];

      for (const i of _interceptorsRequest) {
        const res = await i({
          method,
          headers,
          url,
          options,
        });
        results.push(res);
      }

      for (const result of results) {
        if (result === false) {
          console.error("Some interceptors return false");
          return null;
        } else if (result && result.$FETCH_SYSTEM) {
          switch (result.$type) {
            case "switch-method":
              method = result.method;
              break;
          }
        } else if (result) {
          console.warn("Overrided response", url, "->", result);
          return result;
        }
      }

      if (options.params) url = parseParams(url, options.params) as PathURL;
      if (options.queries) url = parseQueries(url, options.queries) as PathURL;

      let requestBody = undefined;
      if (method !== "DELETE" && method !== "GET" && "body" in options) {
        requestBody =
          options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body || {});
      }

      const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers,
        body: requestBody,
        credentials: "include",
      });

      const data = (await response.json()) as TResponse;

      if (response.status === 204) return null;

      if (!response.ok) {
        const dataResponse = data as any;
        return Promise.reject(
          new ApiFetchError(response.status, dataResponse.message, dataResponse)
        );
      }

      const resultsResponse = [];

      for (const i of _interceptorsResponse) {
        const res = await i({
          method,
          headers,
          url,
          options,
          data: data as Record<string, any>,
        });
        resultsResponse.push(res);
      }

      if (resultsResponse.some(Boolean)) {
        return resultsResponse.filter(Boolean)[0] as TResponse;
      }

      return data as TResponse;
    };
  }

  const get = makeRequest("GET");
  const post = makeRequest("POST");
  const patch = makeRequest("PATCH");
  const $delete = makeRequest("DELETE");
  const put = makeRequest("PUT");

  const intercept = (interceptor: Interceptor) => {
    _interceptorsRequest.push(interceptor);
  };

  const interceptResponse = (interceptor: InterceptorResponse) => {
    _interceptorsResponse.push(interceptor);
  };

  return {
    intercept,
    interceptResponse,

    get,
    post,
    patch,
    delete: $delete,
    put,
  };
}

export function switchMethod(method: AllowedFetchHttpMethods) {
  return {
    $FETCH_SYSTEM: true,
    $type: "switch-method",
    method,
  };
}

export function defineInterceptor(interceptor: Interceptor) {
  return interceptor;
}

export function defineInterceptorResponse(interceptor: InterceptorResponse) {
  return interceptor;
}
