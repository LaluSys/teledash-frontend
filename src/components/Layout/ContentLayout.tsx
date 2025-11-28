import * as React from "react";

import { Head } from "components/Head";

type ContentLayoutProps = {
  children: React.ReactNode;
  title?: string;
  titleExtra?: React.ReactNode;
};

export const ContentLayout = ({
  children,
  title,
  titleExtra,
}: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:px-8">
          {(title ?? titleExtra) && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <h1 className="truncate text-2xl font-bold leading-7 sm:text-3xl">
                {title}
              </h1>
              {titleExtra}
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
