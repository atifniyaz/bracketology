import styled from "styled-components";

const SubmitButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem;
  width: -webkit-fill-available;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #fff;

  &:hover {
    background-color: #000;
    color: white;
  }
`;

const InputGroup = styled.div`
  margin: 1rem 0;

  > * {
    width: -webkit-fill-available;
  }
`;

const InputGroupLabel = styled.div`
  text-align: left;
  padding: 0.25rem 0;
  font-size: small;
`;

const StyledInput = styled.input`
  padding: 0.75rem;
  border: 1px solid black;
  border-radius: 4px;
`;

export const Password = (props: any): JSX.Element => (
  <InputGroup>
    <InputGroupLabel>{props.label}</InputGroupLabel>
    <StyledInput type="password" name="password" placeholder={props.label} />
  </InputGroup>
);

export const GenericInput = (props: any): JSX.Element => (
  <InputGroup>
    <InputGroupLabel>{props.label}</InputGroupLabel>
    <StyledInput
      type="text"
      name={props.name ?? ""}
      placeholder={props.label}
      onChange={(ev) => {
        props.onChange(ev.target.value);
      }}
    />
  </InputGroup>
);

export const Submit = (props: any): JSX.Element => (
  <SubmitButton type="button" onClick={props.onSubmit}>
    Sign Up
  </SubmitButton>
);
