import clsx from "clsx";

import { TooltipLink } from "components/Elements";

import { User, UserRef } from "types";

const stringHasLetters = (text: string) => /\p{Letter}/gu.test(text);

export const createDisplayNameFromUser = (user: UserRef | User) => {
  const result = [];

  if (user.first_name && stringHasLetters(user.first_name)) {
    result.push(user.first_name);
  }

  if (user.last_name && stringHasLetters(user.last_name)) {
    result.push(user.last_name);
  }

  if (result.length) {
    if (user.username && stringHasLetters(user.username)) {
      return `${result.join(" ")} (@${user.username})`;
    } else {
      return result.join(" ");
    }
  }

  if (user.username && stringHasLetters(user.username)) {
    return `@${user.username}`;
  }

  return user.id.toString();
};

type UserLinkProps = {
  user: User | UserRef;
  className?: string;
  link?: string;
};

export const UserLink = ({ user, className, link }: UserLinkProps) => {
  const displayName = createDisplayNameFromUser(user);

  return (
    <TooltipLink
      tippyProps={{
        content: (
          <div>
            <div>ID: {user.id}</div>
          </div>
        ),
        interactive: true,
      }}
      className={clsx("hover:underline", className)}
      to={typeof link === "string" ? link : `/user/${user.id}`}
    >
      {displayName}
    </TooltipLink>
  );
};
