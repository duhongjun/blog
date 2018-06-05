import React from 'react'
import ReactDOM from 'react-dom'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import registerServiceWorker from './registerServiceWorker'
import 'src/assets/css/index.css'
import RouteConfig from './router'
import * as models from './models'

dayjs.extend(relativeTime)

const store = init({
  models
})

const App = () => (
  <Provider store={store}>
    <RouteConfig />
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
registerServiceWorker()
