import styled from "styled-components";
import * as Forms from "./Forms";

const LoginContainer = styled.div`
  padding: 4rem;
  width: 20rem;
  background: rgba(235, 235, 235, 1);

  @media (max-width: 500px) {
    width: -webkit-fill-available;
    box-shadow: 0px;
    padding: 2rem;
  }

  @media (min-width: 500px) {
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

export const LoginForm = (props: any): JSX.Element => (
  <LoginContainer>
    <Header>REGISTER</Header>
    <div>
      <Forms.GenericInput label="FIRST NAME" onChange={props.setFirstName} />
      <Forms.GenericInput label="LAST NAME" onChange={props.setLastName} />
      <Forms.GenericInput label="EMAIL" onChange={props.setEmail} />
      <StatusText>{props.status}</StatusText>
      <Forms.Submit label="REGISTER" onSubmit={props.onSubmit} />
    </div>
  </LoginContainer>
);
