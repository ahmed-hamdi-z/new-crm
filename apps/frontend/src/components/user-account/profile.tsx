import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import useCurrent from "@/hooks/authentication/usecurrent"


const Profile = () => {
  const { user } = useCurrent()
  if (!user) return null
  const { email, verified, createdAt } = user

  return (
    <div className="flex flex-col items-center mt-16 text-center">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>

      {!verified && (
        <Alert variant="destructive" className="w-fit mb-3 rounded-xl">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Please verify your email</AlertDescription>
        </Alert>
      )}

      <p className="text-white mb-2">
        Email: <span className="text-gray-300">{email}</span>
      </p>
      <p className="text-white">
        Created on{" "}
        <span className="text-gray-300">
          {new Date(createdAt).toLocaleDateString("en-US")}
        </span>
      </p>
    </div>
  )
}

export default Profile
