import { TwitterTimelineEmbed } from "react-twitter-embed";
import styled from "styled-components";

type PopupNotificationProps = {
  visible: boolean | null;
  hidden: boolean | null;
};

export function Popup({
  message,
  visible,
  hidden,
}: {
  message: string;
  visible: boolean | null;
  hidden: boolean | null;
}) {}

export const PopupNotification = styled.div<PopupNotificationProps>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 280px;
  background-color: red;
  border-radius: 10px;
  border: 1px solid red;
  color: white;
  font-size: 14px;
  min-height: 48px;
  padding: 12px;
  text-align: left;
  z-index: 200;

  display: ${(props) => (props.hidden ? "none" : "unset")};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: ${(props) =>
    props.visible ? "opacity 250ms linear" : "opacity 250ms linear 2s"};

  @media only screen and (max-width: 706px) {
    width: 85%;
    margin: 0 auto;
    text-align: center;
  }
`;

export const Container = styled.div`
  padding: 4rem;
  width: 36rem;
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

export const Content = styled.p``;

export const ContentHeading = styled.h3`
  text-transform: uppercase;
`;

export const TwitterTimeline = styled(TwitterTimelineEmbed)`
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
`;

export const Circle = styled.div`
  background: ${(props) => props.color};
  border-radius: 50%;
  width: 12px;
  height: 12px;
  margin: 6px;
  margin-left: auto;
`;
