import styled from "styled-components";
import * as Forms from "./Forms";

const LoginContainer = styled.div`
  padding: 4rem;
  width: 20rem;
  background: rgba(235, 235, 235, 1);

  @media (max-width: 706px) {
    width: -webkit-fill-available;
    box-shadow: 0px;
    padding: 2rem;
  }

  @media (min-width: 706px) {
    margin: auto;
  }
`;

const Header = styled.div`
  font-size: larger;
  text-align: left;
`;

const StatusText = styled.div`
  font-size: small;
  color: red;
`;

export const LoginForm = ({
  setForm,
  onSubmit,
}: {
  setForm: (key: string, value: any) => void;
  onSubmit: () => void;
}) => (
  <LoginContainer>
    <Header>REGISTER</Header>
    <div>
      <Forms.GenericInput
        label="FIRST NAME"
        onChange={(v: string) => setForm("first_name", v)}
      />
      <Forms.GenericInput
        label="LAST NAME"
        onChange={(v: string) => setForm("last_name", v)}
      />
      <Forms.GenericInput
        label="EMAIL"
        onChange={(v: string) => setForm("email", v)}
      />
      <Forms.GenericInput
        label="AFFILIATION"
        onChange={(v: string) => setForm("affiliation", v)}
      />
      <Forms.GenericSelect
        label="KNOWLEDGE"
        onChange={(v: string) => setForm("knowledge", v)}
      >
        <option value="0">None</option>
        <option value="1">Little</option>
        <option value="2">Moderate</option>
        <option value="3">Expert</option>
      </Forms.GenericSelect>
      <Forms.Submit label="REGISTER" onSubmit={onSubmit} />
    </div>
  </LoginContainer>
);
