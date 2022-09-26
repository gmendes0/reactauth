import axios from "axios";
import { parseCookies } from "nookies";

const { "nextauth.token": token } = parseCookies();

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  // Headers que serao enviados em todas as requests
  headers: {
    // O problema é que esse arquivo só é carregado uma vez após o F5, ou seja, se o usuário tiver acessando pela primeira vez
    // provavelmente o cookie nextauth.token nao existe ainda, e o valor setado no Authorization vai ser undefined
    // para resolver isso, é necessário atualizar esse header após o user fazer o login
    Authorization: `Bearer ${token}`,
  },
});
