export const TOKEN_KEY = "@bearertoken";
export const ID_KEY = "@id";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY) ? localStorage.getItem(TOKEN_KEY) : window.location = '/';
export const getId = () => localStorage.getItem(ID_KEY);
export const login = (token, id) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ID_KEY, id);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ID_KEY);
};