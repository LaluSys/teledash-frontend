import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import * as React from "react";

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  renderFooter: () => React.ReactNode;
  size?: keyof typeof sizes;
};

export const Drawer = ({
  title,
  children,
  isOpen,
  onClose,
  renderFooter,
  size = "md",
}: DrawerProps) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-40 overflow-hidden"
        open={isOpen}
        onClose={onClose}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* TODO: Since we don't use Drawer rigth now, it is hard to test if the changes regarding DialogPanel are working as expected. */}
          <div className="absolute inset-0" />
          <DialogPanel className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as={React.Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className={clsx("w-screen", sizes[size])}>
                <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-medium">
                          {title}
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <Icon path={mdiClose} size={1} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 justify-end space-x-2 px-4 py-4">
                    {renderFooter()}
                  </div>
                </div>
              </div>
            </TransitionChild>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
};
