import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  chakra,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { FormEvent, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

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
        <title>Sign In | Auth</title>
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

// // Server Side
// // É executado antes de aparecer a interface
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Como está no server-side, é necessário passar o context
//   const { "nextauth.token": token } = parseCookies(context);

//   // Se existir o token nos cookies, significa que o user está logado,
//   // Mesmo que o token esteja inválido, pode se considerar que o user está logado, pois o client vai tentar
//   // fazer refresh do token, e caso o refresh seja inválido, o user é deslogado (cookies sao apagados)
//   // Redireciona para o dashboard com o permanent false para o HTTP Code ser 302
//   // Como isso é executado antes de renderizar a página, nenhum conteúdo visual é mostrado
//   // Caso os cookies fossem HTTP only eles só seriam acessíveis pelo server
//   if (token)
//     return {
//       redirect: {
//         destination: "/dashboard",
//         permanent: false,
//       },
//     };

//   // Retorno padrao do getServerSideProps
//   return {
//     props: {},
//   };
// };

// A estrarégia acima funciona, mas caso o app tenha mais páginas que só podem ser acessadas sem login
// como cadastro, rec. de senha, etc, seria necessário repetir esse código
// Uma alternativa é usar estratégia de High Order Function.
// O getServerSideProps espera que o retorno seja uma função para que ele possa executa-la depois
// portanto, o que withSSRGuest faz é retornar uma função que vai ser executada quando o Next chamar getServerSideProps
// 1 param: Função a ser executada caso o user não esteja logado
export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async (_context) => {
    return {
      props: {},
    };
  }
);
