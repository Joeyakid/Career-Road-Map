import { careerPathById, careerPaths } from "@/data/careers/mock-careers";
import type { CareerPath, CareerSummary } from "@/types/career";

export type { CareerSummary } from "@/types/career";

export class MockCareerRepository {
  async list(): Promise<CareerSummary[]> {
    return careerPaths.map(({ id, title, difficulty, estimatedDuration, shortDescription }) => ({
      id,
      title,
      difficulty,
      estimatedDuration,
      shortDescription,
    }));
  }

  async getById(id: string): Promise<CareerPath | null> {
    return careerPathById.get(id) ?? null;
  }

  async getAll(): Promise<CareerPath[]> {
    return [...careerPaths];
  }
}

export const careerRepository = new MockCareerRepository();

export const listCareers = () => careerRepository.list();
export const getCareerById = (id: string) => careerRepository.getById(id);
export const getAllCareers = () => careerRepository.getAll();
