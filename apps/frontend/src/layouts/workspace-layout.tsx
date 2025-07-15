import { PropsWithChildren } from "react";
import ThemeLayout from "./theme-layout";
import { AuthProvider } from "@/features/auth/auth.provider";
import CreateWorkspace from "@/features/workspace/components/create-workspace";
import CreateProject from "@/features/projects/components/create-project";

const WorkspaceLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <ThemeLayout>
        <CreateWorkspace />
        <CreateProject />
        {children}
      </ThemeLayout>
    </AuthProvider>
  );
};

export default WorkspaceLayout;
