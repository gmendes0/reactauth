import React from "react";
import { useCan } from "../hooks/useCan";

interface CanProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
}

// Esse componente evita ter de ficar chamando useCan nos components e fazer {x && ()}
// Com isso o código fica mais limpo
function Can({ children, permissions, roles }: CanProps): JSX.Element {
  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) return <></>;

  return <>{children}</>;
}

export default Can;
