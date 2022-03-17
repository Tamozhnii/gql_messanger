import { gql } from 'apollo-angular';

export const signup = gql`
  mutation SignUp($password: String!, $name: String!, $email: String!) {
    signup(password: $password, name: $name, email: $email) {
      token
      user {
        id
        name
        email
        color
      }
    }
  }
`;

export const login = gql`
  mutation LogIn($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      token
      user {
        id
        name
        email
        color
      }
    }
  }
`;

export const getUsers = gql`
  query {
    users {
      id
      name
      email
      color
    }
  }
`;

export const changeProfile = gql`
  mutation ChangeProfile($name: String!, $color: String!) {
    changeProfile(name: $name, color: $color) {
      id
      name
      email
      color
    }
  }
`;

export const newUser = `subscription newUser {
    id
    name
    email
    color
  }`;
