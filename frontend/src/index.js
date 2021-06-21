import React from 'react';
import ReactDOM from 'react-dom';
import "./styles/base.scss"
import Root from './Root';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();