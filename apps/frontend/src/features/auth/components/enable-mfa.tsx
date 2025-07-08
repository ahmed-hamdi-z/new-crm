import React, { useCallback, useState } from "react";
import { Copy, Check, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/features/auth/auth.provider";
import { Skeleton } from "@/components/ui/skeleton";
import RevokeMfa from "./revoke-mfa";
import useMfaSetup from "../hooks/useMfaSetup";
import { useVeriftMfaSetup } from "../hooks/useVerifyMfaSetup";
import { mafSchema, MafSchemaFormValues } from "../types/validator";
import AuthCard from "./auth-card";
import { mfaType, verifyMFAType } from "../types";

const EnableMfa: React.FC = () => {
  const { user } = useAuthContext();
  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useMfaSetup({ enabled: isOpen });

  const { mutate: verifyMfa, isPending } = useVeriftMfaSetup({
    onSuccess: () => setIsOpen(false),
  });

  const mfaData = data ?? ({} as mfaType);

  const form = useForm<MafSchemaFormValues>({
    resolver: zodResolver(mafSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (values: MafSchemaFormValues) => {
    const data = {
      code: values.pin,
      secretKey: mfaData?.secret,
    };
    verifyMfa(data as verifyMFAType);
  };

  const onCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <AuthCard
      title="EMulti-Factor Authentication (MFA)"
      description=" Protect your account by adding an extra layer of security."
    >
      <div className="flex items-center">
        {user?.user?.preferences?.enable2FA && (
          <span
            className="select-none whitespace-nowrap font-medium bg-green-100 text-green-500
          text-xs h-6 px-2 rounded flex flex-row items-center justify-center gap-1"
          >
            Enabled
          </span>
        )}
      </div>
      {user?.user?.preferences?.enable2FA ? (
        <RevokeMfa />
      ) : (
        <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            className="w-full flex items-center justify-center"
            asChild
          >
            <Button className="h-[35px] -mt-5 text-white">Enable MFA</Button>
          </DialogTrigger>
          <DialogContent className="!gap-0">
            <DialogHeader>
              <DialogTitle className="text-[17px] text-slate-12 font-semibold">
                Setup Multi-Factor Authentication
              </DialogTitle>
            </DialogHeader>
            <div className="">
              <p className="mt-6 text-sm text-[#0007149f] dark:text-inherit font-bold">
                Scan the QR code
              </p>
              <span className="text-sm text-[#0007149f] dark:text-inherit font-normal">
                Use an app like{" "}
                <a
                  className="!text-primary underline decoration-primary decoration-1 underline-offset-2 transition duration-200 ease-in-out hover:decoration-blue-11 dark:text-current dark:decoration-slate-9 dark:hover:decoration-current "
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://support.1password.com/one-time-passwords/"
                >
                  1Password
                </a>{" "}
                or{" "}
                <a
                  className="!text-primary underline decoration-primary decoration-1 underline-offset-2 transition duration-200 ease-in-out hover:decoration-blue-11 dark:text-current dark:decoration-slate-9 dark:hover:decoration-current "
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://safety.google/authentication/"
                >
                  Google Authenticator
                </a>{" "}
                to scan the QR code below.
              </span>
            </div>
            <div className="mt-4 flex flex-row items-center gap-4">
              <div className="shrink-0 rounded-md border p-2  border-[#0009321f] dark:border-gray-600 bg-white dark:bg-inherit">
                {isLoading || !mfaData?.qrImageUrl ? (
                  <Skeleton className="w-[160px] h-[160px]" />
                ) : (
                  <img
                    alt="QR code"
                    src={mfaData?.qrImageUrl || ""}
                    decoding="async"
                    width="160"
                    height="160"
                    className="rounded-md"
                  />
                )}
              </div>

              {showKey ? (
                <div className="w-full">
                  <div
                    className="flex items-center gap-1
                      text-sm text-[#0007149f] dark:text-muted-foreground font-normal"
                  >
                    <span>Copy setup key</span>

                    <button onClick={() => onCopy(mfaData?.secret)}>
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {isLoading && !mfaData?.secret ? (
                    <Skeleton className="w-[200px] h-2" />
                  ) : (
                    <p className="text-sm block truncate w-[200px] text-black dark:text-muted-foreground">
                      {mfaData?.secret}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-sm text-[#0007149f] dark:text-muted-foreground font-normal">
                  Can't scan the code?
                  <button
                    className="block text-primary transition duration-200 ease-in-out hover:underline
                   dark:text-white"
                    type="button"
                    onClick={() => setShowKey(true)}
                  >
                    View the Setup Key
                  </button>
                </span>
              )}
            </div>

            <div className="mt-8 border-t">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full mt-6 flex flex-col gap-4 "
                >
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm mb-1 text-slate-11 font-bold">
                          Then enter the code
                        </FormLabel>
                        <FormControl>
                          <InputOTP
                            className="!text-lg flex items-center"
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            {...field}
                            style={{ justifyContent: "center" }}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={0}
                                className="!w-14 !h-12 !text-lg"
                              />
                              <InputOTPSlot
                                index={1}
                                className="!w-14 !h-12 !text-lg"
                              />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={2}
                                className="!w-14 !h-12 !text-lg"
                              />
                              <InputOTPSlot
                                index={3}
                                className="!w-14 !h-12 !text-lg"
                              />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={4}
                                className="!w-14 !h-12 !text-lg"
                              />
                              <InputOTPSlot
                                index={5}
                                className="!w-14 !h-12 !text-lg"
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={isPending || isLoading}
                    className="w-full h-[40px]"
                  >
                    {isPending && <Loader className="animate-spin" />}
                    Verify
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AuthCard>
  );
};

export default EnableMfa;
