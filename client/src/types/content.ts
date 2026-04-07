export interface OnlineLecture {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  platform: string;
  videoUrl: string;
  thumbnailUrl: string;
  helpfulFor: string;
}

export interface LocalProgram {
  id: string;
  region: string;
  organizationName: string;
  programName: string;
  description: string;
  target: string;
  schedule: string;
  operationType: string;
  applicationMethod: string;
  homepageUrl?: string;
  address?: string;
}
