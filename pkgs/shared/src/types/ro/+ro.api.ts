export type ApiRO<T> = {
  data: T
  status: boolean
  statusCode: number
}

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type RefUUID = UUID
