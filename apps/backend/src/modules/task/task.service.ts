import { TaskPriorityEnum, TaskStatusEnum } from "../../common/enums/task.enum";
import {
  BadRequestException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import MemberModel from "../../database/models/member.model";
import ProjectModel from "../../database/models/project.model";
import TaskModel from "../../database/models/task.moadel";
import { logger } from "../../common/utils/logger";

export class TaskService {
  public async createTask(
    workspaceId: string,
    projectId: string,
    userId: string,
    body: {
      title: string;
      description?: string;
      priority: string;
      status: string;
      assignedTo?: string | null;
      dueDate?: string;
    }
  ) {
    logger.info(`Creating new task in project ${projectId} by user ${userId}`);
    const { title, description, priority, status, assignedTo, dueDate } = body;

    logger.debug(`Verifying project ${projectId} in workspace ${workspaceId}`);
    const project = await ProjectModel.findById(projectId);

    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      logger.warn(`Project ${projectId} not found or workspace mismatch`);
      throw new NotFoundException(
        "Project not found or does not belong to this workspace"
      );
    }

    if (assignedTo) {
      logger.debug(`Checking if user ${assignedTo} is a workspace member`);
      const isAssignedUserMember = await MemberModel.exists({
        userId: assignedTo,
        workspaceId,
      });

      if (!isAssignedUserMember) {
        logger.warn(`User ${assignedTo} is not a workspace member`);
        throw new Error("Assigned user is not a member of this workspace.");
      }
    }

    logger.debug(`Creating new task with title: ${title}`);
    const task = new TaskModel({
      title,
      description,
      priority: priority || TaskPriorityEnum.MEDIUM,
      status: status || TaskStatusEnum.TODO,
      assignedTo,
      createdBy: userId,
      workspace: workspaceId,
      project: projectId,
      dueDate,
    });

    await task.save();
    logger.info(`Task ${task._id} created successfully`);

    return { task };
  }

  public async updateTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    body: {
      title: string;
      description?: string;
      priority: string;
      status: string;
      assignedTo?: string | null;
      dueDate?: string;
    }
  ) {
    logger.info(`Updating task ${taskId} in project ${projectId}`);

    logger.debug(`Verifying project ${projectId} in workspace ${workspaceId}`);
    const project = await ProjectModel.findById(projectId);

    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      logger.warn(`Project ${projectId} not found or workspace mismatch`);
      throw new NotFoundException(
        "Project not found or does not belong to this workspace"
      );
    }

    logger.debug(`Fetching task ${taskId} for update`);
    const task = await TaskModel.findById(taskId);

    if (!task || task.project.toString() !== projectId.toString()) {
      logger.warn(`Task ${taskId} not found or project mismatch`);
      throw new NotFoundException(
        "Task not found or does not belong to this project"
      );
    }

    logger.debug(`Updating task ${taskId} with new data`);
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        ...body,
      },
      { new: true }
    );

    if (!updatedTask) {
      logger.error(`Failed to update task ${taskId}`);
      throw new BadRequestException("Failed to update task");
    }

    logger.info(`Task ${taskId} updated successfully`);
    return { updatedTask };
  }

  public async getAllTasks(
    workspaceId: string,
    filters: {
      projectId?: string;
      status?: string[];
      priority?: string[];
      assignedTo?: string[];
      keyword?: string;
      dueDate?: string;
    },
    pagination: {
      pageSize: number;
      pageNumber: number;
    }
  ) {
    logger.info(`Fetching tasks for workspace ${workspaceId} with filters`, { filters });

    const query: Record<string, any> = {
      workspace: workspaceId,
    };

    if (filters.projectId) {
      query.project = filters.projectId;
      logger.debug(`Added project filter: ${filters.projectId}`);
    }

    if (filters.status && filters.status?.length > 0) {
      query.status = { $in: filters.status };
      logger.debug(`Added status filter: ${filters.status}`);
    }

    if (filters.priority && filters.priority?.length > 0) {
      query.priority = { $in: filters.priority };
      logger.debug(`Added priority filter: ${filters.priority}`);
    }

    if (filters.assignedTo && filters.assignedTo?.length > 0) {
      query.assignedTo = { $in: filters.assignedTo };
      logger.debug(`Added assignedTo filter: ${filters.assignedTo}`);
    }

    if (filters.keyword && filters.keyword !== undefined) {
      query.title = { $regex: filters.keyword, $options: "i" };
      logger.debug(`Added keyword filter: ${filters.keyword}`);
    }

    if (filters.dueDate) {
      query.dueDate = {
        $eq: new Date(filters.dueDate),
      };
      logger.debug(`Added dueDate filter: ${filters.dueDate}`);
    }

    // Pagination Setup
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;
    logger.debug(`Pagination: page ${pageNumber}, size ${pageSize}, skip ${skip}`);

    const [tasks, totalCount] = await Promise.all([
      TaskModel.find(query)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate("assignedTo", "_id name profilePicture -password")
        .populate("project", "_id emoji name"),
      TaskModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);
    logger.info(`Found ${totalCount} tasks, returning ${tasks.length} on page ${pageNumber} of ${totalPages}`);

    return {
      tasks,
      pagination: {
        pageSize,
        pageNumber,
        totalCount,
        totalPages,
        skip,
      },
    };
  }

  public async getTaskById(
    workspaceId: string,
    projectId: string,
    taskId: string
  ) {
    logger.info(`Fetching task ${taskId} from project ${projectId}`);

    logger.debug(`Verifying project ${projectId} in workspace ${workspaceId}`);
    const project = await ProjectModel.findById(projectId);

    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      logger.warn(`Project ${projectId} not found or workspace mismatch`);
      throw new NotFoundException(
        "Project not found or does not belong to this workspace"
      );
    }

    logger.debug(`Fetching task ${taskId} details`);
    const task = await TaskModel.findOne({
      _id: taskId,
      workspace: workspaceId,
      project: projectId,
    }).populate("assignedTo", "_id name profilePicture ");

    if (!task) {
      logger.warn(`Task ${taskId} not found`);
      throw new NotFoundException("Task not found.");
    }

    logger.info(`Task ${taskId} retrieved successfully`);
    return task;
  }

  public async deleteTask(workspaceId: string, taskId: string) {
    logger.info(`Deleting task ${taskId} from workspace ${workspaceId}`);

    const task = await TaskModel.findOneAndDelete({
      _id: taskId,
      workspace: workspaceId,
    });

    if (!task) {
      logger.warn(`Task ${taskId} not found in workspace ${workspaceId}`);
      throw new NotFoundException(
        "Task not found or does not belong to the specified workspace"
      );
    }

    logger.info(`Task ${taskId} deleted successfully`);
    return;
  }
}