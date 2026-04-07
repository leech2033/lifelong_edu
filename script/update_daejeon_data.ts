
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const textFilePath = path.join(process.cwd(), 'attached_assets/Pasted--PT-26-PT-PT-24--1764727920354_1764727920355.txt');
const jsonFilePath = path.join(process.cwd(), 'client/src/pages/institutions/daejeon_data.json');

// Read existing data
let existingData = [];
try {
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
  existingData = JSON.parse(jsonContent);
} catch (error) {
  console.error('Error reading existing JSON:', error);
  process.exit(1);
}

// Read text file
let textContent = "";
try {
  textContent = fs.readFileSync(textFilePath, 'utf-8');
} catch (error) {
  console.error('Error reading text file:', error);
  process.exit(1);
}

// Parse text file
const lines = textContent.split('\n');
const newInstitutions = [];
let currentInstitution = {};

// Helper to clean string
const clean = (str) => str?.trim() || "";

// The text file has a pattern. It seems to be blocks of text.
// We need to iterate and identify blocks.
// A block usually starts with a name.
// Let's try to parse based on the visual structure from the cat output.
// It seems like:
// Name + extra info (Image count, Naver Pay etc)
// Category (sometimes on same line or next)
// Status (Operating, hours)
// Distance
// Address (Daejeon [Gu] [Dong])
// Buttons (Open detail, etc)

// We can look for lines containing "대전 " to find addresses, and the lines before it might contain name/category.

for (let i = 0; i < lines.length; i++) {
  const line = clean(lines[i]);
  if (!line) continue;

  // Address detection
  if (line.startsWith("대전 ") && (line.includes("구 ") || line.includes("군 "))) {
    // Found an address line.
    // The name should be in the previous lines.
    // Let's look back 1-5 lines to find a likely name.
    
    let nameIdx = i - 1;
    // Skip lines that look like "Current location...", "Operating...", "Advertisement", "Image count..."
    while (nameIdx >= 0) {
      const prevLine = clean(lines[nameIdx]);
      if (prevLine.includes("현재 위치에서") || 
          prevLine.includes("운영 중") || 
          prevLine.includes("영업 중") ||
          prevLine.includes("광고") || 
          prevLine.includes("오늘 휴무") ||
          prevLine === "출발도착" || 
          prevLine === "상세주소 열기" ||
          prevLine === "예약" ||
          prevLine === "네이버페이" ||
          prevLine.match(/^\d+km$/)) {
        nameIdx--;
        continue;
      }
      // If we hit a line that looks like a button or end of previous block, stop.
      if (prevLine === "출발도착" || prevLine === "상세주소 열기") break;
      
      // Found a candidate name line.
      // Sometimes name line has "이미지수" at the end.
      let name = prevLine.replace(/이미지수\d+$/, "").trim();
      // Remove "네이버페이톡톡쿠폰" etc
      name = name.replace(/네이버페이.*$/, "").trim();
      name = name.replace(/톡톡.*$/, "").trim();
      
      // Category might be on the same line or next line
      // But for simplicity, let's just take the name.
      
      // Extract Gu from address
      const address = line;
      let detail_region = "대전 기타";
      const parts = address.split(' ');
      if (parts.length >= 2) {
        detail_region = `대전 ${parts[1]}`;
      }

      // Avoid duplicates in new list
      if (!newInstitutions.find(inst => inst.name === name)) {
         newInstitutions.push({
           name: name,
           address: address,
           detail_region: detail_region,
           category: "민간", // Default to private for this list as it looks like search results
           phone: "", // Phone not in text file
           status: "운영중"
         });
      }
      break; // Found address, processed this block
    }
  }
}

// Merge with existing data
// Filter out duplicates based on name (fuzzy match or exact)
let maxId = existingData.reduce((max, item) => item.id > max ? item.id : max, 0);

newInstitutions.forEach(newInst => {
  // Check if name exists in existingData
  const exists = existingData.find(existing => 
    existing.name.replace(/\s/g, '') === newInst.name.replace(/\s/g, '') ||
    existing.name.includes(newInst.name) ||
    newInst.name.includes(existing.name)
  );

  if (!exists) {
    maxId++;
    existingData.push({
      id: maxId,
      name: newInst.name,
      region: "대전광역시",
      detail_region: newInst.detail_region,
      category: newInst.name.includes("평생교육원") ? "평생교육원" : "민간",
      address: newInst.address,
      phone: "042-000-0000", // Placeholder
      tags: ["민간", newInst.name.includes("필라테스") ? "체육" : "평생교육"],
      status: "운영중"
    });
  }
});

// Write back
fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2), 'utf-8');
console.log(`Updated Daejeon data. Total institutions: ${existingData.length}`);
