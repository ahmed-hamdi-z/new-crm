import { useParams } from "react-router";

const UseTaskId = () => {
  const params = useParams();
  return params.taskId as string;
};

export default UseTaskId;