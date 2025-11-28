import { Spinner } from "components/Elements";

export function PageLoadingSpinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner size="xl" className="text-blue-600" />
    </div>
  );
}
