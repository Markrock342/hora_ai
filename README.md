# NewHora — Thai Astrology Prototype

ดูข้อกำหนดถาวร: **[REQUIREMENTS.md](./REQUIREMENTS.md)**

ดูข้อกำหนด: **[REQUIREMENTS.md](./REQUIREMENTS.md)**



## วิธีรัน


## สรุป requirement
```bash

npm install
**ระบบคำนวณ (คงที่):** สุริยยาตร์ · ลาหิรี · อันโตนาทีสามัญ สมผุสอาทิตย์อุทัย ปรับเวลาท้องถิ่น · ราหู ๘ ราศีกุมภ์ · ทักษา ราหู=พุธกลางคืน · ทักษานับตากลาง
npm run dev
**Output:** ตารางเดียว — **ดาว** | **สถิตราศี**
## สรุป (เฟส prototype)



src/data/calculationSettings.ts  — ระบบคำนวณคงที่
src/utils/astrologyCalculator.ts — mock → สูตรจริง
REQUIREMENTS.md                  — บันทึก requirement
**Output:** 3 ตาราง × 25 แถว = 75 แถว (mock)


1. ดาว — สถิตราศี เรือน องศา

2. ทักษา — เจ้าทักษา สถิตราศี

3. ราศี/ภพ/เรือน — ราศี ดาวในภพ



**ระบบคำนวณ (คงที่):** สุริยยาตร์ · ลาหิรี · อันโตนาทีฯ · ราหู ๘ กุมภ์ · ทักษา ฯลฯ



## โครงสร้าง



```

src/data/tableSchemas.ts         — ชื่อแถว 25×3

src/utils/mockTableData.ts       — mock 75 แถว → แทนด้วยสูตรจริง

src/utils/astrologyCalculator.ts — เรียก mock generators

src/components/resultTableColumns.tsx — คอลัมน์ UI

```


