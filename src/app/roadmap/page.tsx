import { redirect } from "next/navigation";

/** Compatibility route while the existing plural `/roadmaps` experience remains canonical. */
export default function RoadmapPage() {
  redirect("/roadmaps");
}
