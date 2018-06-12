import { init } from '@rematch/core'
import immerPlugin from '@rematch/immer'
// import createLoadingPlugin from '@rematch/loading'
import * as models from './models'

export { models }
export type models = typeof models

const immer = immerPlugin()
// const loading = createLoadingPlugin({})

export const store = init({
  models,
  plugins: [immer]
})
