// Nao precisa tipar o email pq nao ira ser usado
// Só deve ser tipado o que for ser utilizado
type TUser = {
  permissions: string[];
  roles: string[];
};

type TValidateUserPermissions = {
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermissions(
  user: TUser,
  { permissions, roles }: TValidateUserPermissions
): boolean {
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
