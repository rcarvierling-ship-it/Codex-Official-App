import React from "react";

import DemoShell from "./_components/DemoShell";

export const metadata = {
  title: "The Official App Demo • 🏀",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DemoShell>{children}</DemoShell>;
}
