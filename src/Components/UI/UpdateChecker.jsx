import { RotateCwClock } from "lucide-react";
import { Button } from "./Button";
import useUpdationInfo from "../../Hooks/useUpdationInfo";
import { useSelector } from "react-redux";

function UpdateChecker() {
  const updateCheck = useUpdationInfo();

  const { ollamaUpdate, ollamaUpdateError, modelUpdate, ollamaUpdateLoading } = useSelector(
    (state) => state.update,
  );

  const handleCheckForUpdate = () => {
    updateCheck;
  };
  return (
    <>
      <Button
        className="w-fit h-fit p-2"
        title="Check for updates"
        onClick={handleCheckForUpdate()}
      >
        <RotateCwClock className=" size-5" />
      </Button>
    </>
  );
}

export default UpdateChecker;
