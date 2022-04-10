import styled from "styled-components";
import { NavLink } from "react-router-dom";

const NavigationContainer = styled.div`
  width: 100%;
  @media (min-width: 600px) {
    display: flex;
  }
  display: flow-root;
  justify-content: center;
  text-align: center;
  position: relative;
  background: blue;
  color: white;
`;

const NavigationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media (min-width: 600px) {
    margin: 20px 0px;
    padding-inline-start: 40px;
  }
  padding-left: 0px;
`;

const NavigationItem = styled.li`
  list-style-type: none;
  line-height: 48px;
  &:not(:last-child) {
    padding-right: 1rem;
  }
  &:hover {
    font-weight: bold;
  }
  > a {
    color: white;
    text-decoration: none;
  }
`;

export const NavItem = (props: any): JSX.Element => (
  <NavigationItem>
    <NavLink to={props.to}>{props.item}</NavLink>
  </NavigationItem>
);

export const NavList = (): JSX.Element => (
  <NavigationList>
    <NavItem item="HOME" to="/" />
    <NavItem item="CREATE" to="/create" />
    <NavItem item="SCORES" to="scores" />
    <NavItem item="REGISTER" to="register" />
  </NavigationList>
);

export const NavigationBar = (): JSX.Element => (
  <>
    <NavigationContainer>
      <h1>BRACKETOLOGY</h1>
      <NavList />
    </NavigationContainer>
  </>
);
