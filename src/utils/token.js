const TOKEN_KEY = 'token';

export const tokenService = {
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  }
};