import { Box } from "components/Elements";

export type ListBoxProps<T> = {
  startIcon?: string;
  title: string;
  items: T[];
  length?: number;
  variant?: "ordered" | "unordered";
  className?: string;
  children: (item: T) => JSX.Element;
};

export function ListBox<T>({
  startIcon,
  title,
  items,
  length = 10,
  variant = "unordered",
  className,
  children,
}: ListBoxProps<T>) {
  const ListTag = variant === "ordered" ? "ol" : "ul";

  return (
    <Box title={title} startIcon={startIcon} className={className}>
      <ListTag className="text-sm">
        {items.slice(0, length).map((item) => children(item))}
      </ListTag>
    </Box>
  );
}
