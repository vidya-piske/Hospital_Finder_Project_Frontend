import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
    user: userReducer,
    hospitalDetails: userReducer
});

const store = createStore(rootReducer);

export { rootReducer, store };