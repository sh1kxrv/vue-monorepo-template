import type {
  AllowedFetchHttpMethods,
  FetchBaseOptions,
  FetchOptions,
  Interceptor,
  InterceptorResponse,
  ResolvePath,
} from '#/api/api.types'
import { parseParams, parseQueries } from '#/api/utils/api.utils'
import { type TSchema, type Static } from 'typebox'
import z from 'zod'

export class ApiFetchError extends Error {
  code: number
  data: any
  constructor(code: number, message: string, data: any) {
    super('ApiFetchError')
    this.code = code
    this.message = message
    this.data = data
  }
}

export function createFetch<const BaseURL extends string>(
  baseUrl: BaseURL,
  { baseHeaders, options: baseOptions }: FetchBaseOptions = {},
) {
  baseHeaders = baseHeaders || {}
  baseUrl = baseUrl || ('' as BaseURL)

  const _interceptorsRequest = [] as Interceptor[]
  const _interceptorsResponse = [] as InterceptorResponse[]

  function makeRequest<
    TMethod extends AllowedFetchHttpMethods = AllowedFetchHttpMethods,
  >(method: TMethod) {
    return async function <
      TResponse extends TSchema | z.ZodObject,
      PathURL extends string,
    >(
      url: PathURL,
      options: TMethod extends 'GET' | 'DELETE'
        ? Omit<
            FetchOptions<TResponse, ResolvePath<`${BaseURL}${PathURL}`>>,
            'body'
          >
        : FetchOptions<TResponse, ResolvePath<`${BaseURL}${PathURL}`>>,
    ):
      | Promise<
          | (TResponse extends z.ZodObject
              ? z.infer<TResponse>
              : never | TResponse extends TSchema
                ? Static<TResponse>
                : never)
          | null
        >
      | never {
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json',
        ...baseHeaders,
      }

      const results = []

      for (const i of _interceptorsRequest) {
        const res = await i({
          method,
          headers,
          url,
          options: options as any,
        })
        results.push(res)
      }

      for (const result of results) {
        if (result === false) {
          console.error('Some interceptors return false')
          return null
        } else if (result && result.$FETCH_SYSTEM) {
          switch (result.$type) {
            case 'switch-method':
              method = result.method
              break
          }
        } else if (result) {
          console.warn('Overrided response', url, '->', result)
          return result
        }
      }

      if (options.params) url = parseParams(url, options.params) as PathURL
      if (options.queries) url = parseQueries(url, options.queries) as PathURL

      let requestBody = undefined
      if (method !== 'DELETE' && method !== 'GET' && 'body' in options) {
        requestBody =
          options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body || {})
      }

      const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
        body: requestBody,
        ...(baseOptions || {}),
      })

      const data = await response.json()

      if (response.status === 204) return null

      if (!response.ok) {
        const errorResponse = data as any
        return Promise.reject(
          new ApiFetchError(
            response.status,
            errorResponse?.message,
            errorResponse,
          ),
        )
      }

      const resultsResponse = []

      for (const i of _interceptorsResponse) {
        const res = await i({
          method,
          headers,
          url,
          options: options as any,
          data: data as Record<string, any>,
        })
        resultsResponse.push(res)
      }

      if (resultsResponse.some(Boolean)) {
        return resultsResponse.filter(Boolean)[0]
      }

      return data
    }
  }

  return {
    intercept: (interceptor: Interceptor) => {
      _interceptorsRequest.push(interceptor)
    },
    interceptResponse: (interceptor: InterceptorResponse) => {
      _interceptorsResponse.push(interceptor)
    },

    get: makeRequest('GET'),
    post: makeRequest('POST'),
    patch: makeRequest('PATCH'),
    delete: makeRequest('DELETE'),
    put: makeRequest('PUT'),
  }
}

export function switchMethod(method: AllowedFetchHttpMethods) {
  return {
    $FETCH_SYSTEM: true,
    $type: 'switch-method',
    method,
  }
}

export function defineInterceptor(interceptor: Interceptor) {
  return interceptor
}

export function defineInterceptorResponse(interceptor: InterceptorResponse) {
  return interceptor
}
