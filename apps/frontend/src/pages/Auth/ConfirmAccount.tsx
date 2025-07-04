import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router";
import AuthCard from "@/features/auth/components/auth-card";
import { memo } from "react";
import { toast } from "sonner";
import { useConfirmAccount } from "@/features/auth/hooks/useConfirmAccount";

const ConfirmAccount: React.FC = () => {
  const { mutate, isPending } = useConfirmAccount();

  const [params] = useSearchParams();
  const code = params.get("code");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!code) {
      toast("Confirmation token not found");
      return;
    }
    mutate({ code });
  };
  return (
    <AuthCard
      title="Confirm your account"
      description="To confirm your account, please follow the button below."
    >
      <div className="w-full h-full p-5 rounded-md">
        <form onSubmit={handleSubmit}>
          <Button
            disabled={isPending}
            type="submit"
            className="w-full text-[15px] h-[40px] text-white font-semibold"
          >
            {isPending && <Loader className="animate-spin" />}
            Confirm account
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
          If you have any issue confirming your account please, contact{" "}
          <a
            className="outline-none transition duration-150 ease-in-out 
            focus-visible:ring-2 text-primary hover:underline focus-visible:ring-primary"
            href="#"
          >
            support@click.sa.net
          </a>
          .
        </p>
      </div>
    </AuthCard>
  );
};

export default memo(ConfirmAccount);
