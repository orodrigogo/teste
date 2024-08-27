import { useEffect } from "react";
import { api } from "../providers/axios";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export function useSignOutOnUnauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          const message = error.response?.data.message;

          if (status === 401 && message === "Unauthorized") {
            navigate("/sign-in", { replace: true });
          } else {
            throw error;
          }
        }
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);
}
