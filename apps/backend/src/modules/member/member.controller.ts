import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { MemberService } from "./member.service";
export class MemberController {
  private memberService: MemberService;

  constructor(memberService: MemberService) {
    this.memberService = memberService;
  }

  public getMemberRoleInWorkspaceHandler = asyncHandler(
    async (req: Request, res: Response) => {
      
    }
  );
}
