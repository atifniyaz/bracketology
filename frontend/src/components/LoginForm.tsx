import styled from "styled-components";
import * as Forms from "./Forms";

const LoginContainer = styled.div`
  padding: 4rem;
  width: 20rem;

  @media (max-width: 500px) {
    width: -webkit-fill-available;
    box-shadow: 0px;
    padding: 2rem;
  }

  @media (min-width: 500px) {
    margin: auto;
    border: 1px solid black;
    border-radius: 10px;
  }
`;

const Header = styled.div`
  padding: 1rem;
  font-size: larger;
  font-weight: bold;
  text-align: center;
`;

const StatusText = styled.div`
  font-size: small;
  color: red;
`

export const LoginForm = (props: any): JSX.Element => (
  <LoginContainer>
    <Header>Register</Header>
    <div>
      <Forms.GenericInput label="First Name" onChange={props.setFirstName} />
      <Forms.GenericInput label="Last Name" onChange={props.setLastName} />
      <Forms.GenericInput label="Email" onChange={props.setEmail} />
      <StatusText>{props.status}</StatusText>
      <Forms.Submit label="Register" onSubmit={props.onSubmit} />
    </div>
  </LoginContainer>
);
