import { useState } from "react";
import { LoginForm } from "../components/LoginForm";

export function Register() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const submit = async () => {
    console.log("Hit Submit");
    try {
      await create_user(first_name, last_name, email);
    } catch (err) {
      setStatus("Failed to register. Please try again.");
    }
  };

  return (
    <LoginForm
      onSubmit={submit}
      setFirstName={setFirstName}
      setLastName={setLastName}
      setEmail={setEmail}
      status={status}
    />
  );
}

async function create_user(
  first_name: string,
  last_name: string,
  email: string
) {
  return fetch(
    "https://atifniyaz-bracketology-g4v7wvjvcvgvq-4000.githubpreview.dev/api/users/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hello: "hello" }),
    }
  );
}

export default Register;
