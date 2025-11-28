import * as React from "react";

import { Dialog } from "components/Elements";

import { useDisclosure } from "hooks/useDisclosure";

export type DisclosureDialogProps = {
  triggerButton: (open: () => void) => React.ReactElement;
  title: string;
  children: (disclosure: ReturnType<typeof useDisclosure>) => React.ReactNode;
};

export const DisclosureDialog = ({
  triggerButton,
  title,
  children,
}: DisclosureDialogProps) => {
  const disclosure = useDisclosure();
  const { close, open, isOpen } = disclosure;

  return (
    <>
      {triggerButton(open)}
      <Dialog isOpen={isOpen} onClose={close} title={title}>
        {children(disclosure)}
      </Dialog>
    </>
  );
};
