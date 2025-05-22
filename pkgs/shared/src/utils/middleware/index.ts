import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
  RouteRecordName,
} from 'vue-router';

import type { Middleware } from '#/utils/middleware/types.ts';

export class MiddlewareController {
  constructor(
    private readonly router: Router,
    private readonly global: Middleware[] = [],
  ) {}
  async hook(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    let redirected = false;
    const middlewares = (to.meta?.middlewares as Middleware[]) ?? [];
    for (const middleware of [...this.global, ...middlewares]) {
      const resultPipeline = await middleware({
        to,
        from,
        next: (name: RouteRecordName) => {
          redirected = true;
          next({ name });
        },
        forceRedirect: (url: string) => (window.location.href = url),
        redirect: (url: string) => {
          redirected = true;
          this.router.push(url);
        },
      });
      if (resultPipeline === false) break;
    }
    if (!redirected) next();
  }
}

export * from './vue/vue.hook-router';
