import {SET_ALERT, REMOVE_ALERT} from "../actions/types";

const initState = [];

export default function (state = initState, action) {
    const {type, payload} = action;
    switch (action.type) {
        case SET_ALERT:
            return [...initState, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}