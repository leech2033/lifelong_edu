
import csv
import json
import sys

input_file = 'attached_assets/대구_1764738544351.csv'
output_file = 'client/src/pages/institutions/daegu_data.json'

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
            if "대구" not in region:
                continue
                
            # Filter out empty rows that just have region
            if not row[4].strip():
                continue

            # Extract detail region (District) from address or default to Daegu
            address = row[5].strip()
            detail_region = "대구"
            if "대구광역시" in address:
                parts = address.split(" ")
                if len(parts) > 1:
                    detail_region = f"대구 {parts[1]}" # e.g., 대구 중구
            
            institution = {
                "id": 18000 + id_val, # Offset ID for Daegu (Changed to 18000 to avoid collision with Seoul 14000+)
                "name": row[4].strip(),
                "region": "대구광역시",
                "detail_region": detail_region,
                "category": row[3].strip() if row[3].strip() else "기타",
                "address": address,
                "phone": row[6].strip(),
                "tags": ["공공", row[3].strip()] if row[3].strip() else ["공공"],
                "status": "운영중", # Defaulting to active for prototype
                "homepage": row[7].strip()
            }
            
            data.append(institution)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully processed {len(data)} Daegu institutions.")

except Exception as e:
    print(f"Error: {e}")
