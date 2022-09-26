import { NextPage } from "next";
import { useEffect } from "react";
import { signOut, useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

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
        // signOut();
      })
      .finally(() => {
        console.log("useEffect Finalizado | dashboard");
      });
  }, []);

  return <h1>Dashboard: {user?.email}</h1>;
};

export default Dashboard;
