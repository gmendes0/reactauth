import { useAuth } from "../contexts/AuthContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

type TUseCan = {
  permissions?: string[];
  roles?: string[];
};

// ex: useCan({permisions: ['...', '...'], roles: ['...', '...']})
export function useCan({ permissions, roles }: TUseCan): boolean {
  // Pega os dados do usuário logado
  const { user, isAuthenticated } = useAuth();

  // Caso ele nao esteja autenticado, ele automaticamente nao tem permissao
  if (!isAuthenticated || !user) return false;

  // Valida se o usuario tem todas as permissions e tem alguma das roles
  return validateUserPermissions(user, { permissions, roles });
}
