import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { apiFetch } from "../lib/apiClient";
import { setSession } from "../lib/auth";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = searchParams.get("access_token");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!accessToken) {
      console.error("No se recibió access_token de Google");
      return;
    }

    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

    apiFetch<{ jwt: string; refreshToken: string }>(
      `/api/auth/google/callback?access_token=${accessToken}`,
      { skipAuth: true },
    ).then((data) => {
      setSession(data.jwt, data.refreshToken);
      navigate("/", { replace: true });
    });
  }, [accessToken, navigate]);

  return <div>Verificando sesión...</div>;
}
