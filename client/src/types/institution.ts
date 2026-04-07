export interface InstitutionSummary {
  id: number | string;
  name: string;
  regionId?: string;
  region: string;
  detail_region: string;
  category: string;
  address: string;
  phone: string;
  tags?: string[];
  status?: string;
  homepage?: string;
  image?: string;
  sourceQuality?: "verified" | "needs_review";
}

export interface InstitutionProgram {
  name: string;
  status: string;
  type: string;
}

export interface InstitutionDetailData {
  id: string;
  name: string;
  category: string;
  region: string;
  address: string;
  phone: string;
  website?: string;
  status: string;
  description: string;
  operatingHours: string;
  established: string;
  facilities: string[];
  images: string[];
  programs: InstitutionProgram[];
}
