import { combineReducers } from "redux";
import journalReducer from "./journalReducer";
import userReducer from "./userReducer";

export default combineReducers(
    { journalReducer, userReducer }
    );