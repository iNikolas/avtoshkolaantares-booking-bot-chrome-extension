import { cn } from "@utils";

export function Loader({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      className={cn("loading loading-spinner loading-lg", className)}
      {...props}
    />
  );
}
