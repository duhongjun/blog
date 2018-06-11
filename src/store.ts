import { init } from '@rematch/core'
// import immerPlugin from '@rematch/immer'
import * as models from './models'

export { models }
export type models = typeof models

// const immer = immerPlugin()

export const store = init({
  models
  // plugins: [immer]
})
