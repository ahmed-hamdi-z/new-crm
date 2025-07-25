import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProjectByIdApi } from "../../apis";

const useGetProjectById = (workspaceId: string, projectId: string) => {
  const query = useQuery({
    queryKey: ["singleProject", projectId],
    queryFn: () =>
      getProjectByIdApi({
        workspaceId,
        projectId,
      }),
    staleTime: Infinity,
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });
  return query;
};

export default useGetProjectById;
