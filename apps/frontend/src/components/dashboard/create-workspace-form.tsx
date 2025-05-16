// src/components/workspace/workspace-card.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { FaSpinner } from "react-icons/fa";
import { useResponsiveDesign } from "@/hooks/global/useMediaQuery";
import { useCreateWorkspace } from "@/hooks/useWorkspace";
import { workspaceSchema, WorkspaceFormValues } from "@/types/workspace";
import { appRoutes } from "@/constants/app-routes";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ImageIcon } from "lucide-react";

const CreateWorkspaceForm = () => {
  const { mutate, isPending, error: apiError } = useCreateWorkspace();
  const [authError, setAuthError] = useState<{ message: string } | null>(null);
  const { prefersReducedMotion } = useResponsiveDesign();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (values: WorkspaceFormValues) => {
      setAuthError(null);
      mutate(values, {
        onError: (error: Error) => {
          const errorMessage = 
            error.message || "Workspace creation failed. Please try again.";
          setAuthError({ message: errorMessage });
          form.setError("root.serverError", {
            type: "manual",
            message: errorMessage,
          });
        },
      });
    },
    [mutate, form]
  );

  const animationClass = useMemo(
    () => (prefersReducedMotion ? "" : "animate-fadeIn"),
    [prefersReducedMotion]
  );

  const handleChangeImage = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        form.setValue("image", file, { shouldValidate: true });
      }
    },
    [form]
  );

  const serverErrorMessage = form.formState.errors.root?.serverError?.message;

  return (
    <Card className={`w-full max-w-md shadow-sm shadow-slate-400 ${animationClass}`}>
      <CardHeader className="text-center p-7">
        <CardTitle className="text-2xl font-bold">Create Workspace</CardTitle>
        <CardDescription>
          A workspace is where you and your team can collaborate on projects.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-7">
        {(authError || apiError || serverErrorMessage) && (
          <Alert variant="destructive" className="mb-4" role="alert">
            <AlertDescription>
              {authError?.message || apiError?.message || serverErrorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Workspace name"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.name}
                      aria-describedby="name-error"
                      className="focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="name-error" aria-live="polite" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="workspace-image" className="sr-only">
                    Workspace Image
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <img
                            className="object-cover w-full h-full"
                            alt="Workspace logo"
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Workspace Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG or JPEG, max 1mb
                        </p>
                        <input
                          id="workspace-image"
                          className="hidden"
                          type="file"
                          accept=".jpg, .png, .jpeg, .svg"
                          ref={inputRef}
                          onChange={handleChangeImage}
                          disabled={isPending}
                          aria-label="Upload workspace image"
                        />
                        <Button
                          type="button"
                          disabled={isPending}
                          variant="teritary"
                          size="xs"
                          className="w-fit mt-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => inputRef.current?.click()}
                        >
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:bg-blue-700 focus:outline-none flex items-center justify-center"
              disabled={isPending}
              size="lg"
              aria-busy={isPending}
              aria-live="polite"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Workspace"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardContent className="p-7 flex items-center justify-center">
        <p className="text-center">
          Want to join a workspace instead?
          <Link
            to={appRoutes.workspace.path}
            className="text-blue-700 hover:text-blue-800 hover:underline ml-1 focus:outline-none rounded"
          >
            Join Workspace
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default React.memo(CreateWorkspaceForm);