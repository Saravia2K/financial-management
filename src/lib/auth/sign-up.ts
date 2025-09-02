export default async function signUp(data: SignUpData) {
  const fetchResponse = await fetch("/api/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return fetchResponse.status == 201;
}

type SignUpData = {
  name: string;
  email: string;
  password: string;
};
