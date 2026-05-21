# NewHora — Thai Astrology Prototype

ดูข้อกำหนดถาวร: **[REQUIREMENTS.md](./REQUIREMENTS.md)**

## วิธีรัน

```bash
npm install
npm run dev
```

## สรุป requirement

**Input:** วัน เดือน ปี เวลา HH:mm ประเทศ จังหวัด อำเภอ

**ระบบคำนวณ (คงที่):** สุริยยาตร์ · ลาหิรี · อันโตนาทีสามัญ สมผุสอาทิตย์อุทัย ปรับเวลาท้องถิ่น · ราหู ๘ ราศีกุมภ์ · ทักษา ราหู=พุธกลางคืน · ทักษานับตากลาง

**Output:** ตารางเดียว — **ดาว** | **สถิตราศี**

## โครงสร้าง

```
src/data/calculationSettings.ts  — ระบบคำนวณคงที่
src/utils/astrologyCalculator.ts — mock → สูตรจริง
REQUIREMENTS.md                  — บันทึก requirement
```
