import { PermissionType } from "../../common/enums/role.enum";
import { RolePermissions } from "./role-permission";
import { UnauthorizedException } from "./catch-errors";

export class RoleGuard {
  // A private constructor prevents the class from being instantiated.
  // This enforces its use as a static-only utility class.
  private constructor() {}

  /**
   * Checks if a given role has the necessary permissions.
   * This is a static method, so you can call it directly: RoleGuard.check(...)
   * @param role The role to be validated.
   * @param requiredPermissions An array of permissions that are required.
   * @throws UnauthorizedException if the role lacks the required permissions.
   */
  public static check(
    role: keyof typeof RolePermissions,
    requiredPermissions: PermissionType[]
  ): void {
    const userPermissions = RolePermissions[role];

    if (!userPermissions) {
      throw new UnauthorizedException(`Invalid role "${role}" specified.`);
    }

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new UnauthorizedException(
        "You do not have permission to access this resource."
      );
    }
  }
}