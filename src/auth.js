import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("auth-token");
    setIsAuthenticated(!!token); // Gunakan !! untuk memastikan nilainya boolean

    // Misalkan Anda mendapatkan detail pengguna dari token
    if (token) {
      const user = parseToken(token); // Buat fungsi parseToken sesuai kebutuhan Anda
      setCurrentUser(user);
    }
  }, []);

  return { isAuthenticated, currentUser };
};

export const login = (token) => {
  Cookies.set("auth-token", token, { expires: 1 }); // Set cookie for 1 day
};

export const logout = () => {
  Cookies.remove("auth-token");
};

const parseToken = (token) => {
  // Parse token dan kembalikan objek user
  // Misalnya:
  // return { uid: "user123", name: "John Doe" };
};

export default useAuth;
