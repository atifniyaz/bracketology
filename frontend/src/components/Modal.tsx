import styled from "styled-components";
import { ContentHeading } from "./Common";

export function Modal({
  children,
  title = "Are you sure you are ready to submit?",
  onSubmit,
  onCancel,
  submitText = "Submit",
}: {
  children?: any;
  title?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
}) {
  return (
    <ModalOverlay>
      <ModalComponent>
        <h2>{title}</h2>
        {children}
        <ModalActionContainer>
          {onSubmit && (
            <ModalButton onClick={onSubmit}>{submitText}</ModalButton>
          )}
          {onCancel && <ModalButton onClick={onCancel}>Cancel</ModalButton>}
        </ModalActionContainer>
      </ModalComponent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.25s ease-out;
`;

const ModalComponent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  width: 40vw;
  @media (max-width: 706px) {
    width: 70vw;
  }
  min-height: 25vh;
  padding: 16px 32px;
  background: white;
  border-radius: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  filter: blur(0);
  opacity: 1;
  visibility: visible;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ModalActionContainer = styled.div`
  display: flex;
  @media (max-width: 706px) {
    justify-content: center;
  }
  justify-content: right;
  flex-direction: row;
  flex-wrap: wrap;
  > * {
    margin-left: 8px;
    margin-bottom: 8px;
  }
  margin-top: 16px;
  width: 100%;
`;

const ModalButton = styled.button`
  background: blue;
  border: none;
  border-radius: 4px;
  min-width: 100px;
  height: 40px;
  color: white;
  font-size: 14px;
  &:hover {
    background: black;
  }
`;
