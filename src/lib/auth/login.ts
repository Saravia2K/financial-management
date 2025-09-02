export default async function login(email: string, password: string) {
  const fetchResponse = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return fetchResponse.status == 200;
}
