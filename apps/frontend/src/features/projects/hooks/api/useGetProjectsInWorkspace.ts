import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AllProjectPayloadType } from "../../types";
import { getProjectsInWorkspaceApi } from "../../apis";


const useGetProjectsInWorkspace = ({
  workspaceId,
  pageSize,
  pageNumber,
  skip = false,
}: AllProjectPayloadType) => {
  const query = useQuery({
    queryKey: ["allprojects", workspaceId, pageNumber, pageSize],
    queryFn: () =>
      getProjectsInWorkspaceApi({
        workspaceId,
        pageSize,
        pageNumber,
      }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });
  return query;
};

export default useGetProjectsInWorkspace;