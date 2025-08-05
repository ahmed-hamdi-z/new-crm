import { Loader, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { DottedSeparator } from "../shared/dotted-separator";
import { getAvatarColor, getAvatarFallbackText } from "@/config/helpers";

export const UserButton = () => {
  const { data, isLoading } = useAuth();
  const user = data?.data?.user;

  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const { name, email, profilePicture } = user;
  const initials = getAvatarFallbackText(name);
  const avatarColor = getAvatarColor(name);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative bg-white">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarImage src={profilePicture || ""} alt="Avatar" />
          <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className=" flex flex-col items-center justify-center gap-2 px-2.5 py-4 bg-white">
          <Avatar className="size-[52px] border border-neutral-300">
            <AvatarImage src={profilePicture || ""} alt="Avatar" />
            <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>

        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer bg-white"
        >
          <LogOut className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
