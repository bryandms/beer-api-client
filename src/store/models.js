export const userId = {
  state: localStorage.getItem("userId") || null,
  reducers: {
    setUserId: (s, p) => (s = p),
  },
};

export const token = {
  state: localStorage.getItem("token") || null,
  reducers: {
    setToken: (s, p) => (s = p),
  },
};

export const isAuth = {
  state: localStorage.getItem("isAuth") || false,
  reducers: {
    setIsAuth: (s, p) => (s = p),
  },
};
