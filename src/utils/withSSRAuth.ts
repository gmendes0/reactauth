import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

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

    return await fn(context);
  };
}
