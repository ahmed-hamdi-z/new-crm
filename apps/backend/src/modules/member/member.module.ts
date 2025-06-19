import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";

const memberService = new MemberService();
const memberController = new MemberController(memberService);

export { memberService, memberController };
