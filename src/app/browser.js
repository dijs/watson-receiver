import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(
  <App {...window.__APP_INITIAL_STATE__} />,
  document.getElementById('root')
);
