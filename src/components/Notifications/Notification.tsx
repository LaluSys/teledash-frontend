import { TransitionChild } from "@headlessui/react";
import {
  mdiCheckCircleOutline,
  mdiInformationOutline,
  mdiAlertDecagramOutline,
  mdiCloseOctagonOutline,
  mdiClose,
} from "@mdi/js";
import Icon from "@mdi/react";
import { Fragment } from "react";
// import { Fragment } from "react";

const icons = {
  info: (
    <Icon
      path={mdiInformationOutline}
      size={1}
      className="text-blue-500"
      aria-hidden="true"
    />
  ),
  success: (
    <Icon
      path={mdiCheckCircleOutline}
      size={1}
      className="text-green-500"
      aria-hidden="true"
    />
  ),
  warning: (
    <Icon
      path={mdiAlertDecagramOutline}
      size={1}
      className="text-yellow-500"
      aria-hidden="true"
    />
  ),
  error: (
    <Icon
      path={mdiCloseOctagonOutline}
      size={1}
      className="text-red-500"
      aria-hidden="true"
    />
  ),
};

export type NotificationProps = {
  notification: {
    id: string;
    type: keyof typeof icons;
    title: string;
    message?: string;
  };
  onDismiss: (id: string) => void;
};

export const Notification = ({
  notification: { id, type, title, message },
  onDismiss,
}: NotificationProps) => {
  return (
    <TransitionChild
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        role="alert"
        aria-label={title}
        className="pointer-events-auto flex w-full max-w-sm items-start overflow-hidden rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 flex-1 pt-0.5">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              onDismiss(id);
            }}
          >
            <span className="sr-only">Close</span>
            <Icon
              path={mdiClose}
              size={1}
              className="text-blue-500"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      {/* <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
      </div> */}
    </TransitionChild>
  );
};
