import axios, { Axios, AxiosError, AxiosRequestConfig } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";

type TErrorResponse =
  | undefined
  | {
      code?: string;
      error: boolean;
      message: string;
    };

type TRefreshResponse = {
  token: string;
  refreshToken: string;
  permissions: string[];
  roles: string[];
};

type TFailedRequest = {
  onSuccess: (newToken: string) => void;
  onFailure: (err: AxiosError) => void;
};

const { "nextauth.token": token } = parseCookies();

let isRefreshing = false;
let failedRequestsQueue: TFailedRequest[] = [];

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Header que sera enviado em todas as requests
// O problema é que esse arquivo só é carregado uma vez após o F5, ou seja, se o usuário tiver acessando pela primeira vez
// provavelmente o cookie nextauth.token nao existe ainda, e o valor setado no Authorization vai ser undefined
// para resolver isso, é necessário atualizar esse header após o user fazer o login
api.defaults.headers.common = {
  ...api.defaults.headers.common,
  Authorization: `Bearer ${token}`,
};

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<TErrorResponse>) => {
    // Caso o erro seja por que o token expirou, uma request é feita para o backend passando o refreshToken
    // O refreshToken é validado e um novo token + refreshToken é gerado
    // Após isso a gente salva os 2 nos cookies e atualiza o token que é passado nos headers default

    // O problema é que as requests sao assincronas, então, se 2 requests forem feitas ao mesmo tempo,
    // uma vai alterar o token e o refreshToken usando o refreshToken do cookie, essa açao vai invalidar esse refreshToken do cookie,
    // ou seja, muito provavelmente a request 2 vai obter uma resposta de token inválido.
    // Por isso é necessário criar uma fila de requests, para que quando uma request disparar esse interceptor, todas as outras
    // requests sao "pausadas" e só rodarao quando o novo token válido for gerado

    if (error.response?.status === 401) {
      switch (error.response.data?.code) {
        case "token.expired":
          const originalConfig = error.config; // São as configs da request que deu erro e chamou esse interceptor ex: rota, headers, params, callbacks

          if (!isRefreshing) {
            // Só roda ele ainda nao estiver sendo refreshed

            // Informa que ele está sendo refreshed
            isRefreshing = true;
            const { "nextauth.refreshToken": refreshToken } = parseCookies();

            api
              .post<TRefreshResponse>("/refresh", { refreshToken })
              .then((response) => {
                setCookie(undefined, "nextauth.token", response.data.token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: "/",
                });

                setCookie(
                  undefined,
                  "nextauth.refreshToken",
                  response.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: "/",
                  }
                );

                api.defaults.headers.common = {
                  ...api.defaults.headers.common,
                  Authorization: `Bearer ${response.data.token}`,
                };

                // Executa todas as requests de novo com o token atualizado
                failedRequestsQueue.forEach((request) => {
                  request.onSuccess(response.data.token);
                });

                // Limpa a fila de requests
                failedRequestsQueue = [];
              })
              .finally(() => {
                // terminou de atualizar o token
                isRefreshing = false;
              })
              .catch((err) => {
                // Caso de erro para fazer refresh, o erro é repassado
                // Falha todas as requests
                failedRequestsQueue.forEach((request) => {
                  request.onFailure(err);
                });

                // Limpa a fila de requests
                failedRequestsQueue = [];
              });
          }

          // Como nao dá para fazer async/await aqui, essa é a maneira alternativa de se fazer
          return new Promise((resolve, reject) => {
            // Lembrando que esse interceptor inteiro será rodado para todas as requests e esse trecho só vai
            // executar para erros do tipo 401 - code: token.expired

            failedRequestsQueue.push({
              // esses métodos vão ser chamados após a request do /tokens

              // Caso o /tokens tenha dado sucesso
              onSuccess: (newToken: string) => {
                // Refazer a request com o novo token

                originalConfig.headers = {
                  ...originalConfig.headers,
                  Authorization: `Bearer ${newToken}`,
                };

                // Resolve aguarda a request a api terminar
                resolve(api(originalConfig));
              },

              // Caso o /tokens tenha dado errado
              onFailure: (err: AxiosError) => {
                // Repassa o erro
                reject(err);
              },
            });
          });
          break;
        default:
          signOut();
          break;
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log("JWT", config.headers["Authorization"]);

  return config;
});
