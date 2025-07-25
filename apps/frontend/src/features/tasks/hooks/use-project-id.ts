import { useParams } from "react-router";

export const useProjectId = () => {
  const params = useParams();
  return params.projectId as string;
};
