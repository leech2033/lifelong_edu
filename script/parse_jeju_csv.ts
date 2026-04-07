import fs from 'fs';
import path from 'path';

const jejuCsvPath = 'temp_jeju.csv';

try {
  const csv = fs.readFileSync(jejuCsvPath, 'utf-8');
  const lines = csv.split('\n');
  const data = [];

  // Skip headers (rows 0 and 1) - assuming similar format to previous CSV
  // Let's check the first few lines to be sure about the format
  // console.log(lines.slice(0, 5));

  for (let i = 2; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Skip lines that don't look like data rows (e.g., starting with a number)
    if (!/^\d+,/.test(line)) {
       continue; 
    }

    // Naive split by comma
    const parts = line.split(','); 
    
    // Assuming similar columns based on previous file structure:
    // 0: No
    // 1: Region
    // 2: Type
    // 3: Category
    // 4: Name
    // 5: Address
    // 6: Phone
    // 7: Website
    // 8: Status
    // 9: Note

    const region = parts[1];
    const type = parts[2];
    const category = parts[3];
    const name = parts[4];
    const address = parts[5];
    const phone = parts[6];
    const status = parts[8];
    const note = parts[9];

    // Filter inactive
    if (status && (status.includes('미운영') || status.includes('폐쇄'))) continue;
    if (note && (note.includes('폐쇄') || note.includes('미운영'))) continue;

    if (name && region && address) {
        data.push({
            id: i + 2000, // Offset ID to avoid collision with Daejeon data
            name: name.replace(/"/g, '').trim(),
            region: region.trim(),
            category: category ? category.trim() : '',
            address: address.trim(),
            phone: phone ? phone.trim() : '',
            tags: [type, category].filter(Boolean).map(s => s.replace(/"/g, '').trim()),
            status: "운영중"
        });
    }
  }

  console.log(JSON.stringify(data.slice(0, 100), null, 2));
} catch (e) {
  console.error(e);
}
