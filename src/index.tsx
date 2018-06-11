import React from 'react'
import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker'
import 'src/assets/css/index.css'
import RouteConfig from './router'
// import { store } from './store'

const App = () => (
  // <Provider store={store}>
    <RouteConfig />
  // </Provider>
)

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
registerServiceWorker()
