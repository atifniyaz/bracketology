import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PopupNotification } from "./components/Common";
import { LoginForm } from "./components/LoginForm";
import { Modal } from "./components/Modal";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormDataNative] = useState({});
  const setFormData = (key: string, value: string) => {
    setFormDataNative({ ...formData, [key]: value });
  };

  const [status, setStatus] = useState<string | null>(null);
  const setMessage = (message: string) => {
    setStatus(message);
    setTimeout(() => {
      setStatus(null);
    }, 3000);
  };

  const [token, setToken] = useState(null);

  const submit = async () => {
    create_user(formData)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const { access_token } = res;
          setToken(access_token);
        } else {
          throw new Error(res.response);
        }
      })
      .catch((err) => {
        setMessage(`Failed to register! ${err.message} Please try again.`);
      });
  };

  return (
    <>
      {token && (
        <Modal
          title="Success!"
          onSubmit={() => {
            navigate("/create", {
              state: { token },
            });
          }}
          submitText="Ok"
        >
          <p>You have successfully registered!</p>
          <p>Please use this token when you submit your bracket:</p>
          <h3>{token}</h3>
        </Modal>
      )}
      <LoginForm onSubmit={submit} setForm={setFormData} />
      <PopupNotification visible={status !== null} hidden={status === null}>
        {status}
      </PopupNotification>
    </>
  );
}

async function create_user(formData: Record<string, string>) {
  const body = {
    user: formData,
  };

  return fetch("/api/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export default Register;
