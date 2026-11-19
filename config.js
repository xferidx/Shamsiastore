/* ===== ALL SETTINGS + VALIDATION RULES LIVE HERE — edit freely ===== */
const IP = ["IP20","IP21","IP31","IP42","IP43","IP44","IP45","IP54","IP55","IP56","IP65","IP66","IP67","IP68"];
const CONFIG = {
  firebase: {
    apiKey:"AIzaSyALx9PQ6eBVcBgBjc_fKhbnq91BV5WiGi8",
    authDomain:"noor-88d88.firebaseapp.com",
    projectId:"noor-88d88",
    storageBucket:"noor-88d88.firebasestorage.app",
    messagingSenderId:"1090985815108",
    appId:"1:1090985815108:web:16a770d9236a26aa652011"
  },
  rate: 1520,                       // IQD per 1 USD (shown next to every price)
  adminUids: ["HMSqWwbh6YMoKU6REIyWz6rqO532"],// Firebase Auth UID(s) of admins
  cities: [["Baghdad","بغداد"],["Basra","البصرة"],["Mosul","الموصل"],["Erbil","أربيل"],["Sulaymaniyah","السليمانية"],["Duhok","دهوك"],["Kirkuk","كركوك"],["Najaf","النجف"],["Karbala","كربلاء"],["Nasiriyah","الناصرية"],["Amarah","العمارة"],["Diwaniyah","الديوانية"],["Hillah","الحلة"],["Kut","الكوت"],["Ramadi","الرمادي"],["Fallujah","الفلوجة"],["Tikrit","تكريت"],["Baqubah","بعقوبة"],["Samawah","السماوة"]],
  brands: ["Pylontech","Huawei","Sungrow","Growatt","Deye","Felicity","Dyness","BYD","Victron","Voltronic","Must","SRNE","Jinko","Longi","Trina","Canadian Solar","JA Solar"],
  limits: {
    cyclesMax: { LFP:10000, NMC:6000, LEAD:3000 },
    kwhTol: 0.05,                   // kWh vs V x Ah / 1000
    maxC: 1.05,                     // max current x V must not exceed this C-rate of capacity
    lowV: [44,58], smallV: [[11,15],[22,30]], highV: [100,800], leadV: [2,6,12,24,48],
    kgPerKwh: { LFP:[5,12], NMC:[4,10], LEAD:[20,45] },
    ip: IP, warrantyMax: 15,
    peerFactor: 2                   // soft warning if value is >2x or <1/2 of catalog median
  },
  head: [
    { k:"brand", type:"txt", req:1, ar:"الماركة", en:"Brand" },
    { k:"model", type:"txt", req:1, ar:"الموديل / الاسم", en:"Model / name" }
  ],
  tail: [
    { k:"price", type:"num", req:1, ar:"السعر", en:"Price", unit:"IQD", better:"lo" },
    { k:"stock", type:"sel", req:1, ar:"المخزون", en:"Stock", opts:[["in","متوفر","In stock"],["order","حسب الطلب","On order"],["out","نافد","Out of stock"]] },
    { k:"warranty", type:"num", req:1, ar:"الضمان", en:"Warranty", unit:"yr", better:"hi", max:15 }
  ],
  /* Spec fields per "set". set = battery | inverter | ctrl | panel | mount | acc | kit (see setOf) */
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
      { k:"parallel", type:"num", req:1, ar:"أقصى عدد على التوازي", en:"Max units in parallel", better:"hi", max:100 },
      { k:"inverters", type:"txt", ar:"عاكسات يدّعي التاجر توافقها (مفصولة بفاصلة)", en:"Inverters the dealer claims it works with (comma-separated)" }
    ],
    inverter: [
      { k:"itype", type:"sel", req:1, ar:"النوع", en:"Type", opts:[["hybrid","هجين","Hybrid"],["ongrid","ربط شبكة","On-grid"],["offgrid","منفصل","Off-grid"],["pump","غطاسات","Pumping"]] },
      { k:"kw", type:"num", req:1, ar:"القدرة", en:"Rated power", unit:"kW", better:"hi", max:150 },
      { k:"phase", type:"sel", req:1, ar:"الأطوار", en:"Phases", opts:[["1"],["3"]] },
      { k:"mppt", type:"num", req:1, ar:"عدد MPPT", en:"MPPT trackers", better:"hi", max:12 },
      { k:"pvVmax", type:"num", req:1, ar:"أقصى جهد ألواح", en:"Max PV voltage", unit:"V", max:1500 },
      { k:"battV", type:"num", ar:"جهد البطارية (إن وُجد)", en:"Battery voltage (if any)", unit:"V", max:800 },
      { k:"eff", type:"num", req:1, ar:"الكفاءة", en:"Efficiency", unit:"%", max:99.5, better:"hi" },
      { k:"comm", type:"multi", req:1, ar:"الاتصال", en:"Communication", opts:[["CAN"],["RS485"],["RS232"],["Bluetooth"],["WiFi"]] },
      { k:"ip", type:"sel", req:1, ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", req:1, ar:"الوزن", en:"Weight", unit:"kg", better:"lo", max:300 }
    ],
    ctrl: [
      { k:"ctype", type:"sel", req:1, ar:"النوع", en:"Type", opts:[["mppt","MPPT"],["pwm","PWM"]] },
      { k:"amps", type:"num", req:1, ar:"أقصى تيار شحن", en:"Max charge current", unit:"A", better:"hi", max:200 },
      { k:"pvVmax", type:"num", req:1, ar:"أقصى جهد ألواح", en:"Max PV voltage", unit:"V", max:600 },
      { k:"battV", type:"num", req:1, ar:"جهد البطارية", en:"Battery voltage", unit:"V", max:120 },
      { k:"eff", type:"num", req:1, ar:"الكفاءة", en:"Efficiency", unit:"%", max:99.5, better:"hi" },
      { k:"ip", type:"sel", req:1, ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", ar:"الوزن", en:"Weight", unit:"kg", better:"lo", max:30 }
    ],
    panel: [
      { k:"watt", type:"num", req:1, ar:"القدرة", en:"Power", unit:"W", better:"hi", max:800 },
      { k:"cell", type:"sel", req:1, ar:"نوع الخلية", en:"Cell type", opts:[["topcon","TOPCon"],["perc","PERC"],["hjt","HJT"],["poly","Poly"]] },
      { k:"voc", type:"num", req:1, ar:"Voc", en:"Voc", unit:"V", max:60 },
      { k:"isc", type:"num", req:1, ar:"Isc", en:"Isc", unit:"A", max:25 },
      { k:"eff", type:"num", req:1, ar:"الكفاءة", en:"Efficiency", unit:"%", max:25, better:"hi" },
      { k:"ip", type:"sel", req:1, ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", req:1, ar:"الوزن", en:"Weight", unit:"kg", better:"lo", max:50 }
    ],
    mount: [
      { k:"material", type:"sel", req:1, ar:"الخامة", en:"Material", opts:[["alu","ألمنيوم","Aluminum"],["steel","حديد مجلفن","Galvanized steel"],["inox","ستانلس","Stainless"],["copper","نحاس","Copper"],["plastic","بلاستيك","Plastic"]] },
      { k:"specs", type:"txt", req:1, ar:"المواصفات الرئيسية (القياس، الكمية، التحمّل...)", en:"Main specs (size, quantity, rating...)" },
      { k:"mm2", type:"num", ar:"مقطع الكيبل (اختياري)", en:"Cable cross-section (optional)", unit:"mm²", max:300 },
      { k:"ratedV", type:"num", ar:"الجهد المقنّن (اختياري)", en:"Rated voltage (optional)", unit:"V", max:1500 },
      { k:"ratedA", type:"num", ar:"التيار المقنّن (اختياري)", en:"Rated current (optional)", unit:"A", max:2000 }
    ],
    kit: [
      { k:"kitKw", type:"num", req:1, ar:"حجم المنظومة", en:"Package size", unit:"kW", better:"hi", max:100 },
      { k:"kitA", type:"num", req:1, ar:"الأمبير المدعوم", en:"Supported load", unit:"A", better:"hi", max:500 },
      { k:"invKw", type:"num", req:1, ar:"قدرة الانفرتر", en:"Inverter size", unit:"kW", better:"hi", max:150 },
      { k:"panelsN", type:"num", req:1, zero:1, ar:"عدد الألواح", en:"Number of panels", better:"hi", max:500 },
      { k:"panelW", type:"num", req:1, zero:1, ar:"قدرة اللوح", en:"Panel power", unit:"W", max:800 },
      { k:"batKwh", type:"num", req:1, zero:1, ar:"سعة البطاريات", en:"Battery capacity", unit:"kWh", better:"hi", max:500 },
      { k:"includes", type:"txt", req:1, ar:"محتويات الباقة", en:"What is included" }
    ]
  },
  /* Categories menu. item = [key, ar, en, optional set override]. A product has one main category + any number of item keys (tags). */
  taxonomy: [
    { k:"panel", icon:"☀️", ar:"الألواح الشمسية", en:"Solar Panels", groups:[
      { ar:"حسب التقنية", en:"By Technology", items:[["topcon","ألواح TOPCon نوع N (كفاءة عالية بالأجواء الحارة)","N-Type TOPCon Panels (high efficiency in hot climates)"],["perc","PERC أحادية البلورة","PERC Monocrystalline"],["bifacial","ثنائية الوجه (امتصاص من الجهتين)","Bifacial Panels (double-sided)"],["flex","ألواح مرنة ومحمولة","Flexible & Portable Panels"]] },
      { ar:"حسب القدرة", en:"By Capacity Range", items:[["cap-res","سكني: 400 – 580 واط","Residential: 400–580W"],["cap-com","تجاري وزراعي: 600 – 750 واط+","Commercial & Agricultural: 600–750W+"]] },
      { ar:"حسب الاستخدام", en:"By Application", items:[["app-roof","أسطح سكنية","Rooftop Residential"],["app-agri","مضخات زراعية","Agricultural Pumping Systems"],["app-ci","تجاري وصناعي (C&I)","Commercial & Industrial (C&I)"]] }
    ]},
    { k:"inverter", icon:"🔌", ar:"العواكس والمنظمات", en:"Inverters & Control Systems", groups:[
      { ar:"أنواع العواكس", en:"Inverter Types", items:[["hybrid","هجين (شمس + شبكة + مولدة)","Hybrid (Solar + Grid + Generator)"],["offgrid","عواكس منفصلة عن الشبكة","Off-Grid Inverters"],["ongrid","ربط مع الشبكة","On-Grid / Tie Inverters"],["pumpinv","عواكس الغطاسات","Solar Water Pumping Inverters"]] },
      { ar:"حسب الطور والقدرة", en:"By Phase & Capacity", items:[["ph1","طور واحد: 3 / 5 / 8 / 10 كيلوواط","Single-Phase: 3 / 5 / 8 / 10 kW"],["ph3","ثلاثة أطوار: 10 – 100 كيلوواط+","Three-Phase: 10–100 kW+"]] },
      { ar:"منظمات الشحن", en:"Charge Controllers", items:[["mppt","منظمات MPPT","MPPT Controllers","ctrl"],["pwm","منظمات PWM","PWM Controllers","ctrl"]] }
    ]},
    { k:"battery", icon:"🔋", ar:"البطاريات وأنظمة التخزين", en:"Batteries & Energy Storage", groups:[
      { ar:"تقنية البطارية", en:"Battery Technologies", items:[["lifepo4","ليثيوم LiFePO4 (جداري وراك)","LiFePO4 Wall-Mounted & Rack Modules"],["gel","بطاريات جل أنبوبية","Tubular Gel Batteries"],["agm","AGM / رصاص حمضي عميقة الدورة","AGM / Deep Cycle Lead-Acid"]] },
      { ar:"جهد المنظومة", en:"System Voltage", items:[["v12-24","12 / 24 فولت (منظومات صغيرة)","12V / 24V (small setups)"],["v48","48 فولت (تخزين سكني قياسي)","48V (standard residential)"],["vhv","منظومات جهد عالٍ HV (تجاري)","High Voltage (HV) systems (commercial)"]] },
      { ar:"الملحقات", en:"Accessories", items:[["bms","أنظمة إدارة البطارية BMS","Battery Management Systems (BMS)","acc"],["cabinet","خزائن وراكات البطاريات","Battery Cabinets & Racks","acc"],["bcable","أطقم كوابل البطاريات الثقيلة","Heavy-Duty Battery Cable Kits","acc"]] }
    ]},
    { k:"mount", icon:"🛠️", ar:"الهياكل والتأسيسات الكهربائية", en:"Mounting & Cable Hardware", groups:[
      { ar:"الهياكل", en:"Mounting Structures", items:[["flat-alu","شاسيهات ألمنيوم للأسطح المستوية","Flat Roof Aluminum Racks"],["ground-galv","هياكل أرضية (حديد مجلفن)","Ground Mount Systems (galvanized steel)"],["tile-metal","ملحقات تثبيت أسطح القرميد والصفائح","Tile / Metal Sheet Roof Mounting Hardware"],["tilt","هياكل بزاوية ميل قابلة للتعديل","Adjustable Tilt Racks"]] },
      { ar:"الكوابل والوصلات", en:"Cables & Connectors", items:[["dc-cable","كوابل DC شمسية (4 / 6 / 10 ملم² - مقاومة UV)","Solar DC Cables (4 / 6 / 10 mm², UV resistant)"],["mc4","وصلات MC4 ووصلات التفريع","MC4 Connectors & Branch Connectors"],["batt-cable","كوابل ربط البطاريات","Battery Interconnect Cables"]] },
      { ar:"لوحات الحماية والتوزيع", en:"Protection & Distribution", items:[["isolator","مفاتيح عزل DC وقواطع (MCB / MCCB)","DC Isolation Switches & Circuit Breakers (MCB / MCCB)"],["spd","حماية من الصواعق DC (SPD)","DC Surge Protection Devices (SPD)"],["combiner","صناديق التجميع AC/DC","AC/DC Combiner Boxes"],["ats","مفاتيح تحويل أوتوماتيكية ATS (مولدة / شمس / شبكة)","ATS / Automatic Transfer Switches (Generator / Solar / Grid)"]] }
    ]},
    { k:"kit", icon:"📦", ar:"منظومات شمسية متكاملة", en:"Ready Solar Kits", groups:[
      { ar:"باقات سكنية متكاملة", en:"Residential Complete Packages", items:[["kit3","باقة 3 كيلوواط / 15 أمبير أساسية (إنارة، تلفاز، ثلاجة، مراوح)","3kW / 15A Basic (lighting, TV, fridge, fans)"],["kit5","باقة 5 كيلوواط / 25 أمبير قياسية (أجهزة ثقيلة + سبلت)","5kW / 25A Standard (heavy appliances + split AC)"],["kit10","باقة 10 كيلوواط / 50 أمبير مميزة (عدة سبلتات)","10kW / 50A Premium (multi-split AC)"]] },
      { ar:"منظومات تجارية وزراعية", en:"Commercial & Agricultural Kits", items:[["kit-pump","منظومات سحب المياه للزراعة","Solar Pumping Kits for Farms"],["kit-ws","منظومات الورش والمحلات التجارية","Commercial Workshop & Store Power Kits"]] },
      { ar:"محمولة وطوارئ", en:"Portable & Emergency Solar", items:[["kit-station","مولدات شمسية محمولة (Power Stations)","Portable Power Stations"],["kit-camp","أطقم التخييم والرحلات","Camping & Outdoor Kits"]] }
    ]}
  ]
};
CONFIG.fields.acc = CONFIG.fields.mount;
CONFIG.fieldsAll = set => [...CONFIG.head, ...CONFIG.fields[set], ...CONFIG.tail];
CONFIG.itemOf = k => { for (const c of CONFIG.taxonomy) for (const g of c.groups) for (const i of g.items) if (i[0] === k) return i; return null; };
CONFIG.setOf = (cat, tags) => { const s = new Set((tags || []).map(k => (CONFIG.itemOf(k) || [])[3] || cat)); return (!s.size || s.has(cat)) ? cat : [...s][0]; };

/* Returns {e:{field:{ar,en,req?}}, w:{field:{ar,en}}}. Any key in e blocks saving. */
function validate(set, v, peers = []) {
  const L = CONFIG.limits, e = {}, w = {};
  const n = k => parseFloat(v[k]);
  const has = k => v[k] !== "" && v[k] != null && !(Array.isArray(v[k]) && !v[k].length);
  const E = (k, ar, en) => { if (!e[k]) e[k] = { ar, en }; };
  const W = (k, ar, en) => { w[k] = { ar, en }; };
  const ok = k => !e[k] && has(k);
  const tg = k => (v.tags || []).includes(k);
  const inR = (x, rs) => rs.some(([a, b]) => x >= a && x <= b);

  if (!v.tags || !v.tags.length) { E("tags", "اختر نوعاً واحداً على الأقل", "Select at least one type"); e.tags.req = 1; }
  for (const f of CONFIG.fieldsAll(set)) {
    if (f.req && !has(f.k)) { E(f.k, "هذا الحقل مطلوب", "This field is required"); e[f.k].req = 1; continue; }
    if (f.type === "num" && has(f.k)) {
      const x = n(f.k);
      if (isNaN(x) || (!f.neg && (f.zero ? x < 0 : x <= 0))) E(f.k, f.zero ? "يجب ألا تكون القيمة سالبة" : "يجب أن تكون القيمة أكبر من صفر", f.zero ? "Value cannot be negative" : "Value must be greater than zero");
      else if (f.max && x > f.max) E(f.k, `القيمة أعلى من الحد الممكن (${f.max})`, `Value is above the possible maximum (${f.max})`);
    }
  }
  if (v.warranty !== "" && n("warranty") > L.warrantyMax) E("warranty", `الضمان لا يتجاوز ${L.warrantyMax} سنة`, `Warranty cannot exceed ${L.warrantyMax} years`);
  if (has("ip") && !L.ip.includes(v.ip)) E("ip", "درجة IP غير صالحة", "Invalid IP rating");

  if (set === "battery") {
    const c = v.chem, V = n("volt"), Ah = n("ah"), kwh = n("kwh"), us = n("usable"), mx = n("maxA"), kg = n("kg");
    if (c && ok("volt")) {
      if (c === "LEAD") { if (!L.leadV.includes(V)) E("volt", `الرصاص الحمضي: ${L.leadV.join(" / ")} فولت فقط`, `Lead-acid must be ${L.leadV.join(" / ")} V`); }
      else if (!inR(V, [...L.smallV, L.lowV, L.highV]))
        E("volt", `الجهد لا يطابق أي فئة: 12/24 (مثل 12.8 أو 25.6) أو ${L.lowV.join("–")} (مثل 51.2) أو ${L.highV.join("–")} فولت`, `Voltage fits no class: 12/24 V (e.g. 12.8 or 25.6), ${L.lowV.join("–")} V (e.g. 51.2) or ${L.highV.join("–")} V`);
    }
    if (c && !e.chem) {
      if ((tg("gel") || tg("agm")) && !tg("lifepo4") && c !== "LEAD") E("chem", "الجل وAGM يجب أن تكون رصاص حمضي", "Gel and AGM must be lead-acid");
      if (tg("lifepo4") && !tg("gel") && !tg("agm") && c !== "LFP") E("chem", "ليثيوم LiFePO4 يجب أن تكون الكيمياء LFP", "LiFePO4 must use LFP chemistry");
    }
    const vt = ["v12-24", "v48", "vhv"].filter(tg);
    if (vt.length === 1 && ok("volt")) {
      const r = { "v12-24": [11, 30], v48: [44, 58], vhv: [100, 800] }[vt[0]];
      if (V < r[0] || V > r[1]) E("volt", `الجهد خارج الفئة المختارة (${r[0]}–${r[1]} فولت)`, `Voltage is outside the selected class (${r[0]}–${r[1]} V)`);
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

  if (set === "panel" && ok("watt") && ok("voc") && ok("isc")) {
    const Wp = n("watt"), ff = Wp / (n("voc") * n("isc"));
    if (ff < 0.6 || ff > 0.92) E("watt", `القدرة لا تتناسب مع Voc × Isc (معامل الملء ${ff.toFixed(2)})`, `Power does not fit Voc × Isc (fill factor ${ff.toFixed(2)})`);
    if (tg("cap-res") && !tg("cap-com") && (Wp < 400 || Wp > 580)) W("watt", "القدرة خارج نطاق السكني 400–580 واط", "Power is outside the residential 400–580 W range");
    if (tg("cap-com") && !tg("cap-res") && Wp < 600) W("watt", "التجاري/الزراعي عادةً 600 واط فأكثر", "Commercial/agricultural panels are usually 600 W or more");
  }

  if (set === "inverter") {
    const kw = n("kw");
    if (tg("ph1") && ok("kw") && kw > 15) E("kw", "العاكس أحادي الطور لا يتجاوز ~15 كيلوواط", "Single-phase inverters do not exceed ~15 kW");
    if (tg("ph3") && ok("kw") && kw < 5) W("kw", "ثلاثي الطور عادةً 10 كيلوواط فأكثر", "Three-phase units are usually 10 kW or more");
    if (ok("phase") && ((tg("ph1") && !tg("ph3") && v.phase === "3") || (tg("ph3") && !tg("ph1") && v.phase === "1"))) E("phase", "الطور لا يطابق النوع المختار", "Phase does not match the selected type");
    if (ok("itype") && ((tg("hybrid") && !tg("ongrid") && !tg("offgrid") && v.itype === "ongrid") || (tg("ongrid") && !tg("hybrid") && !tg("offgrid") && v.itype === "offgrid"))) E("itype", "النوع لا يطابق التصنيف المختار", "Type does not match the selected category");
  }

  if (set === "ctrl" && ok("ctype") && ((tg("mppt") && !tg("pwm") && v.ctype === "pwm") || (tg("pwm") && !tg("mppt") && v.ctype === "mppt")))
    E("ctype", "النوع لا يطابق التصنيف المختار", "Type does not match the selected category");

  if (set === "kit") {
    const kk = n("kitKw"), ka = n("kitA"), iv = n("invKw"), pn = n("panelsN"), pw = n("panelW");
    if (ok("kitA") && ok("kitKw")) { const r = ka * 0.22 / kk; if (r < 0.7 || r > 1.4) E("kitA", `الأمبير لا يطابق الحجم (${ka} A ≈ ${(ka * 0.22).toFixed(1)} kW)`, `Amps do not match the package size (${ka} A ≈ ${(ka * 0.22).toFixed(1)} kW)`); }
    if (ok("invKw") && ok("kitKw") && (iv < kk * 0.8 || iv > kk * 1.3)) E("invKw", "قدرة الانفرتر لا تطابق حجم المنظومة", "Inverter size does not match the package size");
    if (pn > 0 && !(pw > 0)) E("panelW", "أدخل قدرة اللوح", "Enter the panel power");
    if (pn > 0 && pw > 0 && ok("invKw") && pn * pw / 1000 < iv * 0.8) W("panelsN", "قدرة الألواح أقل من الانفرتر", "Panel power is below the inverter size");
    const rng = { kit3: [2.5, 4], kit5: [4, 6.5], kit10: [8, 13] };
    for (const k in rng) if (tg(k) && ok("kitKw") && (kk < rng[k][0] || kk > rng[k][1])) W("kitKw", "الحجم لا يطابق الباقة المختارة", "Size does not match the selected package");
  }

  // soft warnings against similar products already in the catalog
  const med = a => { a = a.filter(x => x > 0).sort((x, y) => x - y); return a.length >= 3 ? a[a.length >> 1] : 0; };
  const per = { battery: "kwh", inverter: "kw", panel: "watt", kit: "kitKw" }[set];
  const chk = (k, d) => {
    if (e[k] || !has(k)) return;
    const g = p => d ? p[k] / p[d] : p[k], x = d ? n(k) / n(d) : n(k), m = med(peers.map(g));
    if (m && x > 0 && (x > m * L.peerFactor || x < m / L.peerFactor)) W(k, "قيمة غير معتادة مقارنةً بمنتجات مشابهة — تحقق منها", "Unusual versus similar products — check this value");
  };
  chk("price", per); chk("warranty");
  if (set === "battery") { chk("cycles"); chk("kg", "kwh"); chk("maxA", "kwh"); }
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
