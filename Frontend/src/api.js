
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api";

export async function api(path, options = {}) {
  const token = sessionStorage.getItem("askgpt_token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
