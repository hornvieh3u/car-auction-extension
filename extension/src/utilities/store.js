const STORE_TOKEN_KEY = "token";

export const saveToken = token => {
  localStorage.setItem(STORE_TOKEN_KEY, JSON.stringify(token));
  return true;
}

export const getToken = () => {
  let tokenStore = localStorage.getItem(STORE_TOKEN_KEY);
  return JSON.parse(tokenStore);
}

export const removeToken = () => {
  localStorage.removeItem(STORE_TOKEN_KEY);
  return true;
}