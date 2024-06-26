import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("auth-token");
    setIsAuthenticated(!!token); // Gunakan !! untuk memastikan nilainya boolean
  }, []);

  return { isAuthenticated };
};

// export const login = (token) => {
//   Cookies.set("auth-token", token, { expires: 1 }); // Set cookie for 1 day
// };

// export const logout = () => {
//   Cookies.remove("auth-token");
// };

export default useAuth;
