import { Button } from "./Button";

interface LoadMoreButtonProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export const LoadMoreButton = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: LoadMoreButtonProps) => {
  if (!hasNextPage) return null;

  return (
    <div className="flex justify-center bg-gray-50 px-4 py-4 sm:rounded-b-lg sm:px-6">
      <Button
        variant="secondary"
        onClick={onLoadMore}
        disabled={!hasNextPage || isFetchingNextPage}
        size="sm"
        isLoading={isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading more…" : "Load more"}
      </Button>
    </div>
  );
};
