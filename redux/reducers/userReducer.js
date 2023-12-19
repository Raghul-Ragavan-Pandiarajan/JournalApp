import { USER_ADD, USER_DELETE } from '../constants';
const initialState = {
    user : {}
};
const userReducer = (state = initialState, action) => {
switch(action.type) {
case USER_ADD: {
    const { name, photoURL, bio } = action.payload
return {
...state,
user : { name, photoURL, bio }
};
}
case USER_DELETE: {
    const { name } = action.payload
return {
  ...state, 
  user : {}
}

}

default:
return state;
}
}
export default userReducer;