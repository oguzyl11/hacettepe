"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MapPin, MessageSquare, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "specs" | "delivery" | "messages";

export function DetailTabs({
  specsLabel,
  deliveryLabel,
  messagesLabel,
  messageCount,
  specs,
  delivery,
  messages,
}: {
  specsLabel: string;
  deliveryLabel: string;
  messagesLabel: string;
  messageCount: number;
  specs: ReactNode;
  delivery: ReactNode;
  messages: ReactNode;
}) {
  const [tab, setTab] = useState<TabId>("specs");

  useEffect(() => {
    const open = () => setTab("messages");
    window.addEventListener("tepeli-messages", open);
    return () => window.removeEventListener("tepeli-messages", open);
  }, []);

  const tabs: { id: TabId; label: string; icon: typeof SlidersHorizontal; count?: number }[] = [
    { id: "specs", label: specsLabel, icon: SlidersHorizontal },
    { id: "delivery", label: deliveryLabel, icon: MapPin },
    { id: "messages", label: messagesLabel, icon: MessageSquare, count: messageCount },
  ];

  return (
    <div id="mesajlar" className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex gap-2 overflow-x-auto bg-[#eff4ff] px-3 pt-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-semibold",
              tab === item.id ? "bg-white text-[#760009] shadow-sm" : "text-[#59413e]",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
            {item.count !== undefined ? (
              <span className="rounded-full bg-[#760009] px-1.5 text-[11px] text-white">{item.count}</span>
            ) : null}
          </button>
        ))}
      </div>
      <div className="p-5 sm:p-8">
        {tab === "specs" ? specs : null}
        {tab === "delivery" ? delivery : null}
        {tab === "messages" ? messages : null}
      </div>
    </div>
  );
}

export function OfferButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event("tepeli-messages"));
        document.getElementById("mesajlar")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#991b1b] text-sm font-bold text-white shadow-md transition-colors hover:bg-[#760009]"
    >
      {label}
    </button>
  );
}
