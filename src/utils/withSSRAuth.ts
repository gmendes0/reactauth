import { GetServerSideProps } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

// HOF parecida com o withSSRGuest
export function withSSRAuth<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (context) => {
    // Verifica se o token está nos cookies
    // Caso nao esteja, redireciona para o /

    const { "nextauth.token": token } = parseCookies(context);

    console.log(token);

    if (!token)
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };

    try {
      // Tenta executar a funçao passada para o withSSRAuth
      return await fn(context);
    } catch (error) {
      // Caso de error de token (erro customizado), apaga os cookies e redireciona para a pagina de login
      // Se nao apagar os cookies, como a página de login verifica se o token existe, e navega o user para o
      // dashboard se existir, a aplicaçao entra em looping
      if (error instanceof AuthTokenError) {
        console.log(error instanceof AuthTokenError);

        destroyCookie(context, "nextauth.token");
        destroyCookie(context, "nextauth.refreshToken");

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      } else {
        throw error;
      }
    }
  };
}
