import { PropsWithChildren } from "react";
import ThemeLayout from "./theme-layout";
import { AuthProvider } from "@/features/auth/auth.provider";

const WorkspaceLayout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeLayout>
    <AuthProvider>
      {children}
    </AuthProvider>
    </ThemeLayout>
  );
};

export default WorkspaceLayout;