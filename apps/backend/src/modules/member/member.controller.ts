import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { MemberService } from "./member.service";
import { HTTPSTATUS } from "../../config/http.config";
export class MemberController {
  private memberService: MemberService;

  constructor(memberService: MemberService) {
    this.memberService = memberService;
  }

  public joinWorkspaceByInviteHandler = asyncHandler(
    async (req: Request, res: Response) => {
      
    const inviteCode = z.string().parse(req.params.inviteCode);
    // @ts-ignore
    const userId = req.user?._id;

    const { workspaceId, role } = await this.memberService.joinWorkspaceByInvite(
      userId,
      inviteCode
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully joined the workspace",
      workspaceId,
      role,
    });
 } );

}
 