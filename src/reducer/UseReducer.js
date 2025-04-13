export const initialState = {
    isAuthenticated: false,
    role: null, // 'user' or 'admin'
  };
  
  export const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_USER":
        return { ...state, isAuthenticated: true, role: "user" };
  
      case "LOGIN_ADMIN":
        return { ...state, isAuthenticated: true, role: "admin" };
  
      case "LOGOUT":
        return { ...state, isAuthenticated: false, role: null };
  
      default:
        return state;
    }
  };
  