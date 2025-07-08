import { z } from "zod";

export const craeteWorkspaceSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Workspace name is required",
  }),
  description: z.string().trim(),
});

export type CreateWorkspaceSchemaFormValues = z.infer<
  typeof craeteWorkspaceSchema
>;

export const editWorkspaceSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Workspace name is required",
  }),
  description: z.string().trim(),
});

export type EditWorkspaceSchemaFormValues = z.infer<typeof editWorkspaceSchema>;
