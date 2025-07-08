import CreateWorkspaceForm from "./create-workspace-form";
import useCreateWorkspaceDialog from "../hooks/client/useCreateWorkspaceDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
const CreateWorkspace = () => {
  const { open, onClose } = useCreateWorkspaceDialog();

  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl !p-0 overflow-hidden border-0">
        <CreateWorkspaceForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;
