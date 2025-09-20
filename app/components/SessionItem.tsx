import { LikeButton } from "./LikeButton";
import { UserSession } from "./Sessions";

export type SessionItemProps = {
  session: UserSession;
  toggleLikedness: (sessionId: string) => void;
  displayRoom?: boolean;
  as?: "cell";
};

export function SessionItem(props: SessionItemProps) {
  const defaultClx = "relative border border-3 rounded-md p-4 pr-[40px]";
  const clx =
    defaultClx +
    ` ${props.session.liked ? "bg-deeppurple-20 border-deeppurple-40" : "bg-fancyorange-10 border-fancyorange-40 "}`;

  if (props.as === "cell") {
    return (
      <td className={clx}>
        <SessionContent {...props} />
      </td>
    );
  }
  return (
    <div className={clx}>
      <SessionContent {...props} />
    </div>
  );
}

function SessionContent(props: SessionItemProps) {
  return (
    <>
      {props.displayRoom && (
        <p className={`text-gray-80 text-sm`}>{props.session.room}</p>
      )}
      <p className="text-lg font-bold text-gray-90">{props.session.title}</p>
      <Note href={props.session.note} />
      <LikeButton
        className="absolute top-0 right-0"
        liked={props.session.liked}
        count={props.session.likeCount}
        onClick={() => props.toggleLikedness(props.session.id)}
      />
    </>
  );
}

function Note({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-80 hover:text-gray-90 hover:underline"
      title="Open session notes"
    >
      <i className="ri-file-edit-line text-lg"></i> Session Notes
    </a>
  );
}
