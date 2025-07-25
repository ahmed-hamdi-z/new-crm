import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Project title is required",
  }),
  description: z.string().trim(),
});

export type createProjectSchemaFormValue = z.infer<typeof createProjectSchema>;

export const editProjectSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Project title is required",
  }),
  description: z.string().trim(),
});

export type editProjectSchemaFormValue = z.infer<typeof editProjectSchema>;
