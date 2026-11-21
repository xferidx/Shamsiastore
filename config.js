/* ===== ALL SETTINGS + VALIDATION RULES LIVE HERE — edit freely ===== */
const IP = ["IP20","IP21","IP23","IP30","IP31","IP40","IP41","IP42","IP43","IP44","IP45","IP52","IP53","IP54","IP55","IP56","IP57","IP65","IP66","IP67","IP68"];
const CONFIG = {
  firebase: {
    apiKey:"AIzaSyALx9PQ6eBVcBgBjc_fKhbnq91BV5WiGi8",
    authDomain:"noor-88d88.firebaseapp.com",
    projectId:"noor-88d88",
    storageBucket:"noor-88d88.firebasestorage.app",
    messagingSenderId:"1090985815108",
    appId:"1:1090985815108:web:16a770d9236a26aa652011"
  },
  adminUids: ["HMSqWwbh6YMoKU6REIyWz6rqO532"],// Firebase Auth UID(s) of admins
  // Telegram alert to the admin when a new company registers. Leave both empty to turn it off.
  // 1) In Telegram open @BotFather -> /newbot -> copy the token.  2) Send any message to your new bot.
  // 3) Open https://api.telegram.org/bot<TOKEN>/getUpdates and copy "chat":{"id":NUMBER}.
  // Note: this file is public, so anyone could use the token to message YOU. If that happens, revoke it in @BotFather.
  telegram: { token: "9213157732:AAEzgjDhgBaHaOU-E029fC1DOY7tBnwxkks", chatId: "129051601" },
  cities: [["Baghdad","بغداد"],["Basra","البصرة"],["Mosul","الموصل"],["Erbil","أربيل"],["Sulaymaniyah","السليمانية"],["Duhok","دهوك"],["Kirkuk","كركوك"],["Najaf","النجف"],["Karbala","كربلاء"],["Nasiriyah","الناصرية"],["Amarah","العمارة"],["Diwaniyah","الديوانية"],["Hillah","الحلة"],["Kut","الكوت"],["Ramadi","الرمادي"],["Fallujah","الفلوجة"],["Tikrit","تكريت"],["Baqubah","بعقوبة"],["Samawah","السماوة"]],
  brands: ["Pylontech","Huawei","Sungrow","Growatt","Deye","Felicity","Dyness","BYD","Victron","Voltronic","Must","SRNE","Jinko","Longi","Trina","Canadian Solar","JA Solar"],
  limits: {
    cyclesMax: { LFP:15000, NMC:6000, LEAD:3000 },
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
    { k:"warranty", type:"num", ar:"الضمان", en:"Warranty", unit:"yr", better:"hi", max:15 }
  ],
  /* Spec fields per "set". set = battery | inverter | ctrl | panel | mount | acc | kit (see setOf) */
  fields: {
    battery: [
      { k:"chem", type:"sel", ar:"الكيمياء", en:"Chemistry", opts:[["LFP","LFP"],["NMC","NMC"],["LEAD","رصاص حمضي","Lead-acid"]] },
      { k:"volt", type:"num", ar:"الجهد الاسمي", en:"Nominal voltage", unit:"V" },
      { k:"ah", type:"num", ar:"السعة", en:"Capacity", unit:"Ah", better:"hi" },
      { k:"kwh", type:"num", ar:"الطاقة", en:"Energy", unit:"kWh", better:"hi" },
      { k:"usable", type:"num", ar:"الطاقة المفيدة", en:"Usable energy", unit:"kWh", better:"hi" },
      { k:"dod", type:"num", ar:"عمق التفريغ", en:"Depth of discharge", unit:"%", max:100, better:"hi" },
      { k:"contChg", type:"num", ar:"تيار الشحن المستمر", en:"Continuous charge current", unit:"A", better:"hi" },
      { k:"contDis", type:"num", ar:"تيار التفريغ المستمر", en:"Continuous discharge current", unit:"A", better:"hi" },
      { k:"maxA", type:"num", ar:"التيار الأقصى", en:"Max current", unit:"A", better:"hi" },
      { k:"peakA", type:"num", ar:"تيار الذروة", en:"Peak current", unit:"A", better:"hi" },
      { k:"peakSec", type:"num", ar:"مدة تيار الذروة", en:"Peak duration", unit:"s", better:"hi" },
      { k:"cycles", type:"num", ar:"عدد الدورات", en:"Cycle life", better:"hi" },
      { k:"testDoD", type:"num", ar:"ظرف الاختبار: DoD", en:"Cycle test DoD", unit:"%", max:100 },
      { k:"testC", type:"num", ar:"ظرف الاختبار: C-rate", en:"Cycle test C-rate", unit:"C", max:3 },
      { k:"ip", type:"sel", ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", ar:"الوزن", en:"Weight", unit:"kg", better:"lo" },
      { k:"tmin", type:"num", neg:1, ar:"أدنى حرارة تشغيل", en:"Min operating temp", unit:"°C" },
      { k:"tmax", type:"num", neg:1, ar:"أعلى حرارة تشغيل", en:"Max operating temp", unit:"°C" },
      { k:"comm", type:"multi", ar:"الاتصال", en:"Communication", opts:[["CAN"],["RS485"],["RS232"],["Bluetooth"],["WiFi"]] },
      { k:"cooling", type:"sel", ar:"التبريد", en:"Cooling", opts:[["air","هوائي","Air"],["liquid","سائل","Liquid"]] },
      { k:"fire", type:"sel", ar:"إطفاء الحريق", en:"Fire suppression", opts:[["none","بدون","None"],["aerosol","إيروسول مدمج","Built-in aerosol"],["optional","اختياري","Optional"]] },
      { k:"certs", type:"certs", ar:"الشهادات", en:"Certifications" },
      { k:"parallel", type:"num", ar:"أقصى عدد على التوازي", en:"Max units in parallel", better:"hi", max:100 },
      { k:"inverters", type:"txt", ar:"عاكسات يدّعي التاجر توافقها (مفصولة بفاصلة)", en:"Inverters the dealer claims it works with (comma-separated)" }
    ],
    inverter: [
      { k:"itype", type:"sel", ar:"النوع", en:"Type", opts:[["hybrid","هجين","Hybrid"],["ongrid","ربط شبكة","On-grid"],["offgrid","منفصل","Off-grid"],["pump","غطاسات","Pumping"]] },
      { k:"kw", type:"num", ar:"القدرة", en:"Rated power", unit:"kW", better:"hi", max:150 },
      { k:"phase", type:"sel", ar:"الأطوار", en:"Phases", opts:[["1"],["3"]] },
      { k:"mppt", type:"num", ar:"عدد MPPT", en:"MPPT trackers", better:"hi", max:12 },
      { k:"pvVmax", type:"num", ar:"أقصى جهد ألواح", en:"Max PV voltage", unit:"V", max:1500 },
      { k:"battV", type:"num", ar:"جهد البطارية (إن وُجد)", en:"Battery voltage (if any)", unit:"V", max:800 },
      { k:"eff", type:"num", ar:"الكفاءة", en:"Efficiency", unit:"%", max:99.5, better:"hi" },
      { k:"comm", type:"multi", ar:"الاتصال", en:"Communication", opts:[["CAN"],["RS485"],["RS232"],["Bluetooth"],["WiFi"]] },
      { k:"ip", type:"sel", ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", ar:"الوزن", en:"Weight", unit:"kg", better:"lo", max:300 }
    ],
    ctrl: [
      { k:"ctype", type:"sel", ar:"النوع", en:"Type", opts:[["mppt","MPPT"],["pwm","PWM"]] },
      { k:"amps", type:"num", ar:"أقصى تيار شحن", en:"Max charge current", unit:"A", better:"hi", max:200 },
      { k:"pvVmax", type:"num", ar:"أقصى جهد ألواح", en:"Max PV voltage", unit:"V", max:600 },
      { k:"battV", type:"num", ar:"جهد البطارية", en:"Battery voltage", unit:"V", max:120 },
      { k:"eff", type:"num", ar:"الكفاءة", en:"Efficiency", unit:"%", max:99.5, better:"hi" },
      { k:"ip", type:"sel", ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", ar:"الوزن", en:"Weight", unit:"kg", better:"lo", max:30 }
    ],
    panel: [
      { k:"watt", type:"num", ar:"القدرة", en:"Power", unit:"W", better:"hi", max:800 },
      { k:"cell", type:"sel", ar:"نوع الخلية", en:"Cell type", opts:[["topcon","TOPCon"],["perc","PERC"],["hjt","HJT"],["poly","Poly"]] },
      { k:"voc", type:"num", ar:"Voc", en:"Voc", unit:"V", max:60 },
      { k:"isc", type:"num", ar:"Isc", en:"Isc", unit:"A", max:25 },
      { k:"eff", type:"num", ar:"الكفاءة", en:"Efficiency", unit:"%", max:25, better:"hi" },
      { k:"ip", type:"sel", ar:"درجة IP", en:"IP rating", opts: IP.map(x=>[x]) },
      { k:"kg", type:"num", ar:"الوزن", en:"Weight", unit:"kg", better:"lo", max:50 }
    ],
    mount: [
      { k:"material", type:"sel", ar:"الخامة", en:"Material", opts:[["alu","ألمنيوم","Aluminum"],["steel","حديد مجلفن","Galvanized steel"],["inox","ستانلس","Stainless"],["copper","نحاس","Copper"],["plastic","بلاستيك","Plastic"]] },
      { k:"specs", type:"txt", ar:"المواصفات الرئيسية (القياس، الكمية، التحمّل...)", en:"Main specs (size, quantity, rating...)" },
      { k:"mm2", type:"num", ar:"مقطع الكيبل (اختياري)", en:"Cable cross-section (optional)", unit:"mm²", max:300 },
      { k:"ratedV", type:"num", ar:"الجهد المقنّن (اختياري)", en:"Rated voltage (optional)", unit:"V", max:1500 },
      { k:"ratedA", type:"num", ar:"التيار المقنّن (اختياري)", en:"Rated current (optional)", unit:"A", max:2000 }
    ],
    kit: [
      { k:"kitKw", type:"num", ar:"حجم المنظومة", en:"Package size", unit:"kW", better:"hi", max:100 },
      { k:"kitA", type:"num", ar:"الأمبير المدعوم", en:"Supported load", unit:"A", better:"hi", max:500 },
      { k:"invKw", type:"num", ar:"قدرة الانفرتر", en:"Inverter size", unit:"kW", better:"hi", max:150 },
      { k:"panelsN", type:"num", zero:1, ar:"عدد الألواح", en:"Number of panels", better:"hi", max:500 },
      { k:"panelW", type:"num", zero:1, ar:"قدرة اللوح", en:"Panel power", unit:"W", max:800 },
      { k:"batKwh", type:"num", zero:1, ar:"سعة البطاريات", en:"Battery capacity", unit:"kWh", better:"hi", max:500 },
      { k:"includes", type:"txt", ar:"محتويات الباقة", en:"What is included" }
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


/* ===== Certifications: tags, statuses, examples, guide article ===== */
CONFIG.certStatus = [["certified","حاصلة على شهادة","Certified"],["claimed","مُدّعاة","Claimed"],["design","التصميم متوافق فقط","Design-compliant only"]];
/* tier: main | basic.  ar/en = short meaning shown in the tooltip.  src: article = from the guide article, added = short note added by us */
CONFIG.certTags = [
 { k:"iec62619", label:"IEC 62619", tier:"main", src:"article", ar:"امتحان السلامة الأساسي لبطاريات الليثيوم الثابتة (stationary lithium batteries): قصر دائرة (short circuit) وشحن زائد (overcharge) وحرارة عالية، ويراقبون هل تنفجر أو تشتعل.", en:"The core safety exam for stationary lithium batteries: short circuit, overcharge and high heat, checking whether it explodes or catches fire." },
 { k:"iec63056", label:"IEC 63056", tier:"main", src:"article", ar:"امتحان مفصّل لبطاريات تخزين الطاقة المنزلية (home energy storage)، أي التي تُركَّب بقرب أهل البيت.", en:"A detailed exam for home energy-storage batteries, the kind installed close to the family." },
 { k:"ul1973", label:"UL 1973", tier:"main", src:"article", ar:"امتحان سلامة أمريكي للبطاريات الثابتة، ويشبه IEC 62619 في الهدف.", en:"An American safety exam for stationary batteries, with the same goal as IEC 62619." },
 { k:"ul9540a", label:"UL 9540A", tier:"main", src:"article", ar:"طريقة اختبار حريق (fire test method): يشعلون خلية (cell) واحدة عمداً ويسجّلون هل ينتقل الحريق إلى بقية الخلايا. نتيجتها بيانات تُستعمل في تقييم السلامة وليست شهادة نجاح مثل الباقي، فاسأل عن التقرير.", en:"A fire test method: one cell is set on fire on purpose and they record whether the fire spreads to the other cells. It produces data used in safety assessment rather than a pass/fail certificate like the others, so ask for the report." },
 { k:"ul9540", label:"UL 9540", tier:"main", src:"added", ar:"معيار أمريكي لسلامة نظام تخزين الطاقة كاملاً وليس الخلية فقط، ويعتمد عادةً على نتائج UL 9540A.", en:"An American safety standard for the complete energy-storage system, not just the cell. It usually relies on UL 9540A results." },
 { k:"un383", label:"UN38.3", tier:"basic", src:"article", ar:"اختبار للنقل (transport test: ارتفاع واهتزاز وصدمات). كل بطارية نظامية تحمله، فوجوده لا يعني أنها ممتازة.", en:"A transport test (altitude, vibration, shocks). Every legitimate battery has it, so having it does not make a battery excellent." },
 { k:"ce", label:"CE", tier:"basic", src:"article", ar:"علامة أوروبية، وغالباً إقرار من الشركة نفسها.", en:"A European mark, often a declaration made by the company itself." },
 { k:"cb", label:"CB", tier:"basic", src:"added", ar:"نظام CB: تقرير اختبار دولي تعترف به دول كثيرة فلا يُعاد الاختبار في كل بلد.", en:"The CB Scheme: an international test report recognised by many countries, so the product is not retested in each one." },
 { k:"iec62477", label:"IEC 62477", tier:"basic", src:"added", ar:"سلامة أجهزة إلكترونيات القدرة مثل العواكس والمحوّلات.", en:"Safety of power-electronics equipment such as inverters and converters." },
 { k:"iec62040", label:"IEC 62040", tier:"basic", src:"added", ar:"معيار أنظمة الطاقة غير المنقطعة (UPS).", en:"The standard for uninterruptible power systems (UPS)." },
 { k:"iec60730", label:"IEC 60730", tier:"basic", src:"added", ar:"معيار أجهزة التحكم الكهربائية الأوتوماتيكية للاستخدام المنزلي (حماية وتحكم).", en:"Standard for automatic electrical controls for household use (protection and control functions)." },
 { k:"emc", label:"EMC", tier:"basic", src:"added", ar:"التوافق الكهرومغناطيسي: الجهاز لا يسبب تشويشاً لغيره ويتحمّل تشويش غيره.", en:"Electromagnetic compatibility: the device does not disturb others and tolerates interference from others." },
 { k:"lvd", label:"LVD", tier:"basic", src:"added", ar:"توجيه الجهد المنخفض الأوروبي: متطلبات السلامة الكهربائية للأجهزة ضمن نطاق جهد معيّن.", en:"The EU Low Voltage Directive: electrical safety requirements for equipment within a certain voltage range." },
 { k:"rohs", label:"RoHS", tier:"basic", src:"article", ar:"يخص المواد الضارة بالبيئة.", en:"Concerns materials that are harmful to the environment." },
 { k:"msds", label:"MSDS", tier:"basic", src:"article", ar:"ورقة معلومات وليست شهادة.", en:"An information sheet, not a certificate." },
 { k:"cec", label:"CEC", tier:"basic", src:"added", ar:"اختصار يُستعمل لجهتين مختلفتين: مجلس الطاقة النظيفة الأسترالي (Clean Energy Council) أو لجنة الطاقة في كاليفورنيا (California Energy Commission). كلاهما قائمة موافقة للأداء أو الأهلية وليست اختبار حريق. اسأل التاجر أي واحدة يقصد.", en:"An abbreviation used by two different bodies: the Australian Clean Energy Council or the California Energy Commission. Both are approval/eligibility listings, not a fire test. Ask the dealer which one is meant." }
];
/* Example batteries for the guide table. From manufacturer datasheets: the dealer must verify. cell = cells carry it, pack = the battery pack carries it */
CONFIG.examples = [
 { n:"Hithium HeroEE 16", c:{ ul9540a:"cell", ul1973:"cell", iec62619:"both", un383:"both", ce:"pack", cb:"pack", iec62040:"pack" } },
 { n:"Pylontech Fidus Plus", c:{ iec62619:1, iec63056:1, un383:1, ce:1 } },
 { n:"Sungrow MBL160", c:{ iec62619:1, iec62477:1, ce:1, un383:1, msds:1, rohs:1 } }
];

/* ===== Battery Awards 2026 (16 kWh class) — editable data; ranking is computed from these rows =====
   src codes: "sheet" = official datasheet, "reseller" = a seller's page, "ai" = AI-generated summary, null = not listed.
   Only fields with src "sheet" can win an award. Update a row here and the page re-ranks itself. */
CONFIG.awards = {
  year: 2026, asOf: "2026-11",
  weights: { "IEC 62619":2, "IEC 63056":2, "UL 1973":2, "UL 9540":1, "UL 9540-DC":1 },
  rows: [
   { id:"hithium", brand:"Hithium", model:"HeroEE 16", ch:[0,40], dis:[-20,40], cyc:11000, dod:100, crate:0.5, eol:70, ip:"IP30",
     certs:["CE","CB","UN38.3","IEC 62619"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"ورقة بيانات أغسطس 2025. الإصدار الأحدث يذكر شحناً حتى 55°م.", en:"August 2025 datasheet. The newer version lists charging up to 55°C." } },
   { id:"deye", brand:"Deye", model:"SE-F16 (Max)", ch:[0,55], dis:[-20,55], cyc:6000, cycGt:true, dod:null, crate:null, eol:70, ip:"IP65",
     certs:["UN38.3","CE","CB","UL 1973","UL 9540A","UL 9540-DC","FCC"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"من ورقة SE-F16 Max، والشهادات حسب ورقة Max. الشحن من -20°م بتسخين اختياري. عمق التفريغ غير مذكور.", en:"From the SE-F16 Max sheet; certificates as listed for the Max. Charging from -20°C with optional heating. Depth of discharge not stated." } },
   { id:"pylontech", brand:"Pylontech", model:"Fidus Plus FB-L-16", ch:[0,55], dis:[-20,60], cyc:8000, dod:90, crate:0.2, eol:null, ip:"IP65",
     certs:["IEC 62619","IEC 63056","UN38.3","EMC/CE"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"الطراز Pro يشحن من -20 إلى 55°م. الدورات عند شحن 5–95% وتيار 0.2C.", en:"The Pro model charges at -20 to 55°C. Cycles tested at 5–95% charge range and 0.2C." } },
   { id:"solax", brand:"Solax", model:"LD16 / LD16-S", ch:[0,55], dis:[-20,55], cyc:8000, cycGt:true, dod:95, crate:0.5, eol:70, ip:"IP65",
     certs:["IEC 62619","IEC 63056","IEC 60730","UN38.3"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"سطر الشهادات مقطوع في الصورة بعد IEC 60730.", en:"The certificates line is cut off in the photo after IEC 60730." } },
   { id:"dyness-plus", brand:"Dyness", model:"PowerBrick Plus", ch:[0,55], dis:[-20,55], cyc:8000, cycGt:true, dod:95, crate:0.2, eol:70, ip:"IP65",
     certs:["IEC 62619","UN38.3"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"ورقة 20251210. اختبار الدورات بتيار 0.2C وهو أخفّ من 0.5C.", en:"Sheet 20251210. Cycle test at 0.2C, gentler than 0.5C." } },
   { id:"dyness-sc", brand:"Dyness", model:"PowerBrick SC", ch:[0,55], dis:[-20,55], cyc:8000, cycGt:true, dod:95, crate:0.2, eol:70, ip:"IP20",
     certs:["IEC 62619","UN38.3"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"ورقة 20251030. IP20 للتركيب الداخلي فقط.", en:"Sheet 20251030. IP20, indoor only." } },
   { id:"sungrow", brand:"Sungrow", model:"MBL160", ch:[0,55], dis:[-20,55], cyc:8000, dod:90, crate:0.5, eol:null, ip:"IP20",
     certs:["CE","IEC 62619","IEC 62477","UN38.3","MSDS","RoHS"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"ورقة بيانات Sungrow الرسمية (الإصدار 4). اختبار الدورات: عمق تفريغ 90% وتيار 0.5C عند 25°م. للتركيب الداخلي فقط.", en:"Official Sungrow datasheet (version 4). Cycle test: 90% depth of discharge, 0.5C at 25°C. Indoor only." } },
   { id:"chisage", brand:"Chisage", model:"MOON16-G", ch:[0,60], dis:[-20,60], cyc:8000, dod:90, crate:0.5, eol:70, ip:"IP20",
     certs:["IEC 62619","CE-EMC","RoHS","UN38.3"], sHeat:"ai", sLife:"ai", sCert:"ai",
     note:{ ar:"كل الأرقام من ملخص ذكاء اصطناعي، ومصدر آخر يذكر 6000 دورة.", en:"All values come from an AI summary; another source lists 6000 cycles." } },
   { id:"lvtopsun", brand:"LVTOPSUN", model:"LVTS-512314-G4", op:[-20,60], cyc:8000, dod:90, crate:0.5, eol:60, ip:"IP65",
     certs:["UN38.3","CE","CE-EMC","MSDS"], sHeat:"sheet", sLife:"sheet", sCert:"ai",
     note:{ ar:"نطاق تشغيل واحد بلا فصل للشحن. اختبار الدورات ينتهي عند 60% من السعة.", en:"One operating range with no charge/discharge split. Cycle test ends at 60% capacity." } },
   { id:"better", brand:"Better Energy", model:"ELESHELL16K", op:[0,50], cyc:8000, cycGt:true, dod:80, crate:null, eol:null, ip:"IP54",
     certs:["UN38.3","CE-EMC","IEC 62619","MSDS","RoHS"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"نطاق تشغيل واحد، ونهاية العمر غير مذكورة.", en:"One operating range; end-of-life level not stated." } },
   { id:"eve", brand:"EVE", model:"RES-PLW-I-16", ch:[0,60], dis:[-20,60], cyc:null, dod:null, crate:null, eol:null, ip:"IP20",
     certs:["UN38.3"], sHeat:"sheet", sLife:null, sCert:"sheet",
     note:{ ar:"ورقة EVE الرسمية: حرارة الشحن 0–60°م والتفريغ -20–60°م. الشهادة المؤكدة UN38.3 فقط، أما IEC 62619 وCE فمكتوب أن التصميم «متوافق» معها وليس أنها شهادة صادرة. لا يوجد رقم دورات (cycles) في الورقة.", en:"Official EVE sheet: charge 0–60°C, discharge -20–60°C. Only UN38.3 is stated as certified; for IEC 62619 and CE the sheet says the design is \"compliant with\" them, not that a certificate was issued. No cycle count is given in the sheet." } },
   { id:"srne", brand:"SRNE", model:"SR-EOS15B", ch:[0,45], dis:[-10,45], cyc:8000, dod:80, crate:0.5, eol:null, ip:"IP65",
     certs:["UN38.3","MSDS","EN 55032","EN 61000-3-2"], sHeat:"sheet", sLife:"sheet", sCert:"sheet",
     note:{ ar:"لا يذكر معيار سلامة للبطارية مثل IEC 62619.", en:"No battery safety standard such as IEC 62619 is listed." } }
  ],
  text: {
   ar: {
    title:"جوائز البطاريات 2026", sub:"فئة 16 كيلوواط ساعة (16 kWh): الفائز والوصيف",
    notice:"هذه الصفحة جُمعت بالذكاء الاصطناعي بعد بحث معمّق في أوراق البيانات (datasheets) المنشورة. هي ليست اختباراً مخبرياً ولا إعلاناً من أي شركة. الأرقام تتغير حسب إصدار الورقة والسوق، فاطلب من التاجر ورقة بيانات الموديل نفسه.",
    asOf:"حسب أوراق البيانات المتاحة في نوفمبر 2026",
    winner:"الفائز", runner:"الوصيف", tied:"تعادل", jointW:"فائزان بالتساوي",
    heat:{ h:"الأفضل في تحمّل الحرارة", t:"Heat tolerance", d:"نجمع أعلى حرارة شحن (charge) وأعلى حرارة تفريغ (discharge) من ورقة البيانات الرسمية. الشحن في الحر هو الأهم في العراق.", u:"°م (شحن / تفريغ)" },
    life:{ h:"الأطول عمراً", t:"Longest life", d:"عدد الدورات (cycles) × عمق التفريغ (depth of discharge)، أي الدورات الكاملة المعادلة. عند التعادل يفوز من اختُبر بتيار أعلى (C-rate) لأن اختباره أصعب.", u:"دورة كاملة معادلة" },
    cert:{ h:"الأفضل في الشهادات", t:"Certificates", d:"نقاط للمعايير الرئيسية المذكورة في الورقة: IEC 62619 وIEC 63056 وUL 1973 (نقطتان لكل منها) وUL 9540 (نقطة). أما UL 9540A فهي طريقة اختبار حريق وليست شهادة نجاح فلا تُحسب. هذا ترتيب لما هو مكتوب في الورقة وليس حكماً على السلامة.", u:"نقطة" },
    all:"كل الترتيب", how:"كيف حسبنا؟",
    howP:["يدخل الترتيب فقط من لديه رقم مأخوذ من ورقة بيانات رسمية. الأرقام المأخوذة من صفحة تاجر أو ملخص ذكاء اصطناعي تظهر في الجدول بعلامة تنبيه ولا تفوز بأي جائزة.","الدورات الكاملة المعادلة حساب تقريبي (cycles × depth of discharge)، ولا تقارن بين شركات اختبرت بشروط مختلفة بدقة كاملة.","إذا لم يذكر الجدول رقماً فهو غير مذكور في الورقة التي وصلتنا، وليس صفراً."],
    tbl:"الجدول الكامل", cols:["البطارية","حرارة الشحن / التفريغ °م","الدورات (cycles)","IP","الشهادات","ملاحظة"],
    srcLegend:["✓ ورقة بيانات رسمية","⚠ صفحة تاجر","🤖 ملخص ذكاء اصطناعي","— غير مذكور"],
    single:"نطاق واحد", back:"الرئيسية", guide:"دليل الشهادات", empty:"لا يوجد",
    foot:"الأرقام أعلاه من أوراق بيانات الشركات وقد تتغير. تحقّق دائماً من الورقة والشهادة للموديل نفسه قبل الشراء."
   },
   en: {
    title:"Battery Awards 2026", sub:"16 kWh class: winner and runner-up",
    notice:"This page was compiled by AI after deep research in published datasheets. It is not a lab test and not an advertisement from any company. Numbers change with the datasheet version and market, so ask the dealer for the datasheet of the exact model.",
    asOf:"Based on datasheets available in November 2026",
    winner:"Winner", runner:"Runner-up", tied:"Tied", jointW:"Joint winners",
    heat:{ h:"Best heat tolerance", t:"Heat tolerance", d:"We add the highest charge temperature and the highest discharge temperature from the official datasheet. Charging in the heat matters most in Iraq.", u:"°C (charge / discharge)" },
    life:{ h:"Longest life", t:"Longest life", d:"Cycles × depth of discharge, i.e. equivalent full cycles. On a tie, the battery tested at a higher C-rate wins because its test is harder.", u:"equivalent full cycles" },
    cert:{ h:"Best certificates", t:"Certificates", d:"Points for the main standards listed on the sheet: IEC 62619, IEC 63056 and UL 1973 (2 points each) and UL 9540 (1 point). UL 9540A is a fire test method, not a pass/fail certificate, so it is not counted. This ranks what is written on the sheet; it is not a safety verdict.", u:"points" },
    all:"Full ranking", how:"How we calculated",
    howP:["Only batteries with a number taken from an official datasheet can be ranked. Numbers from a reseller page or an AI summary appear in the table with a warning mark and cannot win.","Equivalent full cycles is a rough calculation (cycles × depth of discharge) and does not compare companies that tested under different conditions with full accuracy.","If the table shows no number, it was not stated on the sheet we received. It is not zero."],
    tbl:"Full table", cols:["Battery","Charge / discharge °C","Cycles","IP","Certificates","Note"],
    srcLegend:["✓ official datasheet","⚠ reseller page","🤖 AI summary","— not listed"],
    single:"single range", back:"Home", guide:"Certifications guide", empty:"None",
    foot:"The figures above come from company datasheets and may change. Always check the datasheet and the certificate of the exact model before buying."
   }
  }
};

CONFIG.guide = {
 ar:{
  title:"لا تشتري بطارية قبل أن تفهم هذه الأرقام: دليلك لشهادات ومواصفات البطاريات (Battery Certifications & Specs)",
  intro:"عندما يقول لك البائع «هذي البطارية عليها شهادات»، هل تعرف ماذا يعني ذلك؟ بعض الشهادات تعني أن البطارية اجتازت **اختبارات قاسية** لحماية بيتك من الحريق، وبعضها **مجرد ورقة شحن**. وفرق كبير بين الاثنين.",
  toc:[["certs","الشهادات (Certifications)"],["temp","الحرارة (Temperature)"],["specs","أرقام أخرى (Other specs)"],["ask","أسئلة للبائع (Questions)"]],
  s1:{ h:"كيف تقرأ هذه الأسماء؟", p:"الحروف هي اسم الجهة التي كتبت الامتحان، والرقم هو رقم الامتحان نفسه، مثل رقم الورقة الامتحانية. فـ **IEC** هي اللجنة الكهروتقنية الدولية (International Electrotechnical Commission)، و**UL** مختبرات أمريكية عريقة في اختبار السلامة (safety testing)." },
  s2:{ h:"الامتحانات التي تهمك", items:[
   ["iec62619","**امتحان السلامة الأساسي (core safety test)** لبطاريات الليثيوم الثابتة (stationary lithium batteries). يجبرون البطارية على قصر الدائرة (short circuit) والشحن الزائد (overcharge) والحرارة العالية، ويراقبون هل تنفجر أو تشتعل."],
   ["iec63056","امتحان مفصّل لبطاريات **تخزين الطاقة المنزلية (home energy storage)**، أي التي تُركَّب بقرب أهل البيت."],
   ["ul1973","امتحان سلامة أمريكي للبطاريات الثابتة (stationary batteries)، ويشبه IEC 62619 في الهدف، ويُطلب غالباً في سوق أمريكا الشمالية (North America)، وليس بالضرورة أفضل من IEC."],
   ["ul9540a","**طريقة اختبار حريق (fire test method).** يشعلون خلية (cell) واحدة عمداً ويسجّلون هل ينتقل الحريق إلى بقية الخلايا. نتيجتها بيانات تُستعمل في تقييم السلامة وليست شهادة نجاح مثل الباقي، وهي مرتبطة غالباً بسوق أمريكا الشمالية، فاطلب التقرير."] ] },
  s3:{ h:"شهادات أقل وزناً", p:"**UN38.3** مثل جواز السفر، فهو اختبار للنقل (transport test: ارتفاع واهتزاز وصدمات) وكل بطارية نظامية تحمله، فوجوده لا يعني أنها ممتازة. **CE** علامة أوروبية وغالباً إقرار من الشركة نفسها (self-declaration). **RoHS** يخص المواد الضارة بالبيئة (hazardous substances)، و**MSDS** ورقة معلومات (safety data sheet) وليست شهادة." },
  s4:{ h:"انتبه", p:"كلمة «**التصميم متوافق مع** (design complies with)» أضعف من «**حاصلة على شهادة** (certified)». وبعض الشركات تنشر قائمة شهادات عامة على موقعها دون ذكر الموديل، فاسأل عن **موديلك تحديداً (exact model)**. والـ **QR code** سهل التزوير، فاطلب الشهادة نفسها ومعها **اسم المختبر (lab name)**." },
  s5:{ h:"كيف تعرض أوراق البيانات (datasheets) شهاداتها: ثلاثة أمثلة", note:"عدد الشهادات الأكثر لا يعني بطارية أفضل. الشهادات تختلف حسب السوق (market) وحسب إصدار ورقة البيانات، وبعضها للخلية (cell) وبعضها للبطارية كاملة (pack). مثلاً شهادات UL أمريكية الاتجاه، بينما IEC وCE أوروبية ودولية، وهي ليست بالضرورة أفضل للعراق.", items:[] },
  tableNote:"من أوراق بيانات الشركات المصنّعة (datasheets) المتاحة علناً وقت الكتابة، وقد تتغير حسب الإصدار والسوق. على التاجر إظهار ورقة البيانات وشهادة الموديل نفسه واسم المختبر (lab).",
  more:[
   { id:"temp", icon:"🌡️", h:"الحرارة (Temperature): الرقم الذي يتجاهله أغلب الناس", blocks:[
    {t:"p",x:"ورقة المواصفات (datasheet) فيها **ثلاثة أرقام للحرارة**، وكثير من الناس ينتبه لرقم واحد فقط:"},
    {t:"ul",x:["**حرارة التفريغ أو التشغيل (discharge / operating temperature):** المدى الذي تشتغل فيه البطارية وهي تعطي كهرباء، مثلاً من -20 إلى 55°م.","**حرارة الشحن (charge temperature):** غالباً **أضيق** من التفريغ، مثلاً من 0 إلى 45°م. وهذا **أهم رقم**.","**حرارة التخزين (storage temperature):** وهي مطفأة."]},
    {t:"h3",x:"لماذا حرارة الشحن مهمة؟"},
    {t:"p",x:"شحن بطارية الليثيوم (LFP) وهي **تحت الصفر المئوي** يتلفها بشكل دائم، وقد يضر بسلامتها. لذلك بعض البطاريات فيها **سخان داخلي (internal heater)**، وبعضها يوقف الشحن تلقائياً. إذا ورقة المواصفات تذكر مدى واحداً فقط، اسأل البائع عن حرارة الشحن بالتحديد."},
    {t:"h3",x:"في العراق الحرارة العالية هي الخطر الأكبر"},
    {t:"p",x:"البطارية نفسها تسخن عند الشحن والتفريغ القويين، وإذا وضعتها في غرفة مغلقة أو تحت الشمس أو قرب المولدة تتجاوز الحد بسهولة. وهذا يحصل:"},
    {t:"ul",x:["أولاً يخفّض نظام الحماية (**BMS**: Battery Management System) القدرة (derating)، ثم يفصل البطارية، وغالباً في وقت الذروة.","الحرارة العالية المستمرة **تقصّر عمر البطارية**. القاعدة التقريبية أن كل زيادة 10°م فوق 25°م تسرّع التقادم إلى الضعف تقريباً، وأرقام عدد الدورات (cycle life) في الأوراق تُقاس غالباً عند حوالي 25°م.","في الشمال وبعض مناطق الصحراء، ليالي الشتاء قد تقترب من الصفر أو تنزل تحته، فانتبه لحرارة الشحن إذا ركّبتها خارج البيت."]},
    {t:"tip",x:"**نصيحتنا:** ركّب البطارية في مكان **مظلل وجيد التهوية**، بعيداً عن الشمس والمولدة، واسأل: هل الرقم المكتوب هو حرارة الجو أم حرارة الخلايا (cell temperature)؟ ماذا يحصل إذا تجاوزتها: تخفيض القدرة (derating) أم فصل (shutdown)؟ هل فيها تبريد (cooling) هوائي أو سائل، أو سخان (heater)؟"},
    {t:"p",x:"و**درجة الحماية IP65 لا تعني أن البطارية تتحمل الحرارة.** هذا يخص الغبار والماء فقط."},
    {t:"h3",x:"وماذا لو كانت البطارية تشحن وتفرغ بنفس الوقت؟"},
    {t:"p",x:"الواقع أن البطارية لا تفعل الاثنين في اللحظة نفسها، فلها طرفان فقط، والتيار يمشي باتجاه واحد. في نظام الطاقة الشمسية يرسل الانفرتر (inverter) كهرباء الألواح إلى الأحمال (loads) أولاً، وما يزيد يدخل البطارية، وإذا احتاجت الأحمال أكثر مما تعطيه الألواح تعطي البطارية الفرق."},
    {t:"ul",x:["ألواح 5 كيلوواط وأحمال 3 كيلوواط: البطارية **تشحن (charge)** بـ2 كيلوواط.","ألواح 1 كيلوواط وأحمال 3 كيلوواط: البطارية **تفرغ (discharge)** بـ2 كيلوواط."]},
    {t:"p",x:"ونظام الحماية (BMS) يطبّق حدود الاتجاه الذي يمشي فيه التيار وقتها. فاعتمد على **حرارة الشحن** لأنها الأضيق: عند الظهر في الصيف قد تتجاوز البطارية حدّ الشحن فيُقطع الشحن وتضيع كهرباء الألواح وقت الذروة، وفي صباح الشتاء البارد قد يمنع الشحن حتى تدفأ. وبعض الأوراق تذكر تياراً أقل مسموحاً بالشحن عند البرد، فاسأل عنه."} ] },
   { id:"specs", icon:"📊", h:"بقية الأرقام التي تستحق النظر (Other specs worth checking)", blocks:[
    {t:"h3",x:"1. السعة (capacity): الاسمية (nominal) غير المفيدة (usable)"},
    {t:"p",x:"فكّر في **خزان ماء**. المكتوب عليه 1000 لتر هو **السعة الاسمية (nominal capacity)**، أي الرقم الذي تكتبه الشركة على الورقة. لكن آخر جزء في الخزان لا يخرج من الصنبور، فالماء الذي تستعمله فعلاً أقل، وهذا هو **السعة المفيدة (usable capacity)**."},
    {t:"p",x:"البطارية مثله: بطارية مكتوب عليها **10 kWh** (اسمية)، ونظام الحماية لا يسمح بتفريغ أكثر من 90% منها، وهذه النسبة اسمها **عمق التفريغ (DoD: Depth of Discharge)**. فالمفيد = 10 × 90% = **9 kWh**. والرقم الاسمي يُقاس في المختبر على بطارية جديدة وحرارة حوالي 25°م وتيار هادئ، فقد تعطيك في الواقع أقل قليلاً إذا كانت قديمة أو حارة أو باردة."},
    {t:"tip",x:"**القاعدة:** احسب بيتك على **المفيدة (usable)** دائماً، وليس على الاسمية."},
    {t:"p",x:"وانتبه لوحدة القياس: **الأمبير-ساعة (Ah)** وحدها لا تكفي لأنها لا تذكر الجهد (voltage). قارن بالـ **كيلوواط-ساعة (kWh)** وهي الطاقة الحقيقية: الجهد × الأمبير-ساعة ÷ 1000. فبطارية **100Ah على 51.2 فولت** = **5.12 kWh**، أما **100Ah على 12 فولت** = **1.2 kWh** فقط."},
    {t:"h3",x:"2. عدد الدورات (cycle life): بأي شروط؟"},
    {t:"p",x:"«6000 دورة» بلا شروط كلام بلا قيمة. اسأل: عند أي **عمق تفريغ (DoD)**، وبأي **سرعة شحن (C-rate)**، وعند أي **حرارة (temperature)**، وحتى أي سعة تُعتبر البطارية منتهية (end of life)، غالباً 80%؟"},
    {t:"h3",x:"3. سرعة الشحن والتفريغ (C-rate)"},
    {t:"p",x:"الـ **C-rate** يقول **بأي سرعة** تشحن البطارية أو تفرغها، نسبة إلى حجمها."},
    {t:"ul",x:["**1C**: تفرغ البطارية كلها في **ساعة واحدة**.","**0.5C**: في **ساعتين**.","**2C**: في **نصف ساعة**."]},
    {t:"p",x:"والقدرة (power) = السعة (kWh) × الـ C-rate. فبطارية **10 kWh**: عند 0.5C تعطي **5 kW**، وعند 1C تعطي **10 kW**. وبطارية 100Ah عند 0.5C = 50 أمبير."},
    {t:"tip",x:"**مثال:** بطارية 5 kWh وحِملك 5 kW طوال الوقت. إذا كانت تتحمل 0.5C مستمراً فهي تعطي 2.5 kW فقط، فتحتاج **بطاريتين**. وإذا كانت تتحمل 1C مستمراً تكفيك واحدة."},
    {t:"p",x:"كلما زادت السرعة سخنت البطارية أكثر وقصر عمرها قليلاً، ولهذا تُكتب أرقام الدورات مع شرط مثل «0.5C»."},
    {t:"h3",x:"4. الضمان (warranty): السنوات وحدها لا تكفي"},
    {t:"p",x:"اسأل عن ثلاثة أشياء:"},
    {t:"ul",x:["**كم طاقة إجمالية (total energy throughput)** مشمولة بالضمان؟ كثير من الضمانات تنتهي بالسنوات أو بعدد معين من kWh، أيهما أسبق.","**كم تبقى من السعة (remaining capacity)** في نهاية الضمان (مثلاً 70%)؟","**من ينفذ الضمان هنا في العراق**: التاجر أو الوكيل (agent)، أو الشركة الأم في الخارج؟ واطلب الشروط مكتوبة، لأن بعض الضمانات تُلغى إذا تجاوزت الحرارة حدّها أو إذا لم يركّبها فنّي معتمد."]},
    {t:"h3",x:"5. التيار والقدرة (current & power): المستمر وليس الأعلى فقط"},
    {t:"p",x:"انظر إلى **تيار التفريغ المستمر (continuous discharge current)**، وهو ما تعطيه البطارية طوال الوقت. أما **تيار الذروة (peak current)** فيدوم ثوانٍ فقط، مثل لحظة تشغيل ضاغط المكيف. تأكد أن تيار البطارية المستمر **يكفي الانفرتر (inverter)** الذي ستركّبه."},
    {t:"h3",x:"6. الجهد والتوافق مع الانفرتر (voltage & compatibility)"},
    {t:"p",x:"البطارية 48 فولت (أو 51.2 لليثيوم LFP) تعمل مع انفرتر 48 فولت، أما الجهد العالي (HV: High Voltage) فله انفرترات خاصة. وتأكد من **بروتوكول الاتصال (communication protocol)** مثل CAN أو RS485 ومن أن موديل الانفرتر مدعوم. التوافق «المعلن» من التاجر ليس ضماناً، فاطلب أن يثبته لك."},
    {t:"h3",x:"7. الكفاءة (round-trip efficiency)"},
    {t:"p",x:"كل بطارية تضيع جزءاً من الطاقة عند الشحن والتفريغ. البطاريات الجيدة تعطي غالباً أكثر من 90% من الطاقة التي دخلتها."},
    {t:"h3",x:"8. درجة الحماية IP (Ingress Protection): الغبار مهم في العراق"},
    {t:"p",x:"IP20 للداخل فقط. وIP65 يعني حماية كاملة من الغبار (dust) وحماية من نفثات الماء الخفيفة (water jets). حتى مع IP65، ابقِ البطارية في الظل."} ] },
   { id:"lead", icon:"🔋", h:"بطاريات الجل والرصاص الحمضي (Gel & lead-acid batteries)", blocks:[
    {t:"p",x:"لهذه البطاريات قواعد أخرى: عادةً **تستعمل نصف سعتها فقط** (حوالي 50%) حتى تعيش طويلاً، وعدد دوراتها (cycle life) أقل بكثير من الليثيوم. فاحسب على **الطاقة المفيدة (usable energy)** وليس على السعة المكتوبة."} ] },
   { id:"ask", cls:"askbox", icon:"❓", h:"أسئلة جاهزة تسألها للبائع (Questions to ask the seller)", blocks:[
    {t:"ol",x:["ما هو **موديلي بالتحديد (exact model)**، وأين **ورقة بياناته (datasheet)**؟","ما هي **شهاداته (certifications)**، وهل عندك **نسخة منها مع اسم المختبر (lab name)**؟","ما هو **مدى حرارة الشحن (charge temperature)**، وهل يتغير مع تيار الشحن، وماذا يحصل عند الحرارة العالية؟","كم **الطاقة المفيدة (usable energy)** بالـ kWh، وكم **التيار المستمر (continuous current)** أو الـ C-rate المستمر؟","كم **دورة (cycles)**، وبأي شروط (عمق التفريغ DoD وسرعة الشحن C-rate والحرارة)؟","كم **سنة ضمان (warranty)**، وكم **kWh إجمالية**، وكم **السعة المتبقية** في نهاية الضمان؟","**من ينفذ الضمان في العراق**، وما شروطه؟","هل هو **متوافق مع الانفرتر (inverter)** الذي سأركّبه، وهل تثبت ذلك؟"]} ] }
  ],
  final:{ h:"نصيحتنا الأخيرة", p:"ابحث دائماً عن هذه الأربع، **واطلب نسخة الشهادة (certificate copy) لموديلك:**", items:[
   ["iec62619","امتحان السلامة الأساسي (core safety test): قصر دائرة وشحن زائد وحرارة."],
   ["iec63056","سلامة بطاريات تخزين الطاقة المنزلية (home energy storage)."],
   ["ul1973","امتحان سلامة أمريكي للبطاريات الثابتة (stationary batteries)."],
   ["ul9540a","امتحان انتشار الحريق بين الخلايا (fire propagation)."] ] },
  legendH:"كيف نعرض الشهادات في الموقع", glossH:"مصطلحات أخرى قد تراها في صفحات المنتجات"
 },
 en:{
  title:"Don’t Buy a Battery Before You Understand These Numbers: Your Guide to Battery Certifications and Specs",
  intro:"When a seller tells you “this battery has certificates,” do you know what that means? Some certificates mean the battery passed **tough tests** that protect your home from fire. Others are **little more than a shipping paper**. There is a big difference between the two.",
  toc:[["certs","Certifications"],["temp","Temperature"],["specs","Other specs"],["ask","Questions for the seller"]],
  s1:{ h:"How do you read these names?", p:"The letters are the name of the body that wrote the exam, and the number is the number of the exam itself, like the number on an exam paper. **IEC** is the International Electrotechnical Commission, and **UL** is a long-established American laboratory for safety testing." },
  s2:{ h:"The exams that matter", items:[
   ["iec62619","The **core safety exam** for stationary lithium batteries. They force the battery through short circuit, overcharge and high heat, and watch whether it explodes or catches fire."],
   ["iec63056","A detailed exam for **home energy-storage** batteries, the kind installed close to the family."],
   ["ul1973","An American safety exam for stationary batteries, with the same goal as IEC 62619. It is mostly asked for in the North American market and is not automatically better than IEC."],
   ["ul9540a","**A fire test method.** They deliberately ignite a single cell and record whether the fire spreads to the other cells. It produces data used in safety assessment rather than a pass/fail certificate like the others, and is mostly tied to the North American market, so ask for the report."] ] },
  s3:{ h:"Lighter certificates", p:"**UN38.3** is like a passport: it is a transport test (altitude, vibration and shocks), and every legitimate battery carries it, so having it does not mean the battery is excellent. **CE** is a European mark and is often a declaration made by the company itself. **RoHS** concerns materials harmful to the environment, and **MSDS** is an information sheet, not a certificate." },
  s4:{ h:"Watch out", p:"“**Design complies with**” is weaker than “**holds a certificate**.” Some companies publish a general list of certificates on their website without naming the model, so ask about **your exact model**. A **QR code** is easy to fake, so ask for the certificate itself together with the **name of the laboratory**." },
  s5:{ h:"How datasheets list their certificates: three examples", note:"More certificates does not mean a better battery. Certificates differ by market and by datasheet version, and some belong to the cell while others belong to the complete pack. For example, UL certificates are North-American driven, while IEC and CE are European and international, and not automatically better for Iraq.", items:[] },
  tableNote:"From manufacturers’ publicly available datasheets at the time of writing; they may change by version and market. The dealer must show the datasheet, the certificate for the exact model and the lab name.",
  more:[
   { id:"temp", icon:"🌡️", h:"Temperature: The Number Most People Ignore", blocks:[
    {t:"p",x:"The **datasheet** lists **three temperature numbers**, and many people look at only one of them:"},
    {t:"ul",x:["**Discharge / operating temperature:** the range in which the battery works while it is delivering power, for example -20 to 55°C.","**Charge temperature:** usually **narrower** than the discharge range, for example 0 to 45°C. This is the **most important number**.","**Storage temperature:** the range while the battery is switched off."]},
    {t:"h3",x:"Why does charge temperature matter?"},
    {t:"p",x:"Charging a lithium battery (LFP) **below freezing** damages it permanently and can affect its safety. That is why some batteries have an **internal heater** and others stop charging automatically. If the datasheet gives only one range, ask the seller specifically about the charge temperature."},
    {t:"h3",x:"In Iraq, high heat is the biggest danger"},
    {t:"p",x:"The battery itself heats up under strong charging and discharging, and if you put it in a closed room, in the sun or near the generator, it passes its limit easily. When that happens:"},
    {t:"ul",x:["First the protection system (**BMS**, Battery Management System) reduces the power (derating), then it disconnects the battery, often at peak time.","Constant high heat **shortens the battery’s life**. As a rough rule, every 10°C above 25°C makes ageing roughly twice as fast, and the cycle-life numbers on datasheets are usually measured at around 25°C.","In the north and some desert areas, winter nights can approach zero or fall below it, so watch the charge temperature if you install the battery outdoors."]},
    {t:"tip",x:"**Our advice:** install the battery in a **shaded, well-ventilated place**, away from the sun and the generator, and ask: is the printed number the air temperature or the cell temperature? What happens if you exceed it: power reduction (derating) or shutdown? Does it have cooling (air or liquid), or a heater?"},
    {t:"p",x:"And **an IP65 rating does not mean the battery tolerates heat.** It only concerns dust and water."},
    {t:"h3",x:"What if the battery is charging and discharging at the same time?"},
    {t:"p",x:"In reality a battery does not do both at the same instant: it has only two terminals, and current flows in one direction. In a solar system the inverter sends the panels’ power to the loads first, and whatever is left over goes into the battery; if the loads need more than the panels give, the battery supplies the difference."},
    {t:"ul",x:["5 kW of panels and 3 kW of loads: the battery **charges** at 2 kW.","1 kW of panels and 3 kW of loads: the battery **discharges** at 2 kW."]},
    {t:"p",x:"The protection system (BMS) applies the limits of whichever direction the current is flowing at that moment. So rely on the **charge temperature**, because it is the narrower one: at midday in summer the battery may pass its charging limit, so charging is cut and the panels’ power is wasted at peak time, and on a cold winter morning charging may be blocked until the battery warms up. Some datasheets also state a lower allowed charging current in cold weather, so ask about it."} ] },
   { id:"specs", icon:"📊", h:"Other Specs Worth Checking", blocks:[
    {t:"h3",x:"1. Capacity: nominal vs. usable"},
    {t:"p",x:"Think of a **water tank**. The 1000 litres written on it is the **nominal capacity**: the number the company prints on the paper. But the last part of the tank does not come out of the tap, so the water you really use is less. That is the **usable capacity**."},
    {t:"p",x:"A battery works the same way. Take a battery labelled **10 kWh** (nominal) whose protection system does not allow more than 90% of it to be discharged; that percentage is called the **depth of discharge (DoD)**. So the usable energy = 10 × 90% = **9 kWh**. The nominal number is measured in a lab on a new battery at about 25°C with a gentle current, so in real life you may get a little less if the battery is old, hot or cold."},
    {t:"tip",x:"**The rule:** always size your home on the **usable** capacity, never on the nominal one."},
    {t:"p",x:"Also watch the unit: **amp-hours (Ah)** alone are not enough because they do not mention the voltage. Compare in **kilowatt-hours (kWh)**, the real energy: voltage × amp-hours ÷ 1000. A **100Ah battery at 51.2 volts** = **5.12 kWh**, while **100Ah at 12 volts** = only **1.2 kWh**."},
    {t:"h3",x:"2. Cycle life: under what conditions?"},
    {t:"p",x:"“6000 cycles” without conditions means nothing. Ask: at what **depth of discharge (DoD)**, at what **charge rate (C-rate)**, at what **temperature**, and down to what capacity is the battery considered finished (end of life), usually 80%?"},
    {t:"h3",x:"3. Charge and discharge speed (C-rate)"},
    {t:"p",x:"The **C-rate** says **how fast** a battery is charged or discharged, relative to its size."},
    {t:"ul",x:["**1C**: the whole battery is discharged in **one hour**.","**0.5C**: in **two hours**.","**2C**: in **half an hour**."]},
    {t:"p",x:"And power = capacity (kWh) × C-rate. So a **10 kWh** battery delivers **5 kW** at 0.5C and **10 kW** at 1C. A 100Ah battery at 0.5C = 50 amps."},
    {t:"tip",x:"**Example:** a 5 kWh battery and a constant 5 kW load. If the battery can sustain 0.5C continuously it delivers only 2.5 kW, so you need **two batteries**. If it can sustain 1C continuously, one is enough."},
    {t:"p",x:"The faster the speed, the hotter the battery gets and the slightly shorter its life, which is why cycle numbers are written with a condition such as “0.5C”."},
    {t:"h3",x:"4. Warranty: years alone are not enough"},
    {t:"p",x:"Ask about three things:"},
    {t:"ul",x:["**How much total energy (throughput)** is covered by the warranty? Many warranties end at a number of years or a number of kWh, whichever comes first.","**How much capacity remains** at the end of the warranty (for example 70%)?","**Who honours the warranty here in Iraq**: the dealer or the agent, or the parent company abroad? Ask for the terms in writing, because some warranties are void if the temperature limit is exceeded or if the battery was not installed by a qualified technician."]},
    {t:"h3",x:"5. Current and power: continuous, not just the maximum"},
    {t:"p",x:"Look at the **continuous discharge current**, which is what the battery delivers all the time. The **peak current** lasts only seconds, like the moment an air-conditioner compressor starts. Make sure the battery’s continuous current is **enough for the inverter** you will install."},
    {t:"h3",x:"6. Voltage and inverter compatibility"},
    {t:"p",x:"A 48-volt battery (or 51.2 volts for lithium LFP) works with a 48-volt inverter, while high voltage (HV) needs special inverters. Also check the **communication protocol** (CAN or RS485) and that your inverter model is supported. A compatibility “claimed” by the dealer is not a guarantee, so ask him to prove it."},
    {t:"h3",x:"7. Efficiency (round-trip)"},
    {t:"p",x:"Every battery loses some energy when charging and discharging. Good batteries usually give back more than 90% of the energy that went in."},
    {t:"h3",x:"8. IP rating: dust matters in Iraq"},
    {t:"p",x:"IP20 is for indoor use only. IP65 means full protection against dust (important in dust storms) and protection against light water jets. Even with IP65, keep the battery in the shade."} ] },
   { id:"lead", icon:"🔋", h:"Gel and Lead-Acid Batteries", blocks:[
    {t:"p",x:"These batteries follow other rules: they usually **use only half of their capacity** (about 50%) to live long, and their cycle life is far lower than lithium. So calculate on the **usable energy**, not on the printed capacity."} ] },
   { id:"ask", cls:"askbox", icon:"❓", h:"Ready Questions to Ask the Seller", blocks:[
    {t:"ol",x:["What is **my exact model**, and where is its **datasheet**?","What are its **certifications**, and do you have **a copy with the lab’s name**?","What is the **charge temperature range**, does it change with the charging current, and what happens in high heat?","What is the **usable energy** in kWh, and what is the **continuous current** or continuous C-rate?","How many **cycles**, and under what conditions (depth of discharge, C-rate and temperature)?","How many **years of warranty**, how many **total kWh**, and how much **capacity remains** at the end of the warranty?","**Who honours the warranty in Iraq**, and under what terms?","Is it **compatible with the inverter** I will install, and can you prove it?"]} ] }
  ],
  final:{ h:"Our final advice", p:"Always look for these four, **and ask for a copy of the certificate for your model:**", items:[
   ["iec62619","The core safety exam (short circuit, overcharge and heat)."],
   ["iec63056","Safety of home energy-storage batteries."],
   ["ul1973","An American safety exam for stationary batteries."],
   ["ul9540a","The exam for fire spreading between cells."] ] },
  legendH:"How certificates are shown on this site", glossH:"Other abbreviations you may see on product pages"
 }
};

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
  if (Array.isArray(v.certs)) for (const c of v.certs) {
    const T = CONFIG.certTags.find(x => x.k === c.k), nm = T ? T.label : c.k;
    if (!c.st) E("certs", `اختر حالة الشهادة «${nm}»`, `Pick a status for “${nm}”`);
    else if (c.st === "certified" && !c.lab) E("certs", `الشهادة «${nm}»: اكتب اسم المختبر`, `“${nm}”: enter the lab name`);
    else if (c.st === "certified" && !c.hasImg) E("certs", `الشهادة «${nm}»: ارفع صورة الشهادة`, `“${nm}”: upload the certificate image`);
  }

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
    if (ok("cycles") && (!has("testDoD") || !has("testC"))) E(has("testDoD") ? "testC" : "testDoD", "اذكر ظروف اختبار عدد الدورات (DoD و C-rate)", "State the cycle-life test condition (DoD and C-rate)");
    if (has("peakA") && !has("peakSec")) W("peakSec", "اذكر مدة تيار الذروة", "State the peak-current duration");
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
      && request.resource.data.get('certOk',[]).size()==0
      && (admin() || get(/databases/$(d)/documents/users/$(request.auth.uid)).data.approved==true);
    allow delete: if admin() || resource.data.ownerId==request.auth.uid;
    allow update: if admin() || (resource.data.ownerId==request.auth.uid && request.resource.data.ownerId==resource.data.ownerId
      && (request.resource.data.verified==resource.data.verified || request.resource.data.verified==false)
      && (request.resource.data.dsOk==resource.data.dsOk || request.resource.data.dsOk==false)
      && request.resource.data.get('certOk',[]).hasOnly(resource.data.get('certOk',[])));
  }
  match /stats/{s} {
    allow read: if request.auth != null && (resource.data.oid==request.auth.uid || admin());
    allow create: if request.resource.data.keys().hasOnly(['pid','oid','day','views','wa','call','map'])
      && request.resource.data.pid is string && request.resource.data.oid is string && request.resource.data.day is string
      && s == request.resource.data.pid + '_' + request.resource.data.day
      && request.resource.data.get('views',0) <= 1 && request.resource.data.get('wa',0) <= 1
      && request.resource.data.get('call',0) <= 1 && request.resource.data.get('map',0) <= 1
      && (request.resource.data.pid == 'd-' + request.resource.data.oid
          || get(/databases/$(d)/documents/products/$(request.resource.data.pid)).data.ownerId == request.resource.data.oid);
    allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views','wa','call','map'])
      && request.resource.data.get('views',0) - resource.data.get('views',0) <= 1
      && request.resource.data.get('wa',0) - resource.data.get('wa',0) <= 1
      && request.resource.data.get('call',0) - resource.data.get('call',0) <= 1
      && request.resource.data.get('map',0) - resource.data.get('map',0) <= 1;
  }
  match /certs/{id} {
    allow read: if resource.data.approved==true || (request.auth!=null && (resource.data.ownerId==request.auth.uid || admin()));
    allow create: if request.auth!=null && request.resource.data.ownerId==request.auth.uid && request.resource.data.approved==false
      && get(/databases/$(d)/documents/products/$(request.resource.data.pid)).data.ownerId==request.auth.uid;
    allow update: if admin() || (request.auth!=null && resource.data.ownerId==request.auth.uid
      && request.resource.data.ownerId==resource.data.ownerId && request.resource.data.approved==false);
    allow delete: if admin() || (request.auth!=null && resource.data.ownerId==request.auth.uid);
  }
  match /photos/{p} {
    allow read: if true;
    allow create: if request.auth!=null && request.resource.data.ownerId==request.auth.uid
      && get(/databases/$(d)/documents/products/$(p)).data.ownerId==request.auth.uid;
    allow update, delete: if admin() || resource.data.ownerId==request.auth.uid;
  }
}}
*/
