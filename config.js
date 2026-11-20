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
 { k:"iec62619", label:"IEC 62619", tier:"main", src:"article", ar:"امتحان السلامة الأساسي لبطاريات الليثيوم الثابتة: قصر دائرة وشحن زائد وحرارة عالية، ويراقبون هل تنفجر أو تشتعل.", en:"The core safety exam for stationary lithium batteries: short circuit, overcharge and high heat, checking whether it explodes or catches fire." },
 { k:"iec63056", label:"IEC 63056", tier:"main", src:"article", ar:"امتحان مفصّل لبطاريات تخزين الطاقة المنزلية، أي التي تُركَّب بقرب أهل البيت.", en:"A detailed exam for home energy-storage batteries, the kind installed close to the family." },
 { k:"ul1973", label:"UL 1973", tier:"main", src:"article", ar:"امتحان سلامة أمريكي للبطاريات الثابتة، ويشبه IEC 62619 في الهدف.", en:"An American safety exam for stationary batteries, with the same goal as IEC 62619." },
 { k:"ul9540a", label:"UL 9540A", tier:"main", src:"article", ar:"امتحان الحريق: يشعلون خلية واحدة عمداً ويراقبون هل ينتقل الحريق إلى بقية الخلايا.", en:"The fire exam: one cell is set on fire on purpose to see whether the fire spreads to the other cells." },
 { k:"ul9540", label:"UL 9540", tier:"main", src:"added", ar:"معيار أمريكي لسلامة نظام تخزين الطاقة كاملاً وليس الخلية فقط، ويعتمد عادةً على نتائج UL 9540A.", en:"An American safety standard for the complete energy-storage system, not just the cell. It usually relies on UL 9540A results." },
 { k:"un383", label:"UN38.3", tier:"basic", src:"article", ar:"اختبار للنقل (ارتفاع واهتزاز وصدمات). كل بطارية نظامية تحمله، فوجوده لا يعني أنها ممتازة.", en:"A transport test (altitude, vibration, shocks). Every legitimate battery has it, so having it does not make a battery excellent." },
 { k:"ce", label:"CE", tier:"basic", src:"article", ar:"علامة أوروبية، وغالباً إقرار من الشركة نفسها.", en:"A European mark, often a declaration made by the company itself." },
 { k:"cb", label:"CB", tier:"basic", src:"added", ar:"نظام CB: تقرير اختبار دولي تعترف به دول كثيرة فلا يُعاد الاختبار في كل بلد.", en:"The CB Scheme: an international test report recognised by many countries, so the product is not retested in each one." },
 { k:"iec62477", label:"IEC 62477", tier:"basic", src:"added", ar:"سلامة أجهزة إلكترونيات القدرة مثل العواكس والمحوّلات.", en:"Safety of power-electronics equipment such as inverters and converters." },
 { k:"iec62040", label:"IEC 62040", tier:"basic", src:"added", ar:"معيار أنظمة الطاقة غير المنقطعة (UPS).", en:"The standard for uninterruptible power systems (UPS)." },
 { k:"iec60730", label:"IEC 60730", tier:"basic", src:"added", ar:"معيار أجهزة التحكم الكهربائية الأوتوماتيكية للاستخدام المنزلي (حماية وتحكم).", en:"Standard for automatic electrical controls for household use (protection and control functions)." },
 { k:"emc", label:"EMC", tier:"basic", src:"added", ar:"التوافق الكهرومغناطيسي: الجهاز لا يسبب تشويشاً لغيره ويتحمّل تشويش غيره.", en:"Electromagnetic compatibility: the device does not disturb others and tolerates interference from others." },
 { k:"lvd", label:"LVD", tier:"basic", src:"added", ar:"توجيه الجهد المنخفض الأوروبي: متطلبات السلامة الكهربائية للأجهزة ضمن نطاق جهد معيّن.", en:"The EU Low Voltage Directive: electrical safety requirements for equipment within a certain voltage range." },
 { k:"rohs", label:"RoHS", tier:"basic", src:"article", ar:"يخص المواد الضارة بالبيئة.", en:"Concerns materials that are harmful to the environment." },
 { k:"msds", label:"MSDS", tier:"basic", src:"article", ar:"ورقة معلومات وليست شهادة.", en:"An information sheet, not a certificate." },
 { k:"cec", label:"CEC", tier:"basic", src:"added", ar:"غالباً قائمة لجنة الطاقة في كاليفورنيا (California Energy Commission) للأداء، وليست اختبار حريق. اسأل التاجر ماذا يقصد بها.", en:"Usually a California Energy Commission listing (performance/eligibility), not a fire test. Ask the dealer what it refers to." }
];
/* Example batteries for the guide table. From manufacturer datasheets: the dealer must verify. cell = cells carry it, pack = the battery pack carries it */
CONFIG.examples = [
 { n:"Hithium HeroEE 16", c:{ ul9540a:"cell", ul1973:"cell", iec62619:"cell", un383:"cell", ce:"pack", cb:"pack", iec62040:"pack" } },
 { n:"Pylontech Fidus Plus", c:{ iec62619:1, iec63056:1, un383:1, ce:1 } },
 { n:"Sungrow MBL160", c:{ iec62619:1, iec62477:1, ce:1, un383:1 } }
];
CONFIG.guide = {
 ar:{
  title:"لا تشتري بطارية قبل أن تفهم هذه الأرقام: دليلك لشهادات البطاريات",
  intro:"عندما يقول لك البائع «هذي البطارية عليها شهادات»، هل تعرف ماذا يعني ذلك؟ بعض الشهادات تعني أن البطارية اجتازت **اختبارات قاسية** لحماية بيتك من الحريق، وبعضها **مجرد ورقة شحن**. وفرق كبير بين الاثنين.",
  s1:{ h:"كيف تقرأ هذه الأسماء؟", p:"الحروف هي اسم الجهة التي كتبت الامتحان، والرقم هو رقم الامتحان نفسه، مثل رقم الورقة الامتحانية. فـ **IEC** هي اللجنة الكهروتقنية الدولية، و**UL** مختبرات أمريكية عريقة في اختبار السلامة." },
  s2:{ h:"الامتحانات التي تهمك", items:[
   ["iec62619","**امتحان السلامة الأساسي** لبطاريات الليثيوم الثابتة. يجبرون البطارية على قصر الدائرة والشحن الزائد والحرارة العالية، ويراقبون هل تنفجر أو تشتعل."],
   ["iec63056","امتحان مفصّل لبطاريات **تخزين الطاقة المنزلية**، أي التي تُركَّب بقرب أهل البيت."],
   ["ul1973","امتحان سلامة أمريكي للبطاريات الثابتة، ويشبه IEC 62619 في الهدف."],
   ["ul9540a","**امتحان الحريق.** يشعلون خلية واحدة عمداً ويراقبون هل ينتقل الحريق إلى بقية الخلايا."] ] },
  s3:{ h:"شهادات أقل وزناً", p:"**UN38.3** مثل جواز السفر، فهو اختبار للنقل (ارتفاع واهتزاز وصدمات) وكل بطارية نظامية تحمله، فوجوده لا يعني أنها ممتازة. **CE** علامة أوروبية وغالباً إقرار من الشركة نفسها. **RoHS** يخص المواد الضارة بالبيئة، و**MSDS** ورقة معلومات وليست شهادة." },
  s4:{ h:"انتبه", p:"كلمة «**التصميم متوافق مع**» أضعف من «**حاصلة على شهادة**». وبعض الشركات تنشر قائمة شهادات عامة على موقعها دون ذكر الموديل، فاسأل عن **موديلك تحديداً**. والـ **QR code** سهل التزوير، فاطلب الشهادة نفسها ومعها **اسم المختبر**." },
  s5:{ h:"ثلاثة أمثلة جيدة", note:"(الترتيب حسب الشهادات فقط، ولكل بطارية مزايا وحدود أخرى تجدها في صفحتها)", items:[
   "**Hithium HeroEE 16:** خلاياه UL 9540A وUL 1973 وIEC 62619 وUN38.3، والبطارية CE وCB وIEC 62040. الأكثر شهادات بين الثلاث.",
   "**Pylontech Fidus Plus:** IEC 62619 وIEC 63056 وUN38.3 وCE.",
   "**Sungrow MBL160:** IEC 62619 وIEC 62477 وCE وUN38.3." ] },
  tableNote:"القائمة حسب أوراق بيانات الشركات المصنّعة، وعلى التاجر التحقق منها.",
  final:{ h:"نصيحتنا الأخيرة", p:"ابحث دائماً عن هذه الأربع، **واطلب نسخة الشهادة لموديلك:**", items:[
   ["iec62619","امتحان السلامة الأساسي (قصر دائرة وشحن زائد وحرارة)."],
   ["iec63056","سلامة بطاريات تخزين الطاقة المنزلية."],
   ["ul1973","امتحان سلامة أمريكي للبطاريات الثابتة."],
   ["ul9540a","امتحان انتشار الحريق بين الخلايا."] ] },
  legendH:"كيف نعرض الشهادات في الموقع", glossH:"مصطلحات أخرى قد تراها في صفحات المنتجات"
 },
 en:{
  title:"Don’t Buy a Battery Before You Understand These Numbers: Your Guide to Battery Certifications",
  intro:"When a seller tells you “this battery has certificates,” do you know what that means? Some certificates mean the battery passed **tough tests** that protect your home from fire. Others are **little more than a shipping paper**. There is a big difference between the two.",
  s1:{ h:"How do you read these names?", p:"The letters are the name of the body that wrote the exam, and the number is the number of the exam itself, like the number on an exam paper. **IEC** is the International Electrotechnical Commission, and **UL** is a long-established American laboratory for safety testing." },
  s2:{ h:"The exams that matter", items:[
   ["iec62619","The **core safety exam** for stationary lithium batteries. They force the battery through short circuit, overcharge and high heat, and watch whether it explodes or catches fire."],
   ["iec63056","A detailed exam for **home energy-storage** batteries, the kind installed close to the family."],
   ["ul1973","An American safety exam for stationary batteries, with the same goal as IEC 62619."],
   ["ul9540a","**The fire exam.** They deliberately ignite a single cell and watch whether the fire spreads to the other cells."] ] },
  s3:{ h:"Lighter certificates", p:"**UN38.3** is like a passport: it is a transport test (altitude, vibration and shocks), and every legitimate battery carries it, so having it does not mean the battery is excellent. **CE** is a European mark and is often a declaration made by the company itself. **RoHS** concerns materials harmful to the environment, and **MSDS** is an information sheet, not a certificate." },
  s4:{ h:"Watch out", p:"“**Design complies with**” is weaker than “**holds a certificate**.” Some companies publish a general list of certificates on their website without naming the model, so ask about **your exact model**. A **QR code** is easy to fake, so ask for the certificate itself together with the **name of the laboratory**." },
  s5:{ h:"Three good examples", note:"(Ranked by certificates only; each battery has other strengths and limits you will find on its page.)", items:[
   "**Hithium HeroEE 16:** its cells carry UL 9540A, UL 1973, IEC 62619 and UN38.3, and the battery pack carries CE, CB and IEC 62040. The most certificates of the three.",
   "**Pylontech Fidus Plus:** IEC 62619, IEC 63056, UN38.3 and CE.",
   "**Sungrow MBL160:** IEC 62619, IEC 62477, CE and UN38.3." ] },
  tableNote:"Listed according to the manufacturers’ datasheets; the dealer must verify them.",
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
