import { SET_USER, CLEAR_USER, HOSPITAL_DETAILS } from "../actions/userActions";

const initialState = {
    user: null,
    hospitalDetails: {}
}

const userReducer = (state=initialState, action) => {
    switch(action.type){
        case SET_USER:
            return {...state, user: action.payload};
        case CLEAR_USER:
            return {...state, user: null};
        case HOSPITAL_DETAILS:
            return {...state, hospitalDetails: action.payload};
        default:
            return state;
    }
}

export default userReducer

