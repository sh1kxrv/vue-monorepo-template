import type { RouteLocationNormalized } from 'vue-router';

type Next = (name?: string) => void;
type ForceRedirect = (url: string) => void;
type Redirect = (url: string) => void;

export interface MiddlewareOptions {
  forceRedirect: ForceRedirect;
  from: RouteLocationNormalized;
  next: Next;
  redirect: Redirect;
  to: RouteLocationNormalized;
}

export type Middleware = (
  options: MiddlewareOptions,
) => boolean | Promise<boolean>;
