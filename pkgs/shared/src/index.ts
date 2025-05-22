import { b } from '#/utils/aaa';

export * from './utils/middleware';

export function test() {
  return 'HI!' + b() * 2;
}
