import { mdiAlertCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";

export function PageError() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Icon path={mdiAlertCircleOutline} size={5} className="text-red-500" />
      <span className="font-medium">Authentication Error</span>
    </div>
  );
}
