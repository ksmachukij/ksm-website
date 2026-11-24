/**
 * productcountry.ts
 *
 * ข้อมูล "เกรดของประเทศอะไร" ของสินค้าแต่ละตัว
 * แยกไว้ในไฟล์นี้ เพื่อไม่ต้องแก้ productlist.ts
 *
 * วิธีกรอก: ใส่ชื่อประเทศ (ภาษาอังกฤษ ตรงกับ countryLabel ด้านล่าง) ในเครื่องหมายคำพูด
 *   "CBS-G": "Japan",
 * เว้นว่าง "" ได้ถ้ายังไม่ทราบ (หน้าเว็บจะแสดง "-")
 * ถ้ามีหลายประเทศ ใส่เป็นรายการ   "DINP": ["America", "Thailand"],
 *
 * ค่าเริ่มต้นนี้มาจากรายการรหัสสินค้าภายใน: ตัวอักษร 2 ตัวก่อนหลักสุดท้ายของรหัสคือประเทศ
 *   TL=Thailand AM=America KR=Korea CH=China JP=Japan
 *   RS=Russia GR=Germany TW=Taiwan IN=India ID=Indonesia
 * ประเทศที่ใช้ได้:
 *   America, China, Germany, Holland, India, Indonesia, Japan,
 *   Korea, Malaysia, Poland, Russia, Taiwan, Thailand
 */

import { productList } from './productlist'

// ค่าที่เก็บเป็นชื่ออังกฤษ ส่วนชื่อที่แสดงบนเว็บเลือกตามภาษา
export const countryLabel: Record<string, { TH: string; EN: string }> = {
  America: { TH: 'สหรัฐอเมริกา', EN: 'America' },
  China: { TH: 'จีน', EN: 'China' },
  Germany: { TH: 'เยอรมนี', EN: 'Germany' },
  Holland: { TH: 'เนเธอร์แลนด์', EN: 'Holland' },
  India: { TH: 'อินเดีย', EN: 'India' },
  Indonesia: { TH: 'อินโดนีเซีย', EN: 'Indonesia' },
  Japan: { TH: 'ญี่ปุ่น', EN: 'Japan' },
  Korea: { TH: 'เกาหลี', EN: 'Korea' },
  Malaysia: { TH: 'มาเลเซีย', EN: 'Malaysia' },
  Poland: { TH: 'โปแลนด์', EN: 'Poland' },
  Russia: { TH: 'รัสเซีย', EN: 'Russia' },
  Taiwan: { TH: 'ไต้หวัน', EN: 'Taiwan' },
  Thailand: { TH: 'ไทย', EN: 'Thailand' },
}

export const countryOptions: string[] = Object.keys(countryLabel)

// หัวคอลัมน์/ป้ายชื่อ "ประเทศ" (ย้ายไปไว้ใน componentText ทีหลังก็ได้)
export const countryTitle = { TH: 'ประเทศ', EN: 'Country' }

// ชื่อสินค้า -> ประเทศ (ชื่อต้องตรงกับ name ใน productList เป๊ะๆ)
const productCountry: Record<string, string | string[]> = {
  // Accelerator
  "CBS-G": "China",
  "CBS-P": "China",
  "DPG-G": "China",
  "MBT-G": "China",
  "MBTS-G": "China",
  "TMTD-P": "China",
  "Accel-22S": "",
  "BZ-P": "Japan",
  // Adhesive
  "Chemlok 205": "",
  "Chemlok 220": "",
  "Chemlok 6411": "",
  // Antioxidant
  "Amspec": "America", // ตรวจ: ชื่อในรายการภายในเขียน (KR Grade) แต่รหัสเป็น AM = America
  "WingstayL": "America",
  "Sungtight-S": "Japan", // ในรายการภายในสะกด Suntight-S
  // Carbon Black
  "N330-TCB": "Thailand",
  "N550-TCB": "Thailand",
  "N660": "Thailand",
  "774-TCB": "",
  "Acetylene Black AB50P": "Thailand",
  // Calcium Carbonate
  "GU": "Japan",
  "USG": "Thailand",
  "UR-T": "Thailand",
  "233": "Thailand",
  "255": "Thailand",
  "Calstone Blue": "Thailand",
  "YCC-303": "Taiwan",
  // Pigment
  "Titanium Oxide R902": "Taiwan", // ในรายการภายในคือ Titanium Dioxide R902
  "Titanium Oxide R101": "America", // ในรายการภายในคือ Titanium Dioxide R101
  "Titanium Oxide R103": "America", // ในรายการภายในคือ Titanium Dioxide R103
  // Curing Material
  "Magnesium Oxide-30": "Japan",
  "Magnesium Oxide-150": "Japan",
  "Magnesium Oxide-B": "Japan",
  "Oxide WhiteSeal-UT": "Thailand", // จับคู่กับ Zinc Oxide Whiteseal Utid
  "Zinc Oxide CS-30": "Taiwan",
  "Sulphur Powder": "Thailand",
  "Colloidal Sulphur": "Japan",
  "Calcium Sulfate": "Korea",
  "Kyowaad 500 SH": "Japan",
  // Dispersion
  "Brown Factice No.21": "Japan",
  "White Factice#2": "Japan",
  "Stearic Acid(1860) Bead": "Indonesia",
  "Zinc Stearate TW": "",
  "Silicone 35": "Thailand",
  "Silicone 60C": "Thailand",
  "Silicone Element14 PDMS 350-Momentive": "Germany",
  // Para Aramid
  "Para-Aramid HP500": "Korea",
  // Oil
  "DOP": "Thailand",
  "DINP": ["America", "Thailand"], // มี 2 แหล่ง: Exxon (America) และ Thai (Thailand)
  "DBP": "Korea",
  "AC617A AC Polyethylene": "Thailand",
  "DHT-4A": "Japan",
  // Thermoplastic Polyurethane(TPU)
  "H220": "China",
  "H320": "China",
  // Styrene Butadiene Rubber(SBR)
  "1507": "Japan",
  // Butadiene Rubber(BR)
  "150B": "Japan",
  "1280": "Korea",
  // Nitrile Butadiene Rubber(NBR)
  "3325C": "", // ยังไม่ใส่: รายการภายในมี NBR 3345C Krynac (CH) ถ้าเป็นตัวเดียวกันให้ใส่ China
  "N220S": "Japan",
  "N220SH": "",
  "N230S": "Japan",
  "N230SL": "Japan",
  "N230SV": "",
  "N217SH": "Japan",
  "210S": "Japan", // ในรายการภายในคือ N210S
  "4105": "China",
  "6240": "Korea",
  "6280": "Korea",
  "7030": "Korea",
  // Chloroprene Rubber(CR)
  "B-30": "Japan",
  "R-10": "Japan",
  "G-40S1": "Japan",
  "G-40T": "Japan",
  "Y-30HA": "Japan",
  "Y-30S": "Japan",
  "Y-20E": "Japan",
  "TSR-48": "Japan",
  "E-33": "Japan",
  "Latex SL-360": "",
  // Ethylene Propylene Diene Rubber(EPDM)
  "EPT 4021H": "Japan",
  "EP-33": "Japan",
  // Butyl Reclaimed Rubber(Reclaim Butyl)
  "RBRR-111": "India",
  // Butyl Rubber(IIR)
  "1066": "America",
  "Butyl IIR1953": "China",
  "268-S": "",
  "BK-1675N": "Russia",
  // Chlorosulphonated Polyethylene(CSM)
  "TS-430": "Japan",
  "TS-530": "Japan",
  // Tackifier
  "Gum Resin": "China", // ในรายการภายในคือ Gum Rosin
  "Coumarone Resin G90": "Japan",
  "Resitop PGA-9401": "Japan",
}

// ค่าที่กรอกเป็นข้อความเดียวหรือรายการ แปลงเป็นอาร์เรย์เสมอ
const toList = (value: string | string[] | undefined): string[] =>
  (Array.isArray(value) ? value : [value ?? '']).filter(Boolean)

// เตือนใน Console ถ้าพิมพ์ชื่อประเทศผิด (ไม่ทำให้เว็บพัง)
for (const [name, value] of Object.entries(productCountry)) {
  for (const country of toList(value)) {
    if (!countryLabel[country]) {
      console.warn(`[productcountry] "${name}": ไม่รู้จักประเทศ "${country}"`)
    }
  }
}

// สินค้าทั้งหมด พร้อมฟิลด์ประเทศ (ใช้แทน productList ในหน้ารายการ/รายละเอียด)
//   countries = อาร์เรย์ (ใช้กรองและแสดงผล)   country = ข้อความรวม (ใช้เรียงลำดับตาราง)
export const productsWithCountry = productList.map((product) => {
  const countries = toList(productCountry[product.name])
  return { ...product, countries, country: countries.join(', ') }
})
