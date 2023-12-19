import { USER_ADD, USER_DELETE } from "../constants";

export const addUser = (name, photoURL, bio) => {
    return {
    type: USER_ADD,
    payload: {
       name,
       photoURL,
       bio
      }
    }
    }
  export const deleteUser = name => {
      return {
      type: USER_DELETE,
      payload: { name }
      }
  }