
import csv
import json
import sys

input_file = 'attached_assets/인천_1764738860536.csv'
output_file = 'client/src/pages/institutions/incheon_data.json'

data = []

try:
    with open(input_file, 'r', encoding='cp949') as f:
        reader = csv.reader(f)
        header = next(reader) # Skip header
        
        for row in reader:
            if not row or len(row) < 5:
                continue
            
            try:
                id_val = int(row[0])
            except ValueError:
                continue
                
            region = row[1].strip()
            if "인천" not in region:
                continue
                
            # Filter out empty rows that just have region
            if not row[4].strip():
                continue

            # Extract detail region
            address = row[5].strip()
            detail_region = "인천"
            if "인천광역시" in address:
                parts = address.split(" ")
                if len(parts) > 1:
                    detail_region = f"인천 {parts[1]}"
            
            institution = {
                "id": 16000 + id_val, # Offset ID for Incheon (16000+)
                "name": row[4].strip(),
                "region": "인천광역시",
                "detail_region": detail_region,
                "category": row[3].strip() if row[3].strip() else "기타",
                "address": address,
                "phone": row[6].strip(),
                "tags": ["공공", row[3].strip()] if row[3].strip() else ["공공"],
                "status": "운영중",
                "homepage": row[7].strip()
            }
            
            data.append(institution)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully processed {len(data)} Incheon institutions.")

except Exception as e:
    print(f"Error: {e}")
