import clsx from "clsx";
import { Link } from "react-router-dom";

import { TooltipLink } from "components/Elements";

import { Chat, ChatRef } from "types";

export const createDisplayNameFromChat = (chat: Chat | ChatRef) =>
  chat.title ?? chat.username ?? chat.id?.toString();

type ChatLinkProps = {
  chat: Chat | ChatRef;
  className?: string;
  link?: string;
};

export const ChatLink = ({ chat, className, link }: ChatLinkProps) => {
  const displayName = createDisplayNameFromChat(chat);

  return (
    <Link
      className={clsx("hover:underline", className)}
      to={typeof link === "string" ? link : `/chat/${chat.id}`}
    >
      {displayName}
    </Link>
  );
};

export const TooltipChatLink = ({ chat, className, link }: ChatLinkProps) => {
  const displayName = createDisplayNameFromChat(chat);

  return (
    <TooltipLink
      tippyProps={{
        content: (
          <div>
            <div>ID: {chat.id}</div>
          </div>
        ),
        interactive: true,
      }}
      className={clsx("hover:underline", className)}
      to={typeof link === "string" ? link : `/chat/${chat.id}`}
    >
      {displayName}
    </TooltipLink>
  );
};
