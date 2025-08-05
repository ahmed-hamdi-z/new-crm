import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateTaskForm from "./create-task-form";

const CreateTask = (props: { projectId?: string, newTask?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button className="text-black bg-transparent hover:bg-neutral-400">
            <Plus />
            {props.newTask}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
          <CreateTaskForm projectId={props.projectId} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTask;