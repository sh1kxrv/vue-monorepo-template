import type { RouterOptions } from 'vue-router';

import type { Middleware } from '#/utils/middleware/types';

import { createRouter as createVueRouter } from 'vue-router';

import { MiddlewareController } from '#/utils/middleware';

interface ToolkitRouter extends RouterOptions {
  global: Middleware[];
  middleware: boolean;
}

export function createRouter(routerOptions: ToolkitRouter) {
  const vRouter = createVueRouter(routerOptions);
  if (routerOptions.middleware) {
    const controller = new MiddlewareController(vRouter, routerOptions.global);
    vRouter.beforeEach(controller.hook.bind(controller));
  }
  return vRouter;
}
