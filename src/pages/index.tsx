import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Home: NextPage = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) return;

    await signIn({ email, password });
  }

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </>
  );
};

export default Home;
