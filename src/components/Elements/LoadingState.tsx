import { Spinner } from "components/Elements/Spinner";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const LoadingState = ({
  message = "Loading…",
  size = "sm",
}: LoadingStateProps) => {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Spinner size={size} />
      <div>{message}</div>
    </div>
  );
};
