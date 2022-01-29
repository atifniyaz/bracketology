import styled from "styled-components";
import { NavLink } from "react-router-dom";

const NavigationContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;

  @media (min-width: 500px) {
    display: flex;
  }
  justify-content: center;
  text-align: center;
  border-bottom: 1px solid black;
`;

const NavigationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 500px) {
    margin: 20px 0px;
    padding-inline-start: 40px;
  }
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
    color: black;
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
    <NavItem item="Home" to="/" />
    <NavItem item="Create" to="/create" />
    <NavItem item="Scores" to="scores" />
    <NavItem item="Register" to="register" />
  </NavigationList>
);

export const NavigationBar = (): JSX.Element => (
  <>
    <NavigationContainer>
      <h1>Bracketology</h1>
      <NavList />
    </NavigationContainer>
  </>
);
