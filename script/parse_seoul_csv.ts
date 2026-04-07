
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(process.cwd(), 'temp_seoul.csv');
const outputFilePath = path.join(process.cwd(), 'parsed_seoul_data.json');

// ID Offset for Seoul
const ID_OFFSET = 14000;

function parseCSV(csvText: string) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const results = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV parsing with potential commas in quotes (though simple split might suffice for this specific file based on cat output)
    // The cat output shows quotes around some fields like "종로1, 2, 3, 4가동 주민센터".
    // Simple split by comma will break on these.
    // Let's implement a basic regex CSV parser or just handle the quotes.
    
    const row: string[] = [];
    let currentVal = '';
    let inQuote = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        row.push(currentVal.trim());
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    row.push(currentVal.trim()); // Last field

    if (row.length < 5) continue; // Skip invalid rows

    const id = parseInt(row[0]) + ID_OFFSET;
    const name = row[4]; // 기관명
    const address = row[5]; // 주소(도로명)
    const phone = row[6]; // 대표전화
    const type = row[2]; // 기관유형 (공공/민간)
    const category = row[3]; // 기관분류
    
    // Extract detail_region (Gu) from address
    // Address format: 서울특별시 [Gu] ...
    let detail_region = "서울 기타";
    if (address.startsWith("서울특별시")) {
       const parts = address.split(' ');
       if (parts.length >= 2) {
         detail_region = `서울 ${parts[1]}`;
       }
    } else if (address.startsWith("울특별시")) { // Typo handling seen in line 27 of cat output "울특별시 중구..."
       const parts = address.split(' ');
       if (parts.length >= 2) {
         detail_region = `서울 ${parts[1]}`;
       }
    }

    // Clean up category if empty
    const cleanCategory = category || "기타";

    const institution = {
      id,
      name: name.replace(/"/g, ''),
      region: "서울특별시",
      detail_region,
      category: cleanCategory,
      address: address.replace(/"/g, ''),
      phone: phone || "02-0000-0000",
      tags: [type === "공공" ? "공공" : "민간", cleanCategory],
      status: "운영중"
    };

    results.push(institution);
  }

  return results;
}

try {
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const parsedData = parseCSV(csvContent);
  
  fs.writeFileSync(outputFilePath, JSON.stringify(parsedData, null, 2), 'utf-8');
  console.log(`Successfully parsed ${parsedData.length} institutions from Seoul CSV.`);
} catch (error) {
  console.error('Error parsing CSV:', error);
}
