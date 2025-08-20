import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './App.css';
import 'animate.css';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';


// Redux
import { Provider } from 'react-redux';
import store from './store/index.js';

// Router
import { /*BrowserRouter*/ HashRouter as Router  } from 'react-router-dom';

ReactDOM.createRoot(
  document.getElementById('root'),
).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
