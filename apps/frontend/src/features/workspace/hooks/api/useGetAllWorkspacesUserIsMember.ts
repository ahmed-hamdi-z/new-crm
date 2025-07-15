import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesUserIsMemberApi } from "../../apis";

const useGetAllWorkspacesUserIsMember = () => {
  const query = useQuery({
      queryKey: ["userWorkspaces"],
      queryFn: getAllWorkspacesUserIsMemberApi,
      refetchOnWindowFocus: false, 
      staleTime: 1,
      refetchOnMount: true,
    });
  return query;
};

export default useGetAllWorkspacesUserIsMember;
