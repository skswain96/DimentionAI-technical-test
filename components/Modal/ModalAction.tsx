import { Button } from "@/components/Action/Button";
import { PMMenuBar } from "@/components/ProseMirror/PMMenuBar";
import { EditorView } from "prosemirror-view";
import { enterIcon } from "@/public/icons";

export const ModalAction: React.FC<{
  editorView: EditorView;
  handleOnClick: () => void;
}> = ({ editorView, handleOnClick }) => {
  return (
    <div className="inline-flex items-center justify-between w-full p-3 border-t-[1px] border-t-[#DFE1E499]">
      <PMMenuBar editorView={editorView!} />

      <Button
        variant="primary"
        className="text-sm inline-flex items-center space-x-3 px-[14px] min-h-8"
        onClick={handleOnClick}
      >
        <span>Create</span>
        <div className="min-h-8 w-[1px] bg-white bg-opacity-[0.2]" />
        {enterIcon}
      </Button>
    </div>
  );
};
