import { PermissionType } from "../../common/enums/role.enum";
import { RolePermissions } from "./role-permission";
import { UnauthorizedException } from "./catch-errors";

export class RoleGuard {
  private constructor() {}
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