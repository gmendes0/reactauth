import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

// 1 param ex: async (_context) => ({props: {}}),
export function withSSRGuest<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
): GetServerSideProps<P> {
  // Essa será a função que o Next executará quando a página for acessada
  // É como se esse fosse o const getServerSideProps
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    // Como está no server-side, é necessário passar o context
    const { "nextauth.token": token } = parseCookies(context);

    // Se existir o token nos cookies, significa que o user está logado,
    // Mesmo que o token esteja inválido, pode se considerar que o user está logado, pois o client vai tentar
    // fazer refresh do token, e caso o refresh seja inválido, o user é deslogado (cookies sao apagados)
    // Redireciona para o dashboard com o permanent false para o HTTP Code ser 302
    // Como isso é executado antes de renderizar a página, nenhum conteúdo visual é mostrado
    // Caso os cookies fossem HTTP only eles só seriam acessíveis pelo server
    if (token)
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };

    // Caso o token nao exista, a função que foi passada no parametro, que tbm é uma getServerSideProps
    // será executada, podendo fazer chamadas a API, etc, e retornando um Promise<GetServerSidePropsResult<P>>
    // ex: {props: {}}
    return await fn(context);
  };
}
