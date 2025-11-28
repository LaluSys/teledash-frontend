import Icon from "@mdi/react";
import clsx from "clsx";
import { ReactNode } from "react";

type BoxProps = {
  startIcon?: string;
  title: string;
  className?: string;
  children: ReactNode;
};

export const Box = ({ startIcon, title, children, className }: BoxProps) => {
  return (
    <div
      className={clsx(
        "-mx-4 bg-white p-4 shadow sm:mx-0 sm:rounded-lg sm:p-6",
        className,
      )}
    >
      <div className="mb-1 flex flex-row items-center gap-2 text-sm font-medium text-gray-500">
        {startIcon && (
          <Icon
            path={startIcon}
            size={0.75}
            aria-hidden="true"
            className="flex-shrink-0"
          />
        )}
        {title}
      </div>
      {children}
    </div>
  );
};
