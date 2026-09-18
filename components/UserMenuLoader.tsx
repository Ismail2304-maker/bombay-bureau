"use client";

import dynamic from "next/dynamic";

const UserMenu = dynamic(() => import("@/components/UserMenu"), {
  ssr: false,
  loading: () => (
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 animate-pulse" />
  ),
});

export default function UserMenuLoader() {
  return <UserMenu />;
}
