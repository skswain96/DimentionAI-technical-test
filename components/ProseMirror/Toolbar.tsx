import React, { useEffect, useState } from "react";

import { SelectMenu } from "@/components/SelectMenu";
import { createIssueOptions } from "@/constants/createIssueFieldOptions";
import { suggestionIcon, cloudIcon } from "@/public/icons";

export const Toolbar: React.FC<{
  issueTitle: string;
  handleInputData: (arg: any) => void;
}> = ({ issueTitle, handleInputData }) => {
  const [height, setHeight] = useState(0);
  const [wordList, setWordList] = useState<any>([]);
  const [activeSelectOptions, setActiveSelectOptions] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState<any>({
    status: createIssueOptions?.find((d) => d?.name === "status")?.options[0],
    assignee: [
      createIssueOptions?.find((d) => d?.name === "assignee")?.options[0],
    ],
    priority: null,
    tags: null,
    project: null,
    dueDate: null,
  });

  useEffect(() => {
    handleInputData(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    const splitWords: any = issueTitle.split(" ");
    setWordList(splitWords);
  }, [issueTitle]);

  useEffect(() => {
    let animationFrame: number;
    const maxHeight = 40;
    const incrementAmount = 2; // Increment per frame
    let currentHeight = height;

    const animateHeight = () => {
      if (wordList.includes("cloud") && currentHeight < maxHeight) {
        // Expanding height
        currentHeight = Math.min(currentHeight + incrementAmount, maxHeight);
        setHeight(currentHeight);
        if (currentHeight < maxHeight) {
          animationFrame = requestAnimationFrame(animateHeight);
        }
      } else if (!wordList.includes("cloud") && currentHeight > 0) {
        // Collapsing height
        currentHeight = Math.max(currentHeight - incrementAmount, 0);
        setHeight(currentHeight);
        if (currentHeight > 0) {
          animationFrame = requestAnimationFrame(animateHeight);
        }
      }
    };

    animateHeight();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [wordList]);

  return (
    <React.Fragment>
      <div
        id="suggestionBox"
        className={`relative`}
        style={{ height: `${height}px` }}
      >
        {wordList?.length > 0 && wordList?.includes("cloud") && (
          <div className="inline-flex items-center w-full space-x-2 pb-3 pt-[2px] transition-opacity ease-in-out duration-300">
            <div className="inline-flex items-center justify-center text-[#94989E]">
              {suggestionIcon}
            </div>
            <div className="inline-flex items-center space-x-2">
              {[
                {
                  label: "cloud",
                  icon: cloudIcon,
                },
              ].map((opt: any, index: number) => {
                return (
                  <button
                    key={opt?.label + "_" + index}
                    className="inline-flex items-center justify-center space-x-2 border-[1px] border-dashed border-[#DFE1E4] rounded-lg px-3 py-[6px] text-[#94989E] outline-none"
                  >
                    {opt?.icon}

                    <span className="text-xs font-medium">{opt?.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="relative inline-flex items-center w-full space-x-2 pb-[18px]">
        {createIssueOptions.map((opt: any, index: number) => {
          return (
            <div key={opt?.label + "_" + index} className="relative">
              <button
                className="inline-flex items-center justify-center space-x-2 border-[1px] border-[#DFE1E4] rounded-lg px-3 py-[6px] text-[#94989E] outline-none hover:!bg-[#f7f7f7] transition-colors duration-200"
                style={{
                  backgroundColor:
                    activeSelectOptions?.name === opt?.name
                      ? "#f7f7f7"
                      : "inherit",
                }}
                onClick={() => {
                  if (opt?.name === "dueDate") {
                    return;
                  }

                  if (activeSelectOptions) {
                    setActiveSelectOptions(null);

                    return;
                  }

                  setActiveSelectOptions(opt);
                }}
              >
                {selectedValue[opt?.name]?.icon || opt?.icon}

                <span className="text-xs font-medium">
                  {selectedValue[opt?.name]?.cat || opt?.label}
                </span>
              </button>

              {activeSelectOptions?.name === opt?.name && (
                <SelectMenu
                  placeholder={activeSelectOptions?.placeholder}
                  options={activeSelectOptions?.options}
                  type={activeSelectOptions?.type}
                  name={activeSelectOptions?.name}
                  selectedValue={selectedValue}
                  handleOptClick={(item: any) => {
                    const currentSelection =
                      selectedValue[activeSelectOptions?.name] || [];

                    let updatedSelection;
                    if (activeSelectOptions?.type === "multi-select") {
                      if (
                        currentSelection.some((i: any) => i.key === item.key)
                      ) {
                        // Remove item if it is already selected
                        updatedSelection = currentSelection.filter(
                          (i: any) => i.key !== item.key
                        );
                      } else {
                        // Add item if it is not selected
                        updatedSelection = [...currentSelection, item];
                      }
                    } else {
                      updatedSelection = item; // For single select
                    }

                    setSelectedValue({
                      ...selectedValue,
                      [activeSelectOptions?.name]: updatedSelection,
                    });

                    if (activeSelectOptions?.type !== "multi-select") {
                      setActiveSelectOptions(null);
                    }
                  }}
                  handleOutsideClick={() => {
                    setActiveSelectOptions(null);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};
