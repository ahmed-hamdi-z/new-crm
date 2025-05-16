import React, { useState, useCallback } from "react";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Assuming Dialog components exist

// Icons (assuming these exist or use alternatives)
import {
  FaWindows,
  FaApple,
  FaLinux,
  FaQuestionCircle,
  FaMobileAlt,
  FaDesktop,
  FaSpinner,
} from "react-icons/fa";

// Hooks
import useSessions from "@/hooks/authentication/useSession";

// Types
import { Session } from "@/types/sessions";
import useDeleteSession from "@/hooks/authentication/useDeleteSession";

interface SessionCardProps {
  session: Session;
  onRevokeSuccess: (sessionId: string) => void; // Callback when a session is successfully revoked
}

// Helper to parse User Agent (basic example, consider using a library like ua-parser-js)
const parseUserAgent = (
  ua: string
): {
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "unknown";
} => {
  ua = ua.toLowerCase();
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let deviceType: "desktop" | "mobile" | "unknown" = "unknown";

  // Basic OS detection
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

  // Basic Browser detection
  if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("chrome") && !ua.includes("edg"))
    browser = "Chrome"; // Exclude Edge
  else if (ua.includes("safari") && !ua.includes("chrome"))
    browser = "Safari"; // Exclude Chrome
  else if (ua.includes("edg")) browser = "Edge";
  else if (ua.includes("msie") || ua.includes("trident"))
    browser = "Internet Explorer";

  // Basic Device Type detection
  if (os === "Android" || os === "iOS") deviceType = "mobile";
  else if (os === "Windows" || os === "macOS" || os === "Linux")
    deviceType = "desktop";

  return { browser, os, deviceType };
};

// Helper to get OS Icon
const getOsIcon = (os: string) => {
  os = os.toLowerCase();
  if (os.includes("windows")) return <FaWindows className="mr-2" />;
  if (os.includes("mac")) return <FaApple className="mr-2" />;
  if (os.includes("linux")) return <FaLinux className="mr-2" />;
  if (os.includes("android") || os.includes("ios"))
    return <FaMobileAlt className="mr-2" />;
  return <FaQuestionCircle className="mr-2" />;
};

/**
 * Displays information about a single user session and allows revocation.
 */
const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { isPending: isRevoking, error: revokeError } = useSessions();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { browser, os, deviceType } = parseUserAgent(session.userAgent);
  const { deleteSession } = useDeleteSession(session._id);

  const handleRevokeClick = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmRevoke = useCallback(() => {
    deleteSession(undefined, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        onRevokeSuccess(session._id); // Notify parent component
      },
      onError: () => {
        setIsConfirmOpen(false); // Close dialog even on error
      }
    });
  }, [deleteSession, session._id, onRevokeSuccess]);


  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
      <div className="flex items-center gap-4 flex-grow">
        {deviceType === "desktop" ? (
          <FaDesktop className="text-3xl text-gray-500 flex-shrink-0" />
        ) : deviceType === "mobile" ? (
          <FaMobileAlt className="text-3xl text-gray-500 flex-shrink-0" />
        ) : (
          <FaQuestionCircle className="text-3xl text-gray-500 flex-shrink-0" />
        )}
        <div className="flex-grow">
          <div className="flex items-center font-semibold">
            {getOsIcon(os)}
            {os} - {browser}
            {session.isCurrent && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Current Session
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500">
            IP: {session.ipAddress} &bull; Last active
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0 w-full sm:w-auto">
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={session.isCurrent || isRevoking}
              onClick={handleRevokeClick}
              className={`w-full sm:w-auto ${session.isCurrent ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isRevoking ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                "Revoke"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Session Revocation</DialogTitle>
              <DialogDescription>
                Are you sure you want to revoke this session? The user will be
                logged out immediately.
                <br />
                <span className="font-medium">
                  {os} - {browser} ({session.ipAddress})
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
              onClick={handleConfirmRevoke} variant="destructive" disabled={isRevoking}>
                {isRevoking ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  "Revoke Session"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {revokeError && (
          <Alert
            variant="destructive"
            className="text-xs p-2 mt-1 w-full sm:w-auto"
          >
            <AlertDescription>{revokeError.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

export default SessionCard;
function onRevokeSuccess(_id: string) {
  throw new Error("Function not implemented.");
}

