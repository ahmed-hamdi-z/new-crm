
export let navigate: (to: string, options?: { state?: any }) => void = () => {};

export const setNavigate = (fn: (to: string, options?: { state?: any }) => void) => {
  navigate = fn;
};