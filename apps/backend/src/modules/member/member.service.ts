import { ErrorCode } from "../../common/enums/error-code.enum";
import {
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/catch-errors";
import MemberModel from "../../database/models/member.model";
import WorkspaceModel from "../../database/models/workspace.model";

export class MemberService {
  public async getMemberRoleInWorkspace(userId: string, workspaceId: string) {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const member = await MemberModel.findOne({ userId, workspaceId }).populate(
      "role"
    );

    if (!member) {
      throw new UnauthorizedException(
        "you are not a member of this workspace",
        ErrorCode.ACCESS_UNAUTHORIZED
      );
    }

    const roleName = member.role?.name;
    return { role: roleName };
  }
}
