import { flashIcon, chevronRightIcon } from "@/public/icons";

export const Breadcrumb: React.FC = () => {
  return (
    <div className="inline-flex items-center space-x-1">
      <div className="bg-[#F5F5F580] inline-flex items-center py-1 px-2 space-x-1">
        {flashIcon}

        <span className="text-[#6C6F75] text-sm font-medium select-none">
          Frontend
        </span>
      </div>

      {chevronRightIcon}

      <span className="text-[#6C6F75] text-sm font-medium select-none">
        New Task
      </span>
    </div>
  );
};
