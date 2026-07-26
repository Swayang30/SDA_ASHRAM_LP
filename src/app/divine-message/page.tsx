import type { Metadata } from "next";
import DivineMessagePage from "@/components/sections/DivineMessagePage";

export const metadata: Metadata = {
  title: "The Divine Message",
  description:
    "A featured message from Gurudev, quick links to key pages, and the latest image of Swami Debananda Maharaj.",
};

export default function Page() {
  return <DivineMessagePage />;
}
