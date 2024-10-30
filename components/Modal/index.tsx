"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "@/context/modal";

const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
  >
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  breadcrumb?: JSX.Element;
  footer?: JSX.Element;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  breadcrumb,
  footer,
  children,
}) => {
  const { isOpen, closeModal } = useModal();

  const [scaleModal, setScaleModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setScaleModal(true);
      }, 0.1);
    } else {
      setScaleModal(false);
    }

    return () => {
      setScaleModal(false);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen inset-0 flex items-start pt-[13vh] justify-center z-50 transition-opacity duration-300 ${
        isOpen && scaleModal ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="bg-[#10101239] bg-opacity-[0.95] absolute inset-0"
        onClick={closeModal}
      />

      <div
        className={`relative bg-white rounded-lg w-full max-w-[750px] h-auto transition-all will-change-transform transform ease-out duration-300 ${
          isOpen && scaleModal ? "scale-100 opacity-100" : "scale-95 opacity-90"
        }`}
      >
        <div
          id="modalHeader"
          className="w-full inline-flex items-center justify-between px-3 pt-3 pb-[6px]"
        >
          {!breadcrumb && title ? (
            <h2 className="text-lg font-bold mb-4">{title}</h2>
          ) : null}

          {breadcrumb}

          <button
            onClick={closeModal}
            className="h-7 min-w-7 rounded hover:bg-gray-100 inline-flex items-center justify-center text-[#6C6F75]"
          >
            {closeIcon}
          </button>
        </div>

        <div>{children}</div>

        <div className="w-full h-auto">{footer}</div>
      </div>
    </div>
  );
};
