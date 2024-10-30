"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";

interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

// Create the context with an undefined default value
const ModalContext: any = createContext<ModalContextType | undefined>(
  undefined
);

// ModalProvider component
export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children} {/* Ensure this returns valid JSX */}
    </ModalContext.Provider>
  );
};

// Custom hook to use the ModalContext
export const useModal: any = (): ModalContextType => {
  const context: any = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
