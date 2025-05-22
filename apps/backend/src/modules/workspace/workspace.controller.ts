import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { WorkspaceService } from "./workspace.service";

export class WorkspaceController {
  private workspaceService: WorkspaceService;

  constructor(workspaceService: WorkspaceService) {
    this.workspaceService = workspaceService;
  }

  public createWorkspaceHandler = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {

    })
}