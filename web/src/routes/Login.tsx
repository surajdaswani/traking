import { STRINGS } from "../lib/strings";

export function Login() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/connect/google`;
  };

  return (
    <div>
      <h1>{STRINGS.app.name}</h1>
      <button onClick={handleLogin}>{STRINGS.auth.loginButton}</button>
    </div>
  );
}
