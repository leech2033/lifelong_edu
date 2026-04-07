
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const textFilePath = path.join(process.cwd(), 'attached_assets/Pasted--4-18-00-75km--1764728209335_1764728209336.txt');
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

// Helper to clean string
const clean = (str) => str?.trim() || "";

for (let i = 0; i < lines.length; i++) {
  const line = clean(lines[i]);
  if (!line) continue;

  // Address detection
  if (line.startsWith("대전 ") && (line.includes("구 ") || line.includes("군 "))) {
    
    let nameIdx = i - 1;
    while (nameIdx >= 0) {
      const prevLine = clean(lines[nameIdx]);
      if (prevLine.includes("현재 위치에서") || 
          prevLine.includes("운영 중") || 
          prevLine.includes("영업 중") ||
          prevLine.includes("광고") || 
          prevLine.includes("오늘 휴무") ||
          prevLine.includes("24시간") ||
          prevLine === "출발도착" || 
          prevLine === "상세주소 열기" ||
          prevLine === "예약" ||
          prevLine === "네이버페이" ||
          prevLine.match(/^\d+km$/)) {
        nameIdx--;
        continue;
      }
      if (prevLine === "출발도착" || prevLine === "상세주소 열기") break;
      
      let name = prevLine.replace(/이미지수\d+$/, "").trim();
      name = name.replace(/네이버페이.*$/, "").trim();
      name = name.replace(/톡톡.*$/, "").trim();
      
      const address = line;
      let detail_region = "대전 기타";
      const parts = address.split(' ');
      if (parts.length >= 2) {
        detail_region = `대전 ${parts[1]}`;
      }

      // Avoid duplicates in new list
      if (!newInstitutions.find(inst => inst.name === name)) {
         // Determine category based on name
         let category = "민간";
         if (name.includes("복지")) category = "복지기관";
         else if (name.includes("학교")) category = "학교/대학";
         else if (name.includes("협회")) category = "협회/단체";
         else if (name.includes("평생교육원")) category = "평생교육원";

         newInstitutions.push({
           name: name,
           address: address,
           detail_region: detail_region,
           category: category,
           phone: "",
           status: "운영중"
         });
      }
      break; 
    }
  }
}

// Merge with existing data
let maxId = existingData.reduce((max, item) => item.id > max ? item.id : max, 0);
let addedCount = 0;

newInstitutions.forEach(newInst => {
  // Check if name exists in existingData
  const exists = existingData.find(existing => 
    existing.name.replace(/\s/g, '') === newInst.name.replace(/\s/g, '') ||
    existing.name.includes(newInst.name) ||
    newInst.name.includes(existing.name)
  );

  if (!exists) {
    maxId++;
    addedCount++;
    existingData.push({
      id: maxId,
      name: newInst.name,
      region: "대전광역시",
      detail_region: newInst.detail_region,
      category: newInst.category,
      address: newInst.address,
      phone: "042-000-0000", // Placeholder
      tags: ["민간", newInst.category],
      status: "운영중"
    });
  }
});

// Write back
fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2), 'utf-8');
console.log(`Updated Daejeon data with new batch. Added: ${addedCount}, Total: ${existingData.length}`);
