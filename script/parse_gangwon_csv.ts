import fs from 'fs';

const csvPath = 'temp_gangwon.csv';

try {
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const lines = csv.split('\n');
  const data = [];

  for (let i = 2; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    if (!/^\d+,/.test(line)) continue;

    const parts = line.split(','); 
    
    // Columns:
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

    if (status && (status.includes('미운영') || status.includes('폐쇄'))) continue;
    if (note && (note.includes('폐쇄') || note.includes('미운영'))) continue;

    if (name && region && address) {
        data.push({
            id: i + 4000, // Offset ID for Gangwon
            name: name.replace(/"/g, '').trim(),
            region: "강원특별자치도", // Normalize region name
            detail_region: region.trim(),
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
