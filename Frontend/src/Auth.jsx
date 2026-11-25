
import { useState } from "react";
import { api } from "./api.js";
import "./Auth.css";

export default function Auth({ onAuth }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api(
        `/auth/${isRegister ? "register" : "login"}`,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      sessionStorage.setItem("askgpt_token", data.token);
      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>
        <div className="authIcon">✦</div>

        <h1>AskGPT</h1>
        <p>Private conversations. Secure by design.</p>

        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={isRegister ? 10 : undefined}
        />

        {error && <p className="authError">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isRegister
              ? "Sign Up"
              : "Login"}
        </button>

        <p>
          <button
            type="button"
            className="authSwitch"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}
