import Button from "./ui/Button";

export function LikeButton({ liked, onClick, className}: { liked: boolean, onClick: () => void, className?: string }) {
    return (
        <Button
            size="icon"
            variant="ghost"
            color="accent"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={onClick}
            className={className}
        >
            <i className={liked ? 'ri-heart-fill text-2xl' : 'ri-heart-line text-2xl'}></i>
        </Button>
    )
}