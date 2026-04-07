
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(process.cwd(), 'client/src/pages/institutions/daejeon_data.json');

try {
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
  let institutions = JSON.parse(jsonContent);
  
  const initialLength = institutions.length;
  institutions = institutions.filter((inst: any) => inst.name !== "세이백화점 문화센터");
  
  if (institutions.length < initialLength) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(institutions, null, 2), 'utf-8');
    console.log(`Successfully removed "세이백화점 문화센터". Count: ${initialLength} -> ${institutions.length}`);
  } else {
    console.log('Institution "세이백화점 문화센터" not found.');
  }
} catch (error) {
  console.error('Error updating JSON:', error);
  process.exit(1);
}
