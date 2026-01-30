import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <Router>
    <Switch>
      <App />
    </Switch>
  </Router>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
