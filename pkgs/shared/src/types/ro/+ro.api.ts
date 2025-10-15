import Type from 'typebox'

export const ApiRO = Type.Generic(
  [Type.Parameter('T')],
  Type.Object({
    data: Type.Ref('T'),
    status: Type.Boolean(),
    statusCode: Type.Number(),
  }),
)

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type RefUUID = UUID
