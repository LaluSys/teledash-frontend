import * as React from "react";

import { Link } from "components/Elements";
import { Head } from "components/Head";

import { APP_NAME } from "config";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 px-4 pb-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link to="/">{APP_NAME}</Link>
          </div>
          <h2 className="mt-3 text-center text-3xl font-extrabold">{title}</h2>
          <div className="mt-8 bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
