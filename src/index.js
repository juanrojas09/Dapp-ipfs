import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import Backg from'./components/Backg';
ReactDOM.render(<App />, document.getElementById('root'));



serviceWorker.unregister();
