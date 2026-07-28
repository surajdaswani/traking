import * as RadixCollapsible from "@radix-ui/react-collapsible";
import type { ReactNode } from "react";

export function Collapsible({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <RadixCollapsible.Root defaultOpen>
      <RadixCollapsible.Trigger asChild>
        <button>{title}</button>
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content>{children}</RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
}
