import styled from "styled-components";

const SubmitButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem;
  width: -webkit-fill-available;
  border: 0;
  border-radius: 4px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  background-color: blue;
  color: white;

  &:hover {
    background-color: #000;
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
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 16px;
  font-size: 14px;
`;

const StyledSelect = styled.select`
  padding: 12px;
  font-size: 14px;
  color: black;
  border: 0px solid black;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 4px;
  height: 44px;
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

export const GenericSelect = (props: any): JSX.Element => (
  <InputGroup>
    <InputGroupLabel>{props.label}</InputGroupLabel>
    <StyledSelect
      value={props?.value}
      placeholder={props.label}
      onChange={(ev) => {
        props.onChange(ev.target.value);
      }}
    >
      {props.children}
    </StyledSelect>
  </InputGroup>
);

export const Submit = (props: any): JSX.Element => (
  <SubmitButton type="button" onClick={props.onSubmit}>
    {props.label}
  </SubmitButton>
);
