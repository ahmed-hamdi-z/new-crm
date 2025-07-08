import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PermissionType } from "@/constants/permissions";
import { useAuthContext } from "@/features/auth/auth.provider";
import useWorkspaceId from "@/features/workspace/hooks/client/useWorkspaceId";


const withPermission = (
  WrappedComponent: React.ComponentType,
  requiredPermission: PermissionType
) => {
  const WithPermission = (props: any) => {
    const { user, hasPermission, isLoading } = useAuthContext();
    const navigate = useNavigate();
    const workspaceId = useWorkspaceId();

    useEffect(() => {
      if (!user || !hasPermission(requiredPermission)) {
        navigate(`/workspace/${workspaceId}`);
      }
    }, [user, hasPermission, navigate, workspaceId]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user || !hasPermission(requiredPermission)) {
      return;
    }
    return <WrappedComponent {...props} />;
  };
  return WithPermission;
};

export default withPermission;