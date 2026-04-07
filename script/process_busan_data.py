
import csv
import json
import sys

input_file = 'attached_assets/부산_1764738362923.csv'
output_file = 'client/src/pages/institutions/busan_data.json'

data = []

try:
    with open(input_file, 'r', encoding='cp949') as f:
        reader = csv.reader(f)
        for row in reader:
            if not row or len(row) < 5:
                continue
            
            # Skip header if exists (heuristic: check if first col is not a number)
            # But looking at the output, first col is ID.
            # Let's check if row[0] is an integer.
            
            try:
                id_val = int(row[0])
            except ValueError:
                # Maybe header or continuation line
                continue
                
            region = row[1].strip()
            if "부산" not in region:
                continue
                
            # Filter out empty rows that just have region
            if not row[4].strip():
                continue

            institution = {
                "id": 12000 + id_val, # Offset ID to avoid collision, Busan starts at 12000 range
                "name": row[4].strip(),
                "region": "부산광역시",
                "detail_region": row[5].split(" ")[1] if len(row[5].split(" ")) > 1 else "부산", # Extract district from address
                "category": row[3].strip() if row[3].strip() else "기타",
                "address": row[5].strip(),
                "phone": row[6].strip(),
                "tags": ["공공", row[3].strip()] if row[3].strip() else ["공공"],
                "status": "운영중"
            }
            
            # Clean detail_region
            if "부산광역시" in institution["detail_region"]:
                 # If address is like "부산광역시 북구 ...", split[1] is 북구. Correct.
                 pass
            else:
                 # Sometimes address might be just "부산 ..."
                 pass

            data.append(institution)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully processed {len(data)} institutions.")

except Exception as e:
    print(f"Error: {e}")
