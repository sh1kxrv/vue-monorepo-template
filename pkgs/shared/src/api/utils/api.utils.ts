export function parseQueries(url: string, queries: Record<string, any>) {
  for (const key in queries) {
    if (queries[key] === undefined || key.startsWith("!")) {
      delete queries[key];
    }
  }
  const _params = new URLSearchParams(queries);
  const buildedParams = `?${_params.toString()}`;
  if (buildedParams.length > 1) url += buildedParams;
  return url;
}

export function parseParams(url: string, params: Record<string, any>) {
  for (const key in params) {
    const value = params[key];
    url = url.replace(`:${key}`, value);
  }
  return url;
}
