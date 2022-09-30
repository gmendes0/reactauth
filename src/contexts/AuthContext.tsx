import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/apiClient";

type TSignInCredentials = {
  email: string;
  password: string;
};

type TAuthContextData = {
  // pode ser que mais de um componente precise autenticar o user
  signIn: (credentials: TSignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: TUser;
};

type TSessionData = {
  permissions: string[];
  refreshToken: string;
  roles: string[];
  token: string;
};

type TUser =
  | undefined
  | {
      permissions: string[];
      roles: string[];
      email: string;
    };

type TMeResponse = {
  permissions: string[];
  roles: string[];
  email: string;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as TAuthContextData);

export const useAuth = () => useContext(AuthContext);

let authChannel: BroadcastChannel;

export function AuthProvider(props: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<TUser>();

  // Poderia fazer no de baixo. Mas é legal separar as responsabilidades
  useEffect(() => {
    authChannel = new BroadcastChannel("nextauth");

    // Registra o listener de message
    // Quando uma mensagem for enviada, a funçao será executada
    // Também é possível fazer dessa maneira: authChannel.addEventListener('message', event => {})
    // A aba que dispara o evento nao recebe a mensagem (já que é ela quem está enviando), somente as outras
    authChannel.onmessage = (event) => {
      console.log(event);

      switch (event.data) {
        case "signOut":
          // signOut();

          // Não chamar a função signOut(), pois ela envia a mensagem de 'signOut' para o broadcast
          // o que faz com que a aplicaçao volte para cá e chame signOut() denovo, que vai enviar 'signOut' denovo
          // fazendo o app voltar pra cá... looping infinito
          Router.push("/");
          break;
        case "signIn":
          Router.push("/dashboard");
          break;
        default:
          break;
      }
    };
  }, []);

  // Sempre que o user fazer um F5, será executado
  // Essa funçao vai buscar os dados do user
  // Por mais que o JWT retorne algumas infos do user, como email, permissions e roles (nesse caso específico),
  // é interessante buscar as infos atualizadas do backend, pois as permissions e roles podem mudar.
  useEffect(() => {
    console.log("window: ", !!typeof window);
    console.log("useEffect | provider");
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      // É possível passar o header authorization aqui, mas é possível tbm definir que ele será passado em todas as
      // requisiçoes, adicionando ele no axios.create
      api
        .get<TMeResponse>("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });

          console.log("provider: ", response);
        })
        .catch((error) => {
          console.log("error.provider", error);

          signOut();
        })
        .finally(() => {
          console.log("useEffect Finalizado | provider");
        });
    }
  }, []);

  const isAuthenticated = !!user;

  async function signIn({ email, password }: TSignInCredentials) {
    console.log("Sign In | provider");

    try {
      const response = await api.post<TSessionData>("/sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      // SALVAR O TOKEN
      // sessionStorage - Quando o usuário fecha o navegador, os dados sao apagados
      // localStorade   - Mantem os dados mesmo fechando o browser, mas nao é acessível pelo server
      // cookies        - Pode ser acessado pelo server e pelo client, possibilitando o SSR

      // 1 param: contexto  | o contexto nao está disponível no client, entao fica undefined
      // 2 param: nome      | é interessante colocar o nome da aplicaçao nome para nao conflitar
      // 3 param: valor     | o valor que será armazenado
      // 4 param: opçoes    | é possível definir algumas opcoes, como tempo por exemplo
      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days | Pode colocar um valor alto pois a responsabilidade de expirar o token é do backend
        path: "/", // Quais caminhos do app tem acesso a esse cookie, '/' permite qualquer caminho
      });
      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      // PORQUE NAO SALVAR OS DADOS DO USER NO STORAGE
      // As infos como permissions, roles, name (por exemplo), email (por mais que seja raro), avatar, etc,
      // sao infos que podem mudar,
      // entao o ideal é salvar o token no storage e sempre que o usuário acessar a aplicação, a gente executa a chamada
      // para a api usando o token para obter as infos do user

      setUser({ email, permissions, roles });

      // Atualiza o header padrao Authorization que vai ser utilizado em todas as requisiçoes
      api.defaults.headers.common = {
        ...api.defaults.headers.common,
        Authorization: `Bearer ${token}`,
      };

      console.log(
        "Header Atualizado | provider: ",
        api.defaults.headers.common["Authorization"]
      );

      authChannel.postMessage("signIn");

      Router.push("/dashboard"); // funciona igual ao push do useRouter
    } catch (error) {
      console.log(error);
    }

    console.log("Sign In Finalizado | provider");
  }

  // É possível retornar signOut mesmo que tenha sido criado fora do provider
  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function signOut(): void {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  // Envia uma mensagem para o broadcast que sera usada para deslogar o app em todas as guias/janelas
  authChannel.postMessage("signOut");

  Router.push("/");
}
