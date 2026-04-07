import { localPrograms } from "@/data/localPrograms";
import { onlineLectures } from "@/data/onlineLectures";

export function getOnlineLectureById(id?: string) {
  return onlineLectures.find((lecture) => lecture.id === id);
}

export function getRelatedOnlineLectures(id: string, category: string, limit = 3) {
  return onlineLectures
    .filter((lecture) => lecture.category === category && lecture.id !== id)
    .slice(0, limit);
}

export function getLocalProgramById(id?: string) {
  return localPrograms.find((program) => program.id === id);
}

export function getSiblingLocalPrograms(programId: string, organizationName: string, limit = 3) {
  return localPrograms
    .filter(
      (program) => program.organizationName === organizationName && program.id !== programId,
    )
    .slice(0, limit);
}
