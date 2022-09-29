import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import Can from "../components/Can";
import { signOut, useAuth } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard: NextPage = () => {
  const { user } = useAuth();

  const userCanSeeMetrics = useCan({
    permissions: ["metrics.list"], // precisa ter todas essas permisoes
    roles: ["administrator", "editor"], // Precisa ter uma dessas roles
  });

  useEffect(() => {
    console.log("useEffect | dashboard");
    console.log(
      "Header Default | dashboard: ",
      api.defaults.headers.common["Authorization"]
    );

    api
      .get("/me")
      .then((response) => {
        console.log("dashboard: ", response);
      })
      .catch((error) => {
        console.log("error.dashboard", error);
        signOut();
      })
      .finally(() => {
        console.log("useEffect Finalizado | dashboard");
      });
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | Auth</title>
      </Head>

      <Container maxW="container.xl" my={20}>
        <Button
          display="block"
          ml="auto"
          colorScheme="purple"
          size="lg"
          fontSize="md"
          onClick={signOut}
        >
          Sign Out
        </Button>
        <Box w="100%" color="gray.600" mb={20}>
          <Heading>Dashboard</Heading>
          <Text>email: {user?.email}</Text>

          {/* O usuário só pode ver esse texto se tiver as permissoes/roles passadas no useCan */}
          {userCanSeeMetrics && <Text>I'm an administrator/editor</Text>}
        </Box>

        {/* O usuário só pode ver esse texto se tiver as permissoes/roles passadas no Can */}
        <Can permissions={["metrics.list"]} roles={["administrator", "editor"]}>
          <Box w="100%" color="gray.600" mb={20}>
            <Heading>Métrics</Heading>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
              tempore obcaecati sit reiciendis architecto quos dignissimos unde
              ex tempora doloribus dolorem commodi, mollitia quam aperiam
              numquam. Nobis ratione atque eveniet!
            </Text>
          </Box>
        </Can>

        {/* {userCanSeeMetrics && (
          <Box w="100%" color="gray.600" mb={20}>
            <Heading>Métrics</Heading>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
              tempore obcaecati sit reiciendis architecto quos dignissimos unde
              ex tempora doloribus dolorem commodi, mollitia quam aperiam
              numquam. Nobis ratione atque eveniet!
            </Text>
          </Box>
        )} */}
      </Container>
    </>
  );
};

export default Dashboard;

// É importante fazer essa verificação no server-side pois, mesmo que a aplicação redirecione o user
// caso não detecte o token no client-side, caso o user esteja com o JS desabilitado, o app nao vai redirecionar,
// assim, o user pode conseguir ver informações sensíveis, mesmo deslogado.
// Colocando essa verificação no server-side, a página nem chega a ser renderizada, entao mesmo com o JS desabilitado,
// o user é redirecionado para a página de login
export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    // Caso precise acessar a api pelo server-side, o token nao vai ser encontrado,
    // pois está sendo usado o parseCookies sem passar o contexto no api.ts, e
    // o parseCookies só funciona no server-side se o context for passado no primeiro parametro.
    // Como o token nao é encontrado, o header Authorization fica com o valor Bearer undefined

    const apiClient = setupApiClient(context);

    // Caso o token seja inválido, é feita a tentativa de refresh assim como acontecia no client
    // Como isso está no server-side, o client nem precisa fazer o refresh
    const response = await apiClient.get("/me");

    console.log(response.data);

    return {
      props: {},
    };
  }
);
