
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(process.cwd(), 'client/src/pages/institutions/daejeon_data.json');
const newImage = "/attached_assets/image_1764733793153.png";
const targetName = "대전평생교육진흥원";

try {
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
  let institutions = JSON.parse(jsonContent);
  
  let updated = false;
  institutions = institutions.map((inst: any) => {
    if (inst.name === targetName) {
      inst.image = newImage;
      updated = true;
    }
    return inst;
  });
  
  if (updated) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(institutions, null, 2), 'utf-8');
    console.log(`Successfully updated image for "${targetName}".`);
  } else {
    console.log(`Institution "${targetName}" not found.`);
  }
} catch (error) {
  console.error('Error updating JSON:', error);
  process.exit(1);
}
