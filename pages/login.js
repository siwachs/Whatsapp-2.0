import Head from "next/head";

import styled from "styled-components";

import { Button } from "@material-ui/core";

import { auth } from "../firebase";
import { signInWithGoogle } from "../lib/authUtils";

const Login = () => {
  return (
    <Container>
      <Head>
        <title>LOGIN | WhatsApp 2.0</title>
        <meta name="description" content="WhatsApp 2.0 Login Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LoginContainer>
        <Logo alt="" src="/WhatsApp.svg" />
        <Button onClick={() => signInWithGoogle(auth)} variant="outlined">
          Sign In With Google
        </Button>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  object-fit: contain;
  margin-bottom: 50px;
`;
