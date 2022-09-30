import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { validateUserPermissions } from "./validateUserPermissions";

interface WithSSRAuthOptions {
  permissions?: string[];
  roles?: string[];
}

type TJWTData = {
  permissions: string[];
  roles: string[];
};

// HOF parecida com o withSSRGuest
export function withSSRAuth<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
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

    if (options) {
      // Validando permissoes
      // Como o token está armazenado nos cookies e nesse caso, esse token é revalidado em 15 minutos
      // É possível utilizar as informaçoes dele como permissions, roles e subject

      // Decodifica o JWT
      const userData = jwtDecode<TJWTData>(token);

      console.log(userData);

      // Não da para usar o useCan aqui pois ele chama o AuthContext
      if (
        !validateUserPermissions(userData, {
          permissions: options.permissions,
          roles: options.roles,
        })
      ) {
        // Caso nao tenha permissao, da pra retornar ou um 404 com o notFound, ou entao redirecionar
        // para alguma pagina que todos os users tem acesso, ex: /dashboard
        // Nao da para redirecionar para o login, porque o user já está logado, ele só nao possui
        // permissao para ver essa pagina
        return {
          // notFound: true,

          redirect: {
            destination: "/dashboard",
            permanent: false,
          },
        };
      }
    }

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
