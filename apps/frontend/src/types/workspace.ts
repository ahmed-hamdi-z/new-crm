import { z } from "zod";

// In your schema file (types/workspace.ts)
export const workspaceSchema = z.object({
  name: z
    .string()
    .min(6, "Workspace name must be at least 6 characters long")
    .max(50, "Workspace name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_\- ]+$/,
      "Workspace name can only contain letters, numbers, spaces, underscores, and hyphens"
    )
    .transform((val) => val.trim()), // Ensure whitespace is trimmed
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
export type WorkspaceFormValues = z.infer<typeof workspaceSchema>;
