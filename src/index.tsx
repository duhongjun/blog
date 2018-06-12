import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import registerServiceWorker from './common/registerServiceWorker'
import 'src/assets/css/index.css'
import RouteConfig from './router'
import { store } from './store'

ReactDOM.render(
  <Provider store={store}>
    <RouteConfig />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
