import React from 'react'
import ReactDOM from 'react-dom'
import Routers from './views/shared/routes'
(window.defaultRows = window.outerHeight <= 900 ? 10 : 15)
ReactDOM.render(
  <Routers />,
  document.getElementById('root')
);
