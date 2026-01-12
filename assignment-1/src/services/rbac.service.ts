export const isRoleAllowed = (
  userRoles: string[],
  allowedRoles: string[]
) => {
  return userRoles.some(role => allowedRoles.includes(role))
}
