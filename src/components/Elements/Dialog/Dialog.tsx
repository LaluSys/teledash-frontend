import {
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle as HeadlessDialogTitle,
  Description as HeadlessDescription,
  CloseButton as HeadlessCloseButton,
  DialogBackdrop,
} from "@headlessui/react";
import * as React from "react";

type DialogProps = {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const DialogTitle = HeadlessDialogTitle;
export const DialogDescription = HeadlessDescription;
export const DialogCloseButton = HeadlessCloseButton;

export const Dialog = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}: DialogProps) => {
  return (
    <>
      <HeadlessDialog
        open={isOpen}
        onClose={onClose}
        transition
        className="fixed inset-0 z-50 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 w-screen overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel className="w-full max-w-3xl space-y-4 rounded-lg border bg-white p-12">
              {title && (
                <DialogTitle as="h3" className="text-lg font-bold leading-6">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
              {children}
            </DialogPanel>
          </div>
        </div>
      </HeadlessDialog>
    </>
  );
};
