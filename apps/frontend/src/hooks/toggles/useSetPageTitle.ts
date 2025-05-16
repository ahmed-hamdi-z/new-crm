import { useMutation } from "@tanstack/react-query";

const useSetPageTitle = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (title) => {
      document.title = title;
    },
  });
};

export default useSetPageTitle;
