import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  chakra,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Home: NextPage = () => {
  const { signIn } = useAuth();

  // const [email, setEmail] = useState<string>();
  // const [password, setPassword] = useState<string>();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // if (!email || !password) return;

    if (!emailRef.current?.value || !passwordRef.current?.value) return;

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    await signIn({ email, password });
  }

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>

      <Flex w="100vw" h="100vh" bg="gray.50" align="center" justify="center">
        <chakra.form
          as="form"
          bg="white"
          boxShadow="lg"
          p={8}
          rounded="lg"
          w="md"
          onSubmit={handleSubmit}
        >
          <Stack spacing={6}>
            <FormControl>
              <FormLabel color="gray.600">Email</FormLabel>
              <Input
                type="email"
                placeholder="your.email@gmail.com"
                // value={email}
                // onChange={(event) => setEmail(event.target.value)}
                ref={emailRef}
                borderColor="gray.600"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">Password</FormLabel>
              <Input
                type="password"
                placeholder="******"
                // value={password}
                // onChange={(event) => setPassword(event.target.value)}
                ref={passwordRef}
                borderColor="gray.600"
              />
            </FormControl>

            <Button
              type="submit"
              size="lg"
              fontSize="md"
              w="full"
              colorScheme="purple"
            >
              Sign In
            </Button>
          </Stack>
        </chakra.form>
      </Flex>
    </>
  );
};

export default Home;
