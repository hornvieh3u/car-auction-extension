import { removeToken } from "./store"

export const logOut = () => {
  if ( chrome && chrome.storage ) {
    chrome.storage.local.set({
      user: null,
      token: null
    })
  }
  removeToken();
  location.reload();
}