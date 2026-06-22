import { AwarenessArticle } from '@/types'

export const AWARENESS_ARTICLES: AwarenessArticle[] = [
  {
    id: 'anaemia-signs',
    category: 'anaemia',
    tone: 'red',
    title: {
      hi: 'खून की कमी के 5 जरूरी संकेत',
      en: '5 Signs of Anaemia You Shouldn\'t Ignore',
    },
    summary: {
      hi: 'थकान, पीली आंखें, सांस फूलना — ये संकेत खून की कमी की तरफ इशारा कर सकते हैं।',
      en: 'Fatigue, pale eyes, and shortness of breath may be signs of low haemoglobin.',
    },
    readTimeMinutes: 3,
    level: 'beginner',
    icon: 'Droplets',
    content: {
      hi: [
        'खून में हीमोग्लोबिन की कमी को एनीमिया कहते हैं।',
        'महिलाओं में ये बहुत आम है और गर्भावस्था में ज्यादा खतरनाक हो सकता है।',
        'पहचानें इन लक्षणों को: हमेशा थकान महसूस होना, थोड़ा काम करने पर सांस फूलना, त्वचा या आंखों का पीला पड़ना।',
        'अगर आपको इनमें से कोई भी लक्षण है, तो पास के स्वास्थ्य केंद्र (PHC) में अपना खून चेक कराएं।',
      ],
      en: [
        'Anaemia means your blood has low haemoglobin levels.',
        'It is very common in women and can be dangerous during pregnancy.',
        'Recognize these symptoms: constant fatigue, shortness of breath on mild exertion, pale skin or eyes.',
        'If you have any of these symptoms, get a blood test at your nearest PHC.',
      ],
    },
  },
  {
    id: 'iron-foods',
    category: 'nutrition',
    tone: 'green',
    title: {
      hi: 'आयरन बढ़ाने वाले 5 सस्ते खाद्य पदार्थ',
      en: '5 Affordable Iron-Rich Foods',
    },
    summary: {
      hi: 'गुड़, चना, पालक — जानिए कैसे आप अपने रोज़ के खाने से खून बढ़ा सकते हैं।',
      en: 'Jaggery, chickpeas, spinach — learn how to increase your iron through daily meals.',
    },
    readTimeMinutes: 2,
    level: 'beginner',
    icon: 'Apple',
    content: {
      hi: [
        'खून बढ़ाने के लिए महंगी दवाइयों की ज़रूरत नहीं है, सही खाना काफी है।',
        '1. गुड़ और चना: ये सबसे सस्ता और बेहतरीन स्नैक है।',
        '2. पालक और मेथी: हरी पत्तेदार सब्जियों में आयरन भरपूर होता है।',
        '3. नीबू या आंवला: खाने के साथ विटामिन-सी (जैसे नीबू) लेने से शरीर आयरन को बेहतर सोखता है।',
      ],
      en: [
        'You don\'t always need expensive medicines to increase iron, the right food is enough.',
        '1. Jaggery and Chickpeas: This is the cheapest and best snack.',
        '2. Spinach and Fenugreek: Green leafy vegetables are rich in iron.',
        '3. Lemon or Amla: Taking Vitamin-C (like lemon) with meals helps the body absorb iron better.',
      ],
    },
  },
  {
    id: 'pregnancy-nutrition',
    category: 'pregnancy',
    tone: 'pink',
    title: {
      hi: 'गर्भावस्था में क्या खाएं?',
      en: 'What to Eat During Pregnancy?',
    },
    summary: {
      hi: 'माँ और बच्चे के सही विकास के लिए ज़रूरी आहार।',
      en: 'Essential diet for the proper development of mother and baby.',
    },
    readTimeMinutes: 4,
    level: 'beginner',
    icon: 'Baby',
    content: {
      hi: [
        'गर्भावस्था के दौरान आपको अतिरिक्त पोषण की आवश्यकता होती है।',
        'अपने भोजन में प्रोटीन (दालें, दूध), कैल्शियम (दूध, दही) और आयरन (गुड़, हरी सब्जियां) शामिल करें।',
        'डॉक्टर द्वारा दी गई आयरन और फोलिक एसिड की गोलियां नियमित रूप से लें।',
        'खूब पानी पिएं और बाहरी जंक फूड से बचें।',
      ],
      en: [
        'You need extra nutrition during pregnancy.',
        'Include protein (lentils, milk), calcium (milk, yogurt), and iron (jaggery, green vegetables) in your meals.',
        'Take iron and folic acid tablets prescribed by the doctor regularly.',
        'Drink plenty of water and avoid outside junk food.',
      ],
    },
  },
  {
    id: 'vaccination-importance',
    category: 'vaccination',
    tone: 'blue',
    title: {
      hi: 'बच्चों के लिए टीकाकरण क्यों ज़रूरी है?',
      en: 'Why is Vaccination Important for Children?',
    },
    summary: {
      hi: 'टीकाकरण आपके बच्चे को पोलियो और खसरे जैसी गंभीर बीमारियों से बचाता है।',
      en: 'Vaccination protects your child from severe diseases like polio and measles.',
    },
    readTimeMinutes: 2,
    level: 'beginner',
    icon: 'ShieldAlert',
    content: {
      hi: [
        'टीकाकरण (Vaccination) बच्चों को उन बीमारियों से बचाता है जो जानलेवा हो सकती हैं।',
        'सरकारी अस्पतालों में ये टीके पूरी तरह मुफ़्त दिए जाते हैं।',
        'टीका लगने के बाद बच्चे को हल्का बुखार आ सकता है, जो सामान्य है। इसके लिए डॉक्टर पैरासिटामोल देते हैं।',
        'अपना टीकाकरण कार्ड (MCP Card) हमेशा संभाल कर रखें।',
      ],
      en: [
        'Vaccination protects children from diseases that can be life-threatening.',
        'These vaccines are provided completely free of cost in government hospitals.',
        'The child may get a mild fever after vaccination, which is normal. Doctors provide paracetamol for this.',
        'Always keep your Immunization Card (MCP Card) safe.',
      ],
    },
  },
  {
    id: 'newborn-care',
    category: 'newborn',
    tone: 'blue',
    title: {
      hi: 'नवजात शिशु के पहले 7 दिन',
      en: 'First 7 Days of a Newborn',
    },
    summary: {
      hi: 'जन्म के बाद के पहले हफ़्ते में शिशु की देखभाल कैसे करें।',
      en: 'How to care for a newborn in the first week after birth.',
    },
    readTimeMinutes: 3,
    level: 'intermediate',
    icon: 'Baby',
    content: {
      hi: [
        'शिशु के जन्म के पहले 7 दिन बहुत नाज़ुक होते हैं।',
        'शिशु को केवल माँ का दूध ही पिलाएं। शहद या घुट्टी न दें।',
        'शिशु को गरम रखें और साफ़ हाथों से ही छुएं।',
        'नाभि को साफ़ और सूखा रखें। उस पर तेल या पाउडर न लगाएं।',
      ],
      en: [
        'The first 7 days after birth are very crucial for the baby.',
        'Exclusively breastfeed the baby. Do not give honey or ghutti.',
        'Keep the baby warm and touch them only with clean hands.',
        'Keep the umbilical cord stump clean and dry. Do not apply oil or powder to it.',
      ],
    },
  },
  {
    id: 'irregular-periods',
    category: 'periods',
    tone: 'red',
    title: {
      hi: 'अनियमित माहवारी: कारण और बचाव',
      en: 'Irregular Periods: Causes and Prevention',
    },
    summary: {
      hi: 'माहवारी का समय पर न आना किन बातों का संकेत हो सकता है।',
      en: 'What delayed or irregular periods could indicate.',
    },
    readTimeMinutes: 3,
    level: 'intermediate',
    icon: 'Activity',
    content: {
      hi: [
        'तनाव, वजन का कम या ज़्यादा होना, और पीसीओएस (PCOS) अनियमित माहवारी के मुख्य कारण हो सकते हैं।',
        'अगर आपकी माहवारी लगातार 2-3 महीने समय पर नहीं आती, तो डॉक्टर से मिलें।',
        'स्वस्थ आहार और नियमित व्यायाम से इसे ठीक किया जा सकता है।',
      ],
      en: [
        'Stress, weight fluctuations, and PCOS can be major causes of irregular periods.',
        'If your periods are consistently delayed for 2-3 months, consult a doctor.',
        'A healthy diet and regular exercise can help regulate it.',
      ],
    },
  },
  {
    id: 'mental-health',
    category: 'mentalHealth',
    tone: 'saffron',
    title: {
      hi: 'गर्भावस्था में मानसिक स्वास्थ्य',
      en: 'Mental Health in Pregnancy',
    },
    summary: {
      hi: 'शारीरिक बदलाव के साथ मूड बदलना सामान्य है। जानें खुद को कैसे खुश रखें।',
      en: 'Mood swings are normal with physical changes. Learn how to stay happy.',
    },
    readTimeMinutes: 3,
    level: 'beginner',
    icon: 'Smile',
    content: {
      hi: [
        'हार्मोनल बदलाव के कारण चिंता या उदासी महसूस होना आम है।',
        'अपने परिवार और दोस्तों से बात करें। अपनी परेशानी को मन में न रखें।',
        'पर्याप्त नींद लें और हल्का व्यायाम (जैसे टहलना) करें।',
        'अगर उदासी दूर नहीं हो रही, तो डॉक्टर से सलाह लेने में संकोच न करें।',
      ],
      en: [
        'Feeling anxious or sad due to hormonal changes is common.',
        'Talk to your family and friends. Do not keep your worries to yourself.',
        'Get enough sleep and do light exercise (like walking).',
        'If the sadness persists, do not hesitate to consult a doctor.',
      ],
    },
  },
  {
    id: 'phc-visit',
    category: 'phc',
    tone: 'green',
    title: {
      hi: 'PHC (स्वास्थ्य केंद्र) कब जाना चाहिए?',
      en: 'When to Visit the PHC?',
    },
    summary: {
      hi: 'मुफ्त इलाज और दवाओं के लिए अपने नज़दीकी स्वास्थ्य केंद्र का उपयोग कैसे करें।',
      en: 'How to use your nearest health center for free treatment and medicines.',
    },
    readTimeMinutes: 2,
    level: 'beginner',
    icon: 'PlusSquare',
    content: {
      hi: [
        'प्राथमिक स्वास्थ्य केंद्र (PHC) आपके गाँव या मोहल्ले में मुफ़्त इलाज देते हैं।',
        'बुखार, खांसी, या गर्भावस्था के चेकअप के लिए सबसे पहले PHC जाएं।',
        'यहाँ डॉक्टर की सलाह, दवाइयां और बेसिक टेस्ट (जैसे खून की जांच) मुफ़्त होते हैं।',
      ],
      en: [
        'Primary Health Centres (PHC) provide free treatment in your village or locality.',
        'For fever, cough, or pregnancy checkups, visit the PHC first.',
        'Doctor consultations, medicines, and basic tests (like blood tests) are free here.',
      ],
    },
  },
  {
    id: 'pregnancy-warning',
    category: 'pregnancy',
    tone: 'red',
    title: {
      hi: 'गर्भावस्था के दौरान खतरे के संकेत',
      en: 'Danger Signs During Pregnancy',
    },
    summary: {
      hi: 'तुरंत डॉक्टर के पास कब जाना चाहिए? ये संकेत जान कर रखें।',
      en: 'When should you rush to the doctor? Keep these signs in mind.',
    },
    readTimeMinutes: 3,
    level: 'intermediate',
    icon: 'AlertTriangle',
    content: {
      hi: [
        'योनि से खून आना (Bleeding) - यह एक गंभीर संकेत है।',
        'पेट में तेज़ दर्द या लगातार उल्टियां होना।',
        'चेहरे और हाथों पर अचानक सूजन आना।',
        'बच्चे का पेट में न घूमना या बहुत कम घूमना। इन सब स्थितियों में तुरंत अस्पताल जाएं।',
      ],
      en: [
        'Vaginal bleeding - This is a serious sign.',
        'Severe abdominal pain or continuous vomiting.',
        'Sudden swelling of the face and hands.',
        'Decreased or no fetal movement. Rush to the hospital in any of these situations.',
      ],
    },
  },
  {
    id: 'first-period',
    category: 'periods',
    tone: 'pink',
    title: {
      hi: 'बेटियों से माहवारी (Periods) पर कैसे बात करें?',
      en: 'How to Talk to Daughters About Periods?',
    },
    summary: {
      hi: 'माहवारी कोई बीमारी या शर्म की बात नहीं है। अपनी बेटी को सही जानकारी दें।',
      en: 'Menstruation is not a disease or something to be ashamed of. Give right info.',
    },
    readTimeMinutes: 3,
    level: 'beginner',
    icon: 'Users',
    content: {
      hi: [
        'लड़कियों में 10-14 साल की उम्र में माहवारी शुरू होती है। यह शरीर का सामान्य विकास है।',
        'उन्हें पहले से तैयार करें ताकि वे डरे नहीं।',
        'साफ पैड का इस्तेमाल और सफाई के बारे में सही जानकारी दें।',
        'उन्हें समझाएं कि इस दौरान वे सब काम कर सकती हैं — स्कूल जाना, खेलना, आदि।',
      ],
      en: [
        'Girls start their periods between the ages of 10-14. It is normal physical development.',
        'Prepare them beforehand so they are not scared.',
        'Provide proper information about using clean pads and hygiene.',
        'Explain that they can do everything during this time — going to school, playing, etc.',
      ],
    },
  }
]