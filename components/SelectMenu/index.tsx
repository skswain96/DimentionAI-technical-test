import React, { useRef, useEffect } from "react";

import { OutsideAlerter } from "@/components/Action/OutsideAlerter";
import { checkIcon } from "@/public/icons";

export const SelectMenu: React.FC<any> = ({
  placeholder,
  options,
  type,
  name,
  selectedValue,
  handleOptClick,
  handleOutsideClick,
}) => {
  return (
    <OutsideAlerter handleOutsideClick={handleOutsideClick}>
      <div className="!m-0 inline-flex flex-col w-auto min-w-[180px] bg-white rounded-lg absolute left-0 top-9 z-10 text-gray-800 text-sm border-[1px] border-[#DFE1E4] shadow-dropdown">
        <div className="inline-flex w-full border-b-[1px] border-b-[#DFE1E4] rounded-t-lg">
          <input
            placeholder={placeholder}
            className="outline-none w-full px-3 py-2 rounded-t-lg"
          />
        </div>

        <div className="inline-flex w-full flex-col p-1">
          {options?.map((item: any, index: number) => {
            const isChecked =
              type === "multi-select" &&
              Array.isArray(selectedValue[name]) &&
              selectedValue[name]?.some(
                (selectedItem: any) => selectedItem.key === item.key
              );

            return (
              <button
                key={item?.key + "_" + index}
                className="group px-3 py-1 text-sm hover:bg-[#f3f3f3] rounded cursor-pointer inline-flex items-center space-x-2 outline-none"
                onClick={(e: any) => {
                  e.preventDefault();
                  handleOptClick(item);
                }}
              >
                {type === "multi-select" && (
                  //   <input
                  //     type="checkbox"
                  //     checked={isChecked}
                  //     onChange={() => null}
                  //     className="cursor-none"
                  //   />
                  <div
                    className={`${
                      isChecked ? "opacity-100" : "opacity-0"
                    } group-hover:!opacity-100 inline-flex items-center justify-center`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => null}
                      className="cursor-pointer"
                    />
                  </div>
                )}
                <div className="inline-flex items-center justify-between w-full">
                  <div className="inline-flex items-center space-x-2">
                    <span className="text-[#969a9f]">{item?.icon}</span>
                    <span className="text-gray-600 text-left">{item?.cat}</span>
                  </div>

                  {type !== "multi-select" &&
                  selectedValue[name]?.key === item?.key ? (
                    <>{checkIcon}</>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </OutsideAlerter>
  );
};
