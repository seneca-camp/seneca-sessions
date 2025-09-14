import Button, { ButtonProps } from "./ui/Button";

export type LikeButtonProps = {
    liked: boolean;
} & ButtonProps;

export function LikeButton({ liked, variant = 'ghost', ...props }: LikeButtonProps) {
    return (
        <Button
            size="icon"
            variant={variant}
            color={props.color || 'danger'}
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={props.onClick}
            className={props.className}
        >
            <i className={liked ? 'ri-heart-fill text-2xl' : 'ri-heart-line text-2xl'}></i>
        </Button>
    )
}