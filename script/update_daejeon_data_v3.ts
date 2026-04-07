
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual text content from user message since it wasn't attached as a file
const textContent = `행복한우리복지관이미지수2
행복한우리복지관장애인복지시설
운영 중18:00에 운영 종료
현재 위치에서79km
대전 서구 도안동
상세주소 열기
출발도착
건양사이버대학교
이미지수28
건양사이버대학교톡톡사이버대학
운영 중12:00에 휴게시간
현재 위치에서79km
대전 서구 관저동
상세주소 열기
출발도착예약
채움교육연구소
이미지수2
채움교육연구소연구,연구소
현재 위치에서77km
대전 서구 변동
상세주소 열기
출발도착
대전시립중고등학교
이미지수8
대전시립중고등학교고등학교
현재 위치에서78km
대전 동구 자양동
상세주소 열기
출발도착
한마음야학
이미지수11
한마음야학야학
운영 중22:00에 운영 종료
현재 위치에서78km
대전 중구 대사동
상세주소 열기
출발도착
건양사이버대학교 대전학습관이미지수8
건양사이버대학교 대전학습관사이버대학
운영 중12:00에 휴게시간
현재 위치에서79km
대전 서구 관저동
상세주소 열기
출발도착
디딤돌작은도서관이미지수5
디딤돌작은도서관도서관
운영 중16:00에 운영 종료
현재 위치에서80km
대전 서구 가수원동
상세주소 열기
출발도착
청춘학교이미지수68
청춘학교야학
운영 중12:00에 휴게시간
현재 위치에서78km
대전 중구 대흥동
상세주소 열기
출발도착
한밭향토학교이미지수16
한밭향토학교야학
운영 중12:00에 휴게시간
현재 위치에서78km
대전 중구 대흥동
상세주소 열기
출발도착
생존컴퍼니이미지수2
생존컴퍼니인터넷신문
영업 중18:00에 영업 종료
현재 위치에서76km
대전 서구 괴정동
상세주소 열기
출발도착
충청남도 대전학사관
충청남도 대전학사관기숙사
24시간 운영
현재 위치에서78km
대전 중구 선화동
상세주소 열기
휠체어 출입 가능
출발도착
이전페이지123다음페이지`;

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
          prevLine === "이미지수" || // Sometimes it's on its own line
          prevLine.startsWith("이미지수") ||
          prevLine.match(/^\d+km$/)) {
        nameIdx--;
        continue;
      }
      if (prevLine === "출발도착" || prevLine === "상세주소 열기") break;
      
      let name = prevLine.replace(/이미지수\d+$/, "").trim();
      name = name.replace(/네이버페이.*$/, "").trim();
      name = name.replace(/톡톡.*$/, "").trim();
      
      // If name is empty or seems invalid (too short, just numbers), try line before
      if (name.length < 2) {
         nameIdx--;
         continue;
      }

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
         else if (name.includes("학교")) category = "학교/대학"; // Includes 야학, 중고등학교
         else if (name.includes("도서관")) category = "도서관";
         else if (name.includes("연구소")) category = "교육연구소";
         else if (name.includes("학사관")) category = "기숙사/생활관";
         else if (name.includes("협회")) category = "협회/단체";
         else if (name.includes("평생교육원")) category = "평생교육원";

         // Specific fix for "야학"
         if (name.includes("야학")) category = "야학";

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
console.log(`Updated Daejeon data with 3rd batch. Added: ${addedCount}, Total: ${existingData.length}`);
