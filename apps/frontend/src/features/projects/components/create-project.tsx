import { Dialog, DialogContent } from "@/components/ui/dialog";
import useCreateProjectDialog from "../hooks/client/useCreateProjectDialog";
import CreateProjectForm from "./create-project-form";

const CreateProject = () => {
  const { open, onClose } = useCreateProjectDialog();
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0">
        <CreateProjectForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
