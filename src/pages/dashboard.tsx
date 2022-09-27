import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { signOut, useAuth } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard: NextPage = () => {
  const { user } = useAuth();

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
      <h1>Dashboard: {user?.email}</h1>
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
