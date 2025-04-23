import React from "react";

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen pt-16">
      {children}
    </div>
  );
}
