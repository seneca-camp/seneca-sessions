import Button, { ButtonProps } from "./ui/Button";

export type LikeButtonProps = {
  liked: boolean;
  count?: number;
} & ButtonProps;

export function LikeButton({
  liked,
  count,
  variant = "ghost",
  ...props
}: LikeButtonProps) {
  return (
    <Button
      size="icon"
      variant={variant}
      color={props.color || "danger"}
      aria-label={liked ? "Unlike" : "Like"}
      onClick={props.onClick}
      className={props.className}
    >
      <div className="flex items-center p-1">
        <i
          className={
            liked ? "ri-heart-fill text-2xl" : "ri-heart-line text-2xl"
          }
        ></i>
        {typeof count === "number" && (
          <span className="text-base min-w-4 text-center">{count}</span>
        )}
      </div>
    </Button>
  );
}
