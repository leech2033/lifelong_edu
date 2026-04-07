
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(process.cwd(), 'client/src/pages/institutions/daejeon_data.json');

const imageMapping: Record<string, string> = {
  "대전평생교육진흥원": "modern_education_cen_01a00e8a.jpg",
  "대전평생학습관": "lifelong_learning_ce_b321eba0.jpg",
  "대전광역시 동구 평생학습관": "community_education__ad3ab222.jpg",
  "대전광역시 중구 평생학습관": "modern_public_librar_a1562332.jpg",
  "대전광역시 서구 평생학습관": "community_center_bui_e16029f8.jpg",
  "유성구 평생학습센터": "science_museum_exter_36a7f529.jpg",
  "대덕구 평생학습센터": "art_center_building__ac59cc7f.jpg",
  "충남대학교 평생교육원": "university_campus_bu_cddda96a.jpg",
  "한밭대학교 평생교육원": "university_education_78d017b2.jpg"
};

try {
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
  let institutions = JSON.parse(jsonContent);
  
  let updatedCount = 0;
  institutions = institutions.map((inst: any) => {
    if (imageMapping[inst.name]) {
      inst.image = `/attached_assets/stock_images/${imageMapping[inst.name]}`;
      updatedCount++;
    }
    return inst;
  });
  
  fs.writeFileSync(jsonFilePath, JSON.stringify(institutions, null, 2), 'utf-8');
  console.log(`Successfully updated images for ${updatedCount} institutions.`);
} catch (error) {
  console.error('Error updating JSON:', error);
  process.exit(1);
}
