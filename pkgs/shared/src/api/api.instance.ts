import { createFetch } from '#/api/api.fetch'

export const API_ENDPOINT = 'http://127.0.0.1:3000/api/v1'

export const API_PUBLIC = createFetch(API_ENDPOINT)
export const API_PRIVATE = createFetch(API_ENDPOINT)

API_PRIVATE.get('/user/:id', {
  params: {
    id: 5,
  },
})
