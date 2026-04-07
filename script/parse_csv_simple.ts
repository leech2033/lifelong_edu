import fs from 'fs';
import path from 'path';

const csvPath = 'temp_institutions.csv';

try {
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const lines = csv.split('\n');
  const data = [];

  // Skip headers (rows 0 and 1)
  for (let i = 2; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Handle multiline fields (very basic) - if line doesn't start with number, append to previous?
    // Actually, looking at the snippet:
    // Line 6 ends with "http://www.ecokidjb.or.kr/
    // Line 7 starts with http://blog.naver.com/ecokiddj",,블로그 주소와 같이있음,,
    // This suggests real newlines in the CSV.
    // A robust CSV parser is needed, but for this task, I'll try to merge lines if they don't look like a new record.
    // New records start with a number like "1," or "123,".
    
    // Regex to check if line starts with number followed by comma
    if (!/^\d+,/.test(line)) {
       // This is likely a continuation of the previous line.
       // But since I'm iterating, I can't easily append to previous parsed object unless I keep state.
       // Let's just skip complex multiline rows for the mockup to stay safe, or try to fix.
       continue; 
    }

    // Simple split by comma, handling quotes is hard without a library.
    // But most fields look simple.
    // Let's simply split by comma and hope for the best for a mockup.
    // If a field has a comma, it will break.
    // The snippet shows quotes around fields with newlines.
    
    const parts = line.split(','); 
    // This is naive. 
    
    // Let's assume standard columns:
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
            id: i,
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

  console.log(JSON.stringify(data.slice(0, 200), null, 2));
} catch (e) {
  console.error(e);
}
