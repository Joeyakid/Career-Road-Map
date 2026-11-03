import { notFound } from "next/navigation";
import CareerRoadmap from "@/components/careers/career-roadmap";
import { careerPathById } from "@/data/careers/mock-careers";

export default async function CareerRoadmapPage({ params }: { params: Promise<{ careerId: string }> }) {
  const { careerId } = await params;
  const career = careerPathById.get(careerId);
  if (!career) notFound();
  return <CareerRoadmap career={career}/>;
}