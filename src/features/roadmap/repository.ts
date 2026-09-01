import type { LearningStatus } from "@/types/domain";

export type RoadmapNode = { id: string; title: string; status: LearningStatus; progress: number };

export interface RoadmapRepository {
  getForCareer(careerId: string): Promise<RoadmapNode[]>;
}
