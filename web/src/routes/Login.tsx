export function Login() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/connect/google`;
  };

  return (
    <div>
      <h1>traking</h1>
      <button onClick={handleLogin}>Iniciar sesión con Google</button>
    </div>
  );
}
