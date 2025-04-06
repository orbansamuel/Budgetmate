import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function useAutoLogout(timeoutMinutes = 15) {
  const { logout } = useAuth();

  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Inaktivitás miatt kijelentkeztél.");
        logout();
      }, timeoutMinutes * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [logout, timeoutMinutes]);
}
