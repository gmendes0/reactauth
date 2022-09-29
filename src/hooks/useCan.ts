import { useAuth } from "../contexts/AuthContext";

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

  // permissions pode ser undefined
  if (permissions) {
    // Retorna true se todas as permissions passadas nos params estiverem no user.permission
    const hasAllPermissions = permissions.every((permission) =>
      user.permissions.includes(permission)
    );

    // Nao testei
    // Retorna true se alguma permissao nao está no user.permission
    // const hasntSomePermission = permissions.some(
    //   (permission) => !user.permissions.includes(permission)
    // );

    if (!hasAllPermissions) return false;
  }

  // permissions pode ser undefined
  if (roles) {
    // Retorna true se o user tiver um desses cargos
    const hasSomeRoles = roles.some((role) => user.roles.includes(role));

    if (!hasSomeRoles) return false;
  }

  return true;
}
