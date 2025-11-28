import {
  mdiAccountPlus,
  mdiAccountMinus,
  mdiRename,
  mdiImageOutline,
  mdiImageOff,
  mdiPin,
  mdiHistory,
  mdiTimerOutline,
  mdiCameraOutline,
  mdiMapMarker,
  mdiForumOutline,
  mdiForum,
  mdiGamepadVariantOutline,
  mdiGiftOutline,
  mdiVideoOutline,
  mdiPhone,
  mdiWeb,
  mdiAccountGroup,
  mdiShare,
  mdiCreditCard,
  mdiStar,
  mdiCurrencyUsd,
  mdiRocketLaunchOutline,
  mdiPaletteOutline,
  mdiCheckboxMarkedCircleOutline,
  mdiHelpCircleOutline,
  mdiCogOutline,
} from "@mdi/js";
import Icon from "@mdi/react";

import { UserLink } from "features/users";

import {
  Message as MessageType,
  MessageServiceType,
  UserRef,
  MessageServiceInfo as MessageServiceInfoType,
} from "types";

interface MessageServiceInfoProps {
  service_info: MessageServiceInfoType;
}

const serviceInfoVariants: Record<
  MessageServiceType,
  {
    icon: string;
    getText: (service_info: MessageType["service_info"]) => string;
  }
> = {
  // User management
  NEW_CHAT_MEMBERS: {
    icon: mdiAccountPlus,
    getText: () => "joined the chat",
  },
  LEFT_CHAT_MEMBER: {
    icon: mdiAccountMinus,
    getText: () => "left the chat",
  },

  // Chat modifications
  NEW_CHAT_TITLE: {
    icon: mdiRename,
    getText: (info) =>
      info?.new_chat_title
        ? `Chat title changed to "${info.new_chat_title}"`
        : "Chat title changed",
  },
  NEW_CHAT_PHOTO: {
    icon: mdiImageOutline,
    getText: () => "Chat photo updated",
  },
  DELETE_CHAT_PHOTO: {
    icon: mdiImageOff,
    getText: () => "Chat photo removed",
  },

  // Chat creation
  GROUP_CHAT_CREATED: {
    icon: mdiAccountGroup,
    getText: () => "Group created",
  },
  SUPERGROUP_CHAT_CREATED: {
    icon: mdiAccountGroup,
    getText: () => "Supergroup created",
  },
  CHANNEL_CHAT_CREATED: {
    icon: mdiAccountGroup,
    getText: () => "Channel created",
  },

  // Forum topics
  FORUM_TOPIC_CREATED: {
    icon: mdiForumOutline,
    getText: () => "Forum topic created",
  },
  FORUM_TOPIC_CLOSED: {
    icon: mdiForumOutline,
    getText: () => "Forum topic closed",
  },
  FORUM_TOPIC_REOPENED: {
    icon: mdiForum,
    getText: () => "Forum topic reopened",
  },
  FORUM_TOPIC_EDITED: {
    icon: mdiForumOutline,
    getText: () => "Forum topic edited",
  },
  GENERAL_FORUM_TOPIC_HIDDEN: {
    icon: mdiForumOutline,
    getText: () => "General forum topic hidden",
  },
  GENERAL_FORUM_TOPIC_UNHIDDEN: {
    icon: mdiForum,
    getText: () => "General forum topic shown",
  },

  // Migration
  MIGRATE_TO_CHAT_ID: {
    icon: mdiShare,
    getText: () => "Chat migrated",
  },
  MIGRATE_FROM_CHAT_ID: {
    icon: mdiShare,
    getText: () => "Chat migrated",
  },

  // Messages
  PINNED_MESSAGE: {
    icon: mdiPin,
    getText: () => "Message pinned",
  },

  // Games & Activities
  GAME_HIGH_SCORE: {
    icon: mdiGamepadVariantOutline,
    getText: () => "New high score!",
  },

  // Giveaways & Gifts
  GIVEAWAY_CREATED: {
    icon: mdiGiftOutline,
    getText: () => "Giveaway created",
  },
  GIVEAWAY_COMPLETED: {
    icon: mdiGiftOutline,
    getText: () => "Giveaway completed",
  },
  GIVEAWAY_PRIZE_STARS: {
    icon: mdiStar,
    getText: () => "Giveaway prize: stars",
  },
  GIFT_CODE: {
    icon: mdiGiftOutline,
    getText: () => "Gift code shared",
  },
  GIFT: {
    icon: mdiGiftOutline,
    getText: () => "Gift received",
  },
  GIFTED_PREMIUM: {
    icon: mdiStar,
    getText: () => "Premium gifted",
  },
  GIFTED_STARS: {
    icon: mdiStar,
    getText: () => "Stars gifted",
  },
  GIFTED_TON: {
    icon: mdiCurrencyUsd,
    getText: () => "TON gifted",
  },

  // Video calls
  VIDEO_CHAT_STARTED: {
    icon: mdiVideoOutline,
    getText: () => "Video chat started",
  },
  VIDEO_CHAT_ENDED: {
    icon: mdiVideoOutline,
    getText: () => "Video chat ended",
  },
  VIDEO_CHAT_SCHEDULED: {
    icon: mdiVideoOutline,
    getText: () => "Video chat scheduled",
  },
  VIDEO_CHAT_MEMBERS_INVITED: {
    icon: mdiVideoOutline,
    getText: () => "Members invited to video chat",
  },

  // Phone calls
  PHONE_CALL_STARTED: {
    icon: mdiPhone,
    getText: () => "Phone call started",
  },
  PHONE_CALL_ENDED: {
    icon: mdiPhone,
    getText: () => "Phone call ended",
  },

  // Payments
  SUCCESSFUL_PAYMENT: {
    icon: mdiCreditCard,
    getText: () => "Payment successful",
  },
  REFUNDED_PAYMENT: {
    icon: mdiCreditCard,
    getText: () => "Payment refunded",
  },
  PAID_MESSAGES_REFUNDED: {
    icon: mdiCreditCard,
    getText: () => "Paid messages refunded",
  },
  PAID_MESSAGES_PRICE_CHANGED: {
    icon: mdiCreditCard,
    getText: () => "Paid messages price changed",
  },
  DIRECT_MESSAGE_PRICE_CHANGED: {
    icon: mdiCreditCard,
    getText: () => "Direct message price changed",
  },

  // Settings & Features
  SET_MESSAGE_AUTO_DELETE_TIME: {
    icon: mdiTimerOutline,
    getText: (info) =>
      info?.set_message_auto_delete_time
        ? `Auto-delete timer set to ${info.set_message_auto_delete_time} seconds`
        : "Auto-delete timer set",
  },
  HISTORY_CLEARED: {
    icon: mdiHistory,
    getText: () => "Chat history cleared",
  },
  SCREENSHOT_TAKEN: {
    icon: mdiCameraOutline,
    getText: () => "Screenshot taken",
  },
  PROXIMITY_ALERT_TRIGGERED: {
    icon: mdiMapMarker,
    getText: () => "Proximity alert triggered",
  },
  CONTACT_REGISTERED: {
    icon: mdiAccountPlus,
    getText: () => "Contact registered",
  },
  WRITE_ACCESS_ALLOWED: {
    icon: mdiCogOutline,
    getText: () => "Write access allowed",
  },
  CONNECTED_WEBSITE: {
    icon: mdiWeb,
    getText: () => "Website connected",
  },

  // Chat customization
  CHAT_SET_BACKGROUND: {
    icon: mdiPaletteOutline,
    getText: () => "Chat background changed",
  },
  CHAT_SET_THEME: {
    icon: mdiPaletteOutline,
    getText: () => "Chat theme changed",
  },

  // Boosts & Features
  CHAT_BOOST: {
    icon: mdiRocketLaunchOutline,
    getText: () => "Chat boosted",
  },

  // Sharing
  USERS_SHARED: {
    icon: mdiAccountGroup,
    getText: () => "Users shared",
  },
  CHAT_SHARED: {
    icon: mdiShare,
    getText: () => "Chat shared",
  },

  // Posts
  SUGGESTED_POST_APPROVAL_FAILED: {
    icon: mdiHelpCircleOutline,
    getText: () => "Post approval failed",
  },
  SUGGESTED_POST_APPROVED: {
    icon: mdiCheckboxMarkedCircleOutline,
    getText: () => "Post approved",
  },
  SUGGESTED_POST_DECLINED: {
    icon: mdiHelpCircleOutline,
    getText: () => "Post declined",
  },
  SUGGESTED_POST_PAID: {
    icon: mdiCreditCard,
    getText: () => "Post paid",
  },
  SUGGESTED_POST_REFUNDED: {
    icon: mdiCreditCard,
    getText: () => "Post refunded",
  },

  // Profile suggestions
  SUGGEST_PROFILE_PHOTO: {
    icon: mdiImageOutline,
    getText: () => "Profile photo suggested",
  },
  SUGGEST_BIRTHDAY: {
    icon: mdiGiftOutline,
    getText: () => "Birthday suggestion",
  },

  // Checklists
  CHECKLIST_TASKS_DONE: {
    icon: mdiCheckboxMarkedCircleOutline,
    getText: () => "Checklist tasks completed",
  },
  CHECKLIST_TASKS_ADDED: {
    icon: mdiCheckboxMarkedCircleOutline,
    getText: () => "Checklist tasks added",
  },

  // Web app
  WEB_APP_DATA: {
    icon: mdiWeb,
    getText: () => "Web app data received",
  },

  // Fallbacks
  CUSTOM_ACTION: {
    icon: mdiCogOutline,
    getText: () => "Custom action performed",
  },
  UNSUPPORTED: {
    icon: mdiHelpCircleOutline,
    getText: () => "Unsupported service message",
  },
};

export const MessageServiceInfo = ({
  service_info,
}: MessageServiceInfoProps) => {
  if (!service_info || !service_info.service_type) {
    return null;
  }

  const variant = serviceInfoVariants[service_info.service_type];

  if (!variant) {
    return null;
  }

  const renderUserList = (users: UserRef[]) => {
    if (!users || users.length === 0) return null;

    return (
      <>
        {users.map((user, index) => (
          <span key={user.id}>
            <UserLink user={user} />
            {index < users.length - 1 && ", "}
          </span>
        ))}{" "}
      </>
    );
  };

  return (
    <div className="flex items-center rounded-b bg-gray-100 p-2 text-sm text-gray-600">
      <Icon path={variant.icon} size={0.6} className="mr-1 text-gray-500" />

      {/* Special handling for user-related actions that need UserLink components */}
      {service_info.service_type === "NEW_CHAT_MEMBERS" &&
      service_info.new_chat_members ? (
        <span>
          {renderUserList(service_info.new_chat_members)}
          {variant.getText(service_info)}
        </span>
      ) : service_info.service_type === "LEFT_CHAT_MEMBER" &&
        service_info.left_chat_member ? (
        <span>
          <UserLink user={service_info.left_chat_member} />{" "}
          {variant.getText(service_info)}
        </span>
      ) : (
        <span>{variant.getText(service_info)}</span>
      )}
    </div>
  );
};
