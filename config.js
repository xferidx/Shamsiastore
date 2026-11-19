/* ===== ALL SETTINGS + VALIDATION RULES LIVE HERE — edit freely ===== */
const IP = ["IP20","IP21","IP42","IP54","IP55","IP56","IP65","IP66","IP67","IP68"];
const CONFIG = {
  firebase: { apiKey:"", authDomain:"", projectId:"", storageBucket:"", messagingSenderId:"", appId:"" },
  rate: 1520,                       // IQD per 1 USD (shown next to every price)
  adminUids: ["HMSqWwbh6YMoKU6REIyWz6rqO532"],// Firebase Auth UID(s) of admins
  cities: [["Baghdad","بغداد"],["Basra","البصرة"],["Mosul","الموصل"],["Erbil","أربيل"],["Sulaymaniyah","السليمانية"],["Duhok","دهوك"],["Kirkuk","كركوك"],["Najaf","النجف"],["Karbala","كربلاء"],["Nasiriyah","الناصرية"],["Amarah","العمارة"],["Diwaniyah","الديوانية"],["Hillah","الحلة"],["Kut","الكوت"],["Ramadi","الرمادي"],["Fallujah","الفلوجة"],["Tikrit","تكريت"],["Baqubah","بعقوبة"],["Samawah","السماوة"]],
  brands: ["Pylontech","Huawei","Sungrow","Growatt","Deye","Felicity","Dyness","BYD","Victron","Voltronic","Must","SRNE","Jinko","Longi","Trina","Canadian Solar","JA Solar"],
  limits: {
    cyclesMax: { LFP:10000, NMC:6000, LEAD:3000 },
    kwhTol: 0.05,                   // kWh vs V x Ah / 1000
    maxC: 1.05,                     // max current x V must not exceed this C-rate of capacity
    lowV: [44,58], highV: [100,800], leadV: [2,6,12,24,48],
    kgPerKwh: { LFP:[5,12], NMC:[4,10], LEAD:[20,45] },
    ip: IP, warrantyMax: 15,
    peerFactor: 2                   // soft warning if value is >2x or <1/2 of catalog median
  },
  head: [
    { k:"brand", type:"txt", req:1, ar:"الماركة", en:"Brand" },
    { k:"model", type:"txt", req:1, ar:"الموديل", en:"Model" }
  ],
  tail: [
    { k:"price", type:"num", req:1, ar:"السعر", en:"Price", unit:"IQD", better:"lo" },
    { k:"stock", type:"sel", req:1, ar:"المخزون", en:"Stock", opts:[["in","متوفر","In stock"],["order","حسب الطلب","On order"],["out","نافد","Out of stock"]] },
    { k:"warranty", type:"num", req:1, ar:"الضمان", en:"Warranty", unit:"yr", better:"hi", max:15 },
    { k:"inverters", type:"txt", ar:"عاكسات يدّعي التاجر توافقها (مفصولة بفاصلة)", en:"Inverters the dealer claims it works with (comma-separated)" }
  ],
  fields: {
    battery: [
      { k:"chem", type:"sel", req:1, ar:"الكيمياء", en:"Chemistry", opts:[["LFP","LFP"],["NMC","NMC"],["LEAD","رصاص حمضي","Lead-acid"]] },
      { k:"volt", type:"num", req:1, ar:"الجهد الاسمي", en:"Nominal voltage", unit:"V" },
      { k:"ah", type:"num", req:1, ar:"السعة", en:"Capacity", unit:"Ah", better:"hi" },
      { k:"kwh", type:"num", req:1, ar:"الطاقة", en:"Energy", unit:"kWh", better:"hi" },
      { k:"usable", type:"num", req:1, ar:"الطاقة المفيدة", en:"Usable energy", unit:"kWh", better:"hi" },
      { k:"dod", type:"num", req:1, ar:"عمق التفريغ", en:"Depth of discharge", unit:"%", max:100, better:"hi" },
      { k:"contChg", type:"num", req:1, ar:"تيار الشحن المستمر", en:"Continuous charge current", unit:"A", better:"hi" },
      { k:"contDis", type:"num", req:1, ar:"تيار التفريغ المستمر", en:"Continuous discharge current", unit:"A", better:"hi" },
      { k:"maxA", type:"num", req:1, ar:"التيار الأقصى", en:"Max current", unit:"A", better:"hi" },
      { k:"peakA", type:"num", req:1, ar:"تيار الذروة", en:"Peak current", unit:"A", better:"hi" },
      { k:"peakSec", type:"num", req:1, ar:"مدة تيار الذروة", en:"Peak duration", unit:"s", better:"hi" },
      { k:"cycles", type:"num", req:1, ar:"عدد الدورات", en:"Cycle life", better:"hi" },
      { k:"testDoD", type:"num", req:1, ar:"ظرف الاختبار: DoD", en:"Cycle test DoD", unit:"%", max:100 },
      { k:"testC", type:"num", req:1, ar:"ظرف الاختبار: C-rate", en:"Cycle test C-rate", unit:"C", max:3 },
      { k:"ip", type:"sel", req:1, ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", req:1, ar:"الوزن", en:"Weight", unit:"kg", better:"lo" },
      { k:"tmin", type:"num", req:1, neg:1, ar:"أدنى حرارة تشغيل", en:"Min operating temp", unit:"°C" },
      { k:"tmax", type:"num", req:1, neg:1, ar:"أعلى حرارة تشغيل", en:"Max operating temp", unit:"°C" },
      { k:"comm", type:"multi", req:1, ar:"الاتصال", en:"Communication", opts:[["CAN"],["RS485"],["RS232"],["Bluetooth"],["WiFi"]] },
      { k:"cooling", type:"sel", req:1, ar:"التبريد", en:"Cooling", opts:[["air","هوائي","Air"],["liquid","سائل","Liquid"]] },
      { k:"fire", type:"sel", req:1, ar:"إطفاء الحريق", en:"Fire suppression", opts:[["none","بدون","None"],["aerosol","إيروسول مدمج","Built-in aerosol"],["optional","اختياري","Optional"]] },
      { k:"certs", type:"multi", req:1, ar:"الشهادات", en:"Certifications", opts:[["UN38.3"],["IEC 62619"],["CE"],["UL 1973"],["IEC 63056"],["none","بدون","None"]] },
      { k:"parallel", type:"num", req:1, ar:"أقصى عدد على التوازي", en:"Max units in parallel", better:"hi", max:100 }
    ],
    inverter: [
      { k:"itype", type:"sel", req:1, ar:"النوع", en:"Type", opts:[["hybrid","هجين","Hybrid"],["ongrid","ربط شبكة","On-grid"],["offgrid","منفصل","Off-grid"]] },
      { k:"kw", type:"num", req:1, ar:"القدرة", en:"Rated power", unit:"kW", better:"hi", max:100 },
      { k:"phase", type:"sel", req:1, ar:"الأطوار", en:"Phases", opts:[["1"],["3"]] },
      { k:"mppt", type:"num", req:1, ar:"عدد MPPT", en:"MPPT trackers", better:"hi", max:12 },
      { k:"pvVmax", type:"num", req:1, ar:"أقصى جهد ألواح", en:"Max PV voltage", unit:"V", max:1500 },
      { k:"battV", type:"num", req:1, ar:"جهد البطارية", en:"Battery voltage", unit:"V", max:800 },
      { k:"eff", type:"num", req:1, ar:"الكفاءة", en:"Efficiency", unit:"%", max:99.5, better:"hi" },
      { k:"comm", type:"multi", req:1, ar:"الاتصال", en:"Communication", opts:[["CAN"],["RS485"],["RS232"],["Bluetooth"],["WiFi"]] },
      { k:"ip", type:"sel", req:1, ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", req:1, ar:"الوزن", en:"Weight", unit:"kg", better:"lo", max:300 }
    ],
    panel: [
      { k:"watt", type:"num", req:1, ar:"القدرة", en:"Power", unit:"W", better:"hi", max:800 },
      { k:"cell", type:"sel", req:1, ar:"نوع الخلية", en:"Cell type", opts:[["perc","PERC"],["topcon","TOPCon"],["hjt","HJT"],["poly","Poly"]] },
      { k:"voc", type:"num", req:1, ar:"Voc", en:"Voc", unit:"V", max:60 },
      { k:"isc", type:"num", req:1, ar:"Isc", en:"Isc", unit:"A", max:25 },
      { k:"eff", type:"num", req:1, ar:"الكفاءة", en:"Efficiency", unit:"%", max:25, better:"hi" },
      { k:"ip", type:"sel", req:1, ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", req:1, ar:"الوزن", en:"Weight", unit:"kg", better:"lo", max:50 }
    ]
  }
};
CONFIG.fieldsAll = cat => [...CONFIG.head, ...CONFIG.fields[cat], ...CONFIG.tail];

/* Returns {e:{field:{ar,en,req?}}, w:{field:{ar,en}}}. Any key in e blocks saving. */
function validate(cat, v, peers = []) {
  const L = CONFIG.limits, e = {}, w = {};
  const n = k => parseFloat(v[k]);
  const has = k => v[k] !== "" && v[k] != null && !(Array.isArray(v[k]) && !v[k].length);
  const E = (k, ar, en) => { if (!e[k]) e[k] = { ar, en }; };
  const W = (k, ar, en) => { w[k] = { ar, en }; };
  const ok = k => !e[k] && has(k);

  for (const f of CONFIG.fieldsAll(cat)) {
    if (f.req && !has(f.k)) { E(f.k, "هذا الحقل مطلوب", "This field is required"); e[f.k].req = 1; continue; }
    if (f.type === "num" && has(f.k)) {
      const x = n(f.k);
      if (isNaN(x) || (!f.neg && x <= 0)) E(f.k, "يجب أن تكون القيمة أكبر من صفر", "Value must be greater than zero");
      else if (f.max && x > f.max) E(f.k, `القيمة أعلى من الحد الممكن (${f.max})`, `Value is above the possible maximum (${f.max})`);
    }
  }
  if (v.warranty !== "" && n("warranty") > L.warrantyMax) E("warranty", `الضمان لا يتجاوز ${L.warrantyMax} سنة`, `Warranty cannot exceed ${L.warrantyMax} years`);
  if (has("ip") && !L.ip.includes(v.ip)) E("ip", "درجة IP غير صالحة", "Invalid IP rating");

  if (cat === "battery") {
    const c = v.chem, V = n("volt"), Ah = n("ah"), kwh = n("kwh"), us = n("usable"), mx = n("maxA"), kg = n("kg");
    if (c && ok("volt")) {
      if (c === "LEAD") { if (!L.leadV.includes(V)) E("volt", `الرصاص الحمضي: ${L.leadV.join(" / ")} فولت فقط`, `Lead-acid must be ${L.leadV.join(" / ")} V`); }
      else if (!((V >= L.lowV[0] && V <= L.lowV[1]) || (V >= L.highV[0] && V <= L.highV[1])))
        E("volt", `الجهد لا يطابق الفئة: منخفض ${L.lowV.join("–")} (مثلاً 51.2 لـ LFP) أو عالٍ ${L.highV.join("–")} فولت`, `Voltage fits no class: low ${L.lowV.join("–")} V (e.g. 51.2 for LFP) or high ${L.highV.join("–")} V`);
    }
    if (ok("volt") && ok("ah") && ok("kwh")) {
      const k = V * Ah / 1000;
      if (Math.abs(kwh - k) / k > L.kwhTol) E("kwh", `kWh يجب أن تساوي V × Ah ÷ 1000 = ${k.toFixed(2)} (±5%)`, `kWh must equal V × Ah ÷ 1000 = ${k.toFixed(2)} (±5%)`);
    }
    if (ok("usable") && ok("kwh") && us > kwh) E("usable", "الطاقة المفيدة أكبر من الإجمالية", "Usable kWh is above total kWh");
    if (ok("usable") && ok("kwh") && ok("dod") && Math.abs(us / kwh * 100 - n("dod")) > 10) W("dod", "عمق التفريغ لا يطابق المفيد/الإجمالي", "DoD does not match usable / total");
    ["contChg", "contDis"].forEach(k => { if (ok(k) && ok("maxA") && n(k) > mx) E(k, "التيار المستمر أعلى من التيار الأقصى", "Continuous current is above max current"); });
    if (ok("maxA") && ok("volt") && ok("kwh") && mx * V / 1000 > kwh * L.maxC)
      E("maxA", `التيار الأقصى × الجهد = ${(mx * V / 1000).toFixed(1)} kW أعلى من ~1C لهذه السعة`, `Max current × voltage = ${(mx * V / 1000).toFixed(1)} kW is above ~1C for this capacity`);
    if (ok("peakA") && ok("maxA") && n("peakA") < mx) E("peakA", "تيار الذروة أقل من التيار الأقصى", "Peak current is below max current");
    if (c && ok("cycles") && n("cycles") > L.cyclesMax[c]) E("cycles", `دورات ${c} لا تتجاوز ${L.cyclesMax[c]}`, `${c} cycles cannot exceed ${L.cyclesMax[c]}`);
    if (c && ok("kg") && ok("kwh")) {
      const r = kg / kwh, [a, b] = L.kgPerKwh[c];
      if (r < a || r > b) E("kg", `الوزن غير منطقي: ${r.toFixed(1)} كغم/kWh (المتوقع ${a}–${b})`, `Weight is implausible: ${r.toFixed(1)} kg/kWh (expected ${a}–${b})`);
    }
    if (ok("tmin") && ok("tmax") && n("tmin") >= n("tmax")) E("tmax", "أعلى حرارة يجب أن تكون أكبر من الأدنى", "Max temperature must be above min temperature");
  }

  // soft warnings against similar products already in the catalog
  const med = a => { a = a.filter(x => x > 0).sort((x, y) => x - y); return a.length >= 3 ? a[a.length >> 1] : 0; };
  const per = { battery: "kwh", inverter: "kw", panel: "watt" }[cat];
  const chk = (k, d) => {
    if (e[k] || !has(k)) return;
    const g = p => d ? p[k] / p[d] : p[k], x = d ? n(k) / n(d) : n(k), m = med(peers.map(g));
    if (m && x > 0 && (x > m * L.peerFactor || x < m / L.peerFactor)) W(k, "قيمة غير معتادة مقارنةً بمنتجات مشابهة — تحقق منها", "Unusual versus similar products — check this value");
  };
  chk("price", per); chk("warranty");
  if (cat === "battery") { chk("cycles"); chk("kg", "kwh"); chk("maxA", "kwh"); }
  return { e, w };
}

/* Firestore rules (paste in Firebase console; replace ADMIN_UID):
rules_version='2'; service cloud.firestore { match /databases/{d}/documents {
  function admin(){ return request.auth!=null && request.auth.uid in ['ADMIN_UID']; }
  match /users/{u} {
    allow read: if resource.data.approved==true || request.auth.uid==u || admin();
    allow create: if request.auth.uid==u && request.resource.data.approved==false && request.resource.data.authorized==false;
    allow delete: if admin();
    allow update: if admin() || (request.auth.uid==u && request.resource.data.approved==resource.data.approved
      && request.resource.data.authorized==resource.data.authorized && request.resource.data.role==resource.data.role);
  }
  match /products/{p} {
    allow read: if true;
    allow create: if request.auth!=null && request.resource.data.ownerId==request.auth.uid
      && request.resource.data.verified==false && request.resource.data.dsOk==false
      && (admin() || get(/databases/$(d)/documents/users/$(request.auth.uid)).data.approved==true);
    allow update, delete: if admin() || (resource.data.ownerId==request.auth.uid
      && request.resource.data.verified==resource.data.verified && request.resource.data.dsOk==resource.data.dsOk);
  }
  match /photos/{p} {
    allow read: if true;
    allow create: if request.auth!=null && request.resource.data.ownerId==request.auth.uid
      && get(/databases/$(d)/documents/products/$(p)).data.ownerId==request.auth.uid;
    allow update, delete: if admin() || resource.data.ownerId==request.auth.uid;
  }
}}
*/
