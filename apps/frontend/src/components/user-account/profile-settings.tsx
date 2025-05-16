import React, { useState, useCallback, useEffect } from "react";

// Hooks
import useSessions from "@/hooks/authentication/useSession";

// Components
import SessionCard from "@/components/global/session-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Types
import { Session } from "@/types/sessions";

/**
 * Settings page component to display and manage user sessions.
 * Handles loading, error, empty, and success states for session fetching.
 * Allows users to revoke sessions.
 */
const ProfileSettings: React.FC = () => {
  // Assuming the hook provides these states and a refetch function
  const {
    sessions: initialSessions,
    isPending,
    isSuccess,
    isError,
    refetch,
  } = useSessions();

  // Local state to manage sessions after revocation, avoiding immediate refetch if preferred
  const [sessions, setSessions] = useState<Session[] | null>(null);

  // Update local sessions when initial fetch completes or changes
  useEffect(() => {
    if (isSuccess && initialSessions) {
      // Handle the case where initialSessions might be AxiosResponse
      const sessionsData = Array.isArray(initialSessions)
        ? initialSessions
        : initialSessions.data; // Assuming the data is in the response's data property

      setSessions(sessionsData as Session[]); // Type assertion if you're confident about the shape
    }
  }, [isSuccess, initialSessions]);

  // Handle successful revocation by removing the session from local state
  const handleRevokeSuccess = useCallback((revokedSessionId: string) => {
    setSessions((currentSessions) =>
      currentSessions
        ? currentSessions.filter((s) => s._id !== revokedSessionId)
        : null
    );
    // Optionally, could trigger a refetch here instead of just updating local state:
    // if (refetch) refetch();
  }, []);

  // Render loading state with skeletons
  const renderLoading = () => (
    <div
      className="flex flex-col gap-3"
      aria-label="Loading sessions"
      aria-live="polite" // Announce loading state
      role="status"
    >
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 border rounded-lg"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );

  // Render error state
  const renderError = () => (
    <div
      className="text-center py-10 px-4 border border-red-200 bg-red-50 rounded-lg"
      role="alert"
      aria-live="assertive" // Announce error state immediately
    >
      <p className="text-red-600 font-semibold mb-3">
        Failed to load your sessions.
      </p>
      <p className="text-red-500 text-sm mb-4">
        There was an issue retrieving your session information. Please try
        again.
      </p>
      <Button
        onClick={() => refetch && refetch()}
        variant="destructive"
        size="sm"
      >
        Retry
      </Button>
    </div>
  );

  // Render empty state
  const renderEmpty = () => (
    <div
      className="text-center py-10 px-4 border border-gray-200 bg-gray-50 rounded-lg"
      role="status"
      aria-live="polite" // Announce empty state
    >
      <p className="text-gray-600 font-semibold">No active sessions found.</p>
      <p className="text-gray-500 text-sm mt-1">
        Only your current session is active, or other sessions have been
        revoked.
      </p>
    </div>
  );

  // Render success state with session list
  const renderSuccess = (sessionList: Session[]) => (
    // Use a list role for better semantics
    <ul className="flex flex-col gap-3" aria-label="Active sessions list">
      {sessionList.map((session) => (
        <li key={session._id}>
          <SessionCard
            session={session}
            onRevokeSuccess={handleRevokeSuccess}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Sessions</h1>

      {isPending && renderLoading()}

      {isError && renderError()}

      {/* Use local sessions state for rendering after initial load */}
      {isSuccess && sessions && sessions.length > 0 && renderSuccess(sessions)}

      {isSuccess && (!sessions || sessions.length === 0) && renderEmpty()}
    </div>
  );
};

export default ProfileSettings;
