import { NextPage } from "next";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

const Dashboard: NextPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    api.get("/me").then((response) => {
      console.log("dashboard: ", response);
    });
  }, []);

  return <h1>Dashboard: {user?.email}</h1>;
};

export default Dashboard;
