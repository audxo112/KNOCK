import { createStore, applyMiddleware } from "redux";
import modules from "./modules";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

const configure = () => {
    // const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
    const middleware = [ReduxThunk]
    const store = createStore(modules, composeWithDevTools(
        applyMiddleware(...middleware)
    ));
    return store;
}

export default configure;