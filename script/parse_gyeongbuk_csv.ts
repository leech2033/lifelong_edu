import fs from 'fs';
import path from 'path';

const csvFilePath = path.join(process.cwd(), 'temp_gyeongbuk.csv');
const outputFilePath = path.join(process.cwd(), 'parsed_gyeongbuk_data.json');

const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
const lines = fileContent.split('\n');
const headers = lines[0].split(',');

const institutions: any[] = [];
let startId = 10002; // Starting ID for Gyeongbuk

// Skip header
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Handle CSV parsing properly (including quotes)
  const columns: string[] = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      columns.push(currentVal.trim());
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  columns.push(currentVal.trim());

  // Columns: 
  // 0: 번호, 1: 강좌지역, 2: 기관유형, 3: 기관분류, 4: 기관명, 5: 주소(도로명), 6: 대표전화, 7: 홈페이지, 8: 상태, 9: 비고
  
  if (columns.length < 5) continue;

  const name = columns[4];
  const address = columns[5];
  const phone = columns[6];
  const category = columns[3];
  const detailRegion = address ? address.split(' ').slice(0, 2).join(' ') : '경북';

  // Skip if crucial data is missing
  if (!name) continue;

  institutions.push({
    id: startId++,
    name: name.replace(/"/g, ''),
    region: "경상북도",
    detail_region: detailRegion.replace(/"/g, ''),
    category: category ? category.replace(/"/g, '') : "기타",
    address: address ? address.replace(/"/g, '') : "",
    phone: phone ? phone.replace(/"/g, '') : "",
    tags: ["공공", category ? category.replace(/"/g, '') : "기타"],
    status: "운영중"
  });
}

// Filter to a reasonable number if too many (e.g., top 50 for mockup)
// Or just take all since the user wants "Gyeongbuk data"
// Let's take top 50 for now to keep file size manageable in index.tsx, 
// unless I decide to move data to a separate file.
// The user said "add Gyeongbuk data", implying they want to see it.
// I'll take the first 20 to match other regions roughly, or maybe 50.
// The file has 1000 lines. Inserting 1000 lines into index.tsx is bad practice.
// I'll create a separate file `client/src/data/gyeongbuk_data.ts` and import it.

const selectedInstitutions = institutions.slice(0, 30);

console.log(JSON.stringify(selectedInstitutions, null, 2));
