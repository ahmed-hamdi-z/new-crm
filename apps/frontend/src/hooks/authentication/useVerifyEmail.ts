import { useParams } from "react-router";
import { VerifyEmail } from "@/api/authentication-api";
import { useQuery } from "@tanstack/react-query";
import { EMAIL_VERIFICATION } from "@/constants/shared";

const useVerifyEmail = () => {
  const { code } = useParams();
  const { data, ...rest } = useQuery({
    queryKey: [EMAIL_VERIFICATION, code],
    queryFn:  () =>  VerifyEmail(code),
  });

  return {
    data,
    ...rest,
  };
};

export default useVerifyEmail;
