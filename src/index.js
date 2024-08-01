import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './redux/store';
import App from './App'; 
import './index.css';

// Create the Redux store with the rootReducer
const store = createStore(rootReducer);

// Render the React application, wrapping it in the Provider component to pass down the Redux store
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
