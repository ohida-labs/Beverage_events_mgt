export async function ApiFetchHelper(
  path: string,
  token: string,
  options: RequestInit = {},
) {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
