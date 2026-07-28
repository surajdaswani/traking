import * as RadixCollapsible from "@radix-ui/react-collapsible";
import type { ReactNode } from "react";
import styles from "./Collapsible.module.css";

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
        <button className={styles.trigger}>{title}</button>
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content className={styles.content}>
        {children}
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
}
