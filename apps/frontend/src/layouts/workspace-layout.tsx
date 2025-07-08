import { PropsWithChildren } from "react";
import ThemeLayout from "./theme-layout";
import { AuthProvider } from "@/features/auth/auth.provider";
import CreateWorkspace from "@/features/workspace/components/create-workspace";

const WorkspaceLayout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeLayout>
      <AuthProvider>
        <CreateWorkspace />
        {children}
      </AuthProvider>
    </ThemeLayout>
  );
};

export default WorkspaceLayout;
