// Complete Phonics Data from the curriculum document

// 1. LETTER SOUNDS - Vowels & Consonants
export const ALPHABET_DATA = [
  { letter: 'A', sound: 'a', gujarati: 'અ', hindi: 'अ', example: 'apple', isVowel: true },
  { letter: 'B', sound: 'b', gujarati: 'બ', hindi: 'ब', example: 'ball', isVowel: false },
  { letter: 'C', sound: 'k', gujarati: 'ક', hindi: 'क', example: 'cat', isVowel: false },
  { letter: 'D', sound: 'd', gujarati: 'ડ', hindi: 'ड', example: 'dog', isVowel: false },
  { letter: 'E', sound: 'e', gujarati: 'એ', hindi: 'ए', example: 'egg', isVowel: true },
  { letter: 'F', sound: 'f', gujarati: 'ફ', hindi: 'फ', example: 'fan', isVowel: false },
  { letter: 'G', sound: 'g', gujarati: 'ગ', hindi: 'ग', example: 'gun', isVowel: false },
  { letter: 'H', sound: 'h', gujarati: 'હ', hindi: 'ह', example: 'hat', isVowel: false },
  { letter: 'I', sound: 'i', gujarati: 'ઇ', hindi: 'इ', example: 'ink', isVowel: true },
  { letter: 'J', sound: 'j', gujarati: 'જ', hindi: 'ज', example: 'jug', isVowel: false },
  { letter: 'K', sound: 'k', gujarati: 'ક', hindi: 'क', example: 'kite', isVowel: false },
  { letter: 'L', sound: 'l', gujarati: 'લ', hindi: 'ल', example: 'lion', isVowel: false },
  { letter: 'M', sound: 'm', gujarati: 'મ', hindi: 'म', example: 'man', isVowel: false },
  { letter: 'N', sound: 'n', gujarati: 'ન', hindi: 'न', example: 'net', isVowel: false },
  { letter: 'O', sound: 'o', gujarati: 'ઓ', hindi: 'ओ', example: 'orange', isVowel: true },
  { letter: 'P', sound: 'p', gujarati: 'પ', hindi: 'प', example: 'pen', isVowel: false },
  { letter: 'Q', sound: 'kw', gujarati: 'ક્વ', hindi: 'क्व', example: 'queen', isVowel: false },
  { letter: 'R', sound: 'r', gujarati: 'ર', hindi: 'र', example: 'rat', isVowel: false },
  { letter: 'S', sound: 's', gujarati: 'સ', hindi: 'स', example: 'sun', isVowel: false },
  { letter: 'T', sound: 't', gujarati: 'ટ', hindi: 'ट', example: 'tap', isVowel: false },
  { letter: 'U', sound: 'u', gujarati: 'ઉ', hindi: 'उ', example: 'umbrella', isVowel: true },
  { letter: 'V', sound: 'v', gujarati: 'વ', hindi: 'व', example: 'van', isVowel: false },
  { letter: 'W', sound: 'w', gujarati: 'વ', hindi: 'व', example: 'watch', isVowel: false },
  { letter: 'X', sound: 'ks', gujarati: 'ક્સ', hindi: 'क्स', example: 'x-ray', isVowel: false },
  { letter: 'Y', sound: 'y', gujarati: 'ય', hindi: 'य', example: 'yak', isVowel: false },
  { letter: 'Z', sound: 'z', gujarati: 'ઝ', hindi: 'ज़', example: 'zip', isVowel: false },
];

// 2. TWO-LETTER BLENDING WORDS
export const TWO_LETTER_BLENDING = {
  A: [
    { word: 'am', blend: 'a + m', gujarati: 'એમ', hindi: 'ऐम' },
    { word: 'an', blend: 'a + n', gujarati: 'એન', hindi: 'ऐन' },
    { word: 'as', blend: 'a + s', gujarati: 'એસ', hindi: 'ऐस' },
    { word: 'at', blend: 'a + t', gujarati: 'એટ', hindi: 'ऐट' },
    { word: 'ab', blend: 'a + b', gujarati: 'એબ', hindi: 'ऐब' },
    { word: 'ad', blend: 'a + d', gujarati: 'એડ', hindi: 'ऐड' },
    { word: 'ag', blend: 'a + g', gujarati: 'એગ', hindi: 'ऐग' },
    { word: 'ax', blend: 'a + x', gujarati: 'એક્સ', hindi: 'ऐक्स' },
  ],
  E: [
    { word: 'ed', blend: 'e + d', gujarati: 'એડ', hindi: 'एड' },
    { word: 'em', blend: 'e + m', gujarati: 'એમ', hindi: 'एम' },
    { word: 'en', blend: 'e + n', gujarati: 'એન', hindi: 'एन' },
    { word: 'es', blend: 'e + s', gujarati: 'એસ', hindi: 'एस' },
  ],
  I: [
    { word: 'in', blend: 'i + n', gujarati: 'ઇન', hindi: 'इन' },
    { word: 'it', blend: 'i + t', gujarati: 'ઇટ', hindi: 'इट' },
    { word: 'is', blend: 'i + s', gujarati: 'ઇસ', hindi: 'इस' },
    { word: 'if', blend: 'i + f', gujarati: 'ઇફ', hindi: 'इफ' },
    { word: 'im', blend: 'i + m', gujarati: 'ઇમ', hindi: 'इम' },
    { word: 'id', blend: 'i + d', gujarati: 'ઇડ', hindi: 'इड' },
  ],
  O: [
    { word: 'on', blend: 'o + n', gujarati: 'ઓન', hindi: 'ऑन' },
    { word: 'of', blend: 'o + f', gujarati: 'ઓફ', hindi: 'ऑफ' },
    { word: 'or', blend: 'o + r', gujarati: 'ઓર', hindi: 'ऑर' },
    { word: 'ox', blend: 'o + x', gujarati: 'ઓક્સ', hindi: 'ऑक्स' },
  ],
  U: [
    { word: 'up', blend: 'u + p', gujarati: 'અપ', hindi: 'अप' },
    { word: 'us', blend: 'u + s', gujarati: 'અસ', hindi: 'अस' },
    { word: 'um', blend: 'u + m', gujarati: 'અમ', hindi: 'अम' },
  ],
};

// 3. CVC WORD FAMILIES (Complete)
export const CVC_WORD_FAMILIES = {
  // A-Vowel Families
  at: { words: ['cat', 'bat', 'rat', 'mat', 'hat', 'sat', 'fat', 'pat'], gujarati: 'એટ', hindi: 'ऐट' },
  an: { words: ['man', 'can', 'fan', 'pan', 'ran', 'tan', 'van'], gujarati: 'એન', hindi: 'ऐन' },
  ag: { words: ['bag', 'rag', 'tag', 'wag', 'sag'], gujarati: 'એગ', hindi: 'ऐग' },
  am: { words: ['ham', 'jam', 'ram'], gujarati: 'એમ', hindi: 'ऐम' },
  ap: { words: ['cap', 'map', 'nap', 'tap', 'gap', 'lap'], gujarati: 'એપ', hindi: 'ऐप' },
  ad: { words: ['dad', 'sad', 'mad', 'pad', 'lad'], gujarati: 'એડ', hindi: 'ऐड' },
  
  // E-Vowel Families
  en: { words: ['pen', 'hen', 'ten', 'men'], gujarati: 'એન', hindi: 'एन' },
  et: { words: ['jet', 'pet', 'vet', 'get', 'set', 'let'], gujarati: 'એટ', hindi: 'एट' },
  ed: { words: ['bed', 'red', 'fed'], gujarati: 'એડ', hindi: 'एड' },
  em: { words: ['gem', 'hem'], gujarati: 'એમ', hindi: 'एम' },
  
  // I-Vowel Families
  in: { words: ['pin', 'win', 'bin', 'fin', 'tin', 'kin'], gujarati: 'ઇન', hindi: 'इन' },
  it: { words: ['sit', 'hit', 'lit', 'bit', 'fit', 'kit', 'pit'], gujarati: 'ઇટ', hindi: 'इट' },
  ig: { words: ['pig', 'wig', 'dig', 'big', 'fig'], gujarati: 'ઇગ', hindi: 'इग' },
  ip: { words: ['sip', 'dip', 'lip', 'tip', 'rip'], gujarati: 'ઇપ', hindi: 'इप' },
  
  // O-Vowel Families
  ot: { words: ['pot', 'hot', 'lot', 'not', 'dot', 'cot'], gujarati: 'ઓટ', hindi: 'ऑट' },
  op: { words: ['top', 'mop', 'hop', 'pop'], gujarati: 'ઓપ', hindi: 'ऑप' },
  og: { words: ['dog', 'fog', 'log'], gujarati: 'ઓગ', hindi: 'ऑग' },
  ox: { words: ['box', 'fox'], gujarati: 'ઓક્સ', hindi: 'ऑक्स' },
  
  // U-Vowel Families
  ug: { words: ['mug', 'rug', 'bug', 'hug', 'jug'], gujarati: 'અગ', hindi: 'अग' },
  un: { words: ['fun', 'run', 'sun', 'bun', 'nun', 'gun'], gujarati: 'અન', hindi: 'अन' },
  um: { words: ['gum', 'sum', 'hum', 'mum'], gujarati: 'અમ', hindi: 'अम' },
  ut: { words: ['cut', 'hut', 'nut', 'gut'], gujarati: 'અટ', hindi: 'अट' },
};

// 4. SIGHT WORDS
export const SIGHT_WORDS = {
  level1: [
    { word: 'the', gujarati: 'ધ', hindi: 'द' },
    { word: 'is', gujarati: 'ઇસ', hindi: 'इस' },
    { word: 'are', gujarati: 'આર', hindi: 'आर' },
    { word: 'I', gujarati: 'આઈ', hindi: 'आई' },
    { word: 'you', gujarati: 'યુ', hindi: 'यू' },
    { word: 'we', gujarati: 'વી', hindi: 'वी' },
    { word: 'he', gujarati: 'હી', hindi: 'ही' },
    { word: 'she', gujarati: 'શી', hindi: 'शी' },
    { word: 'it', gujarati: 'ઇટ', hindi: 'इट' },
    { word: 'in', gujarati: 'ઇન', hindi: 'इन' },
    { word: 'on', gujarati: 'ઓન', hindi: 'ऑन' },
    { word: 'to', gujarati: 'ટુ', hindi: 'टू' },
  ],
  level2: [
    { word: 'they', gujarati: 'ધે', hindi: 'दे' },
    { word: 'them', gujarati: 'ધેમ', hindi: 'देम' },
    { word: 'his', gujarati: 'હિસ', hindi: 'हिस' },
    { word: 'her', gujarati: 'હર', hindi: 'हर' },
    { word: 'has', gujarati: 'હેસ', hindi: 'हैस' },
    { word: 'have', gujarati: 'હેવ', hindi: 'हैव' },
    { word: 'was', gujarati: 'વોસ', hindi: 'वॉस' },
    { word: 'were', gujarati: 'વર', hindi: 'वर' },
    { word: 'for', gujarati: 'ફોર', hindi: 'फॉर' },
    { word: 'from', gujarati: 'ફ્રોમ', hindi: 'फ्रॉम' },
    { word: 'of', gujarati: 'ઓફ', hindi: 'ऑफ' },
    { word: 'but', gujarati: 'બટ', hindi: 'बट' },
    { word: 'by', gujarati: 'બાય', hindi: 'बाय' },
    { word: 'out', gujarati: 'આઉટ', hindi: 'आउट' },
    { word: 'come', gujarati: 'કમ', hindi: 'कम' },
    { word: 'some', gujarati: 'સમ', hindi: 'सम' },
    { word: 'one', gujarati: 'વન', hindi: 'वन' },
    { word: 'two', gujarati: 'ટુ', hindi: 'टू' },
    { word: 'all', gujarati: 'ઓલ', hindi: 'ऑल' },
    { word: 'can', gujarati: 'કેન', hindi: 'कैन' },
  ],
  level3: [
    { word: 'what', gujarati: 'વોટ', hindi: 'व्हाट' },
    { word: 'where', gujarati: 'વેર', hindi: 'व्हेर' },
    { word: 'who', gujarati: 'હુ', hindi: 'हू' },
    { word: 'when', gujarati: 'વેન', hindi: 'व्हेन' },
    { word: 'why', gujarati: 'વાય', hindi: 'व्हाय' },
  ],
};

// 5. GRAMMAR WORDS
export const GRAMMAR_WORDS = [
  { word: 'I', meaningGujarati: 'હું', meaningHindi: 'मैं' },
  { word: 'You', meaningGujarati: 'તમે', meaningHindi: 'तुम' },
  { word: 'He', meaningGujarati: 'તે', meaningHindi: 'वह' },
  { word: 'She', meaningGujarati: 'તેણી', meaningHindi: 'वह' },
  { word: 'It', meaningGujarati: 'તે', meaningHindi: 'यह' },
  { word: 'We', meaningGujarati: 'અમે', meaningHindi: 'हम' },
  { word: 'They', meaningGujarati: 'તેઓ', meaningHindi: 'वे' },
  { word: 'Is', meaningGujarati: 'છે', meaningHindi: 'है' },
  { word: 'Am', meaningGujarati: 'છું', meaningHindi: 'हूँ' },
  { word: 'Are', meaningGujarati: 'છો/છીએ', meaningHindi: 'हो/हैं' },
  { word: 'Was', meaningGujarati: 'હતો/હતી', meaningHindi: 'था/थी' },
  { word: 'Were', meaningGujarati: 'હતા', meaningHindi: 'थे' },
  { word: 'This', meaningGujarati: 'આ', meaningHindi: 'यह' },
  { word: 'That', meaningGujarati: 'તે', meaningHindi: 'वह' },
  { word: 'Have', meaningGujarati: 'પાસે છે', meaningHindi: 'के पास है' },
  { word: 'Has', meaningGujarati: 'પાસે છે', meaningHindi: 'के पास है' },
];

// 6. SENTENCES (Complete from document)
export const SENTENCES = {
  theCVC: [
    { english: 'The cat is big.', gujarati: 'બિલાડી મોટી છે.', hindi: 'बिल्ली बड़ी है।' },
    { english: 'The dog is sad.', gujarati: 'કૂતરો ઉદાસ છે.', hindi: 'कुत्ता उदास है।' },
    { english: 'The sun is hot.', gujarati: 'સૂર્ય ગરમ છે.', hindi: 'सूरज गरम है।' },
    { english: 'The man is mad.', gujarati: 'માણસ ગુસ્સે છે.', hindi: 'आदमी गुस्से में है।' },
    { english: 'The pen is red.', gujarati: 'પેન લાલ છે.', hindi: 'पेन लाल है।' },
    { english: 'The cup is on the mat.', gujarati: 'કપ ચાદર પર છે.', hindi: 'कप चटाई पर है।' },
  ],
  iAmHave: [
    { english: 'I am a boy.', gujarati: 'હું એક છોકરો છું.', hindi: 'मैं एक लड़का हूँ।' },
    { english: 'I am a girl.', gujarati: 'હું એક છોકરી છું.', hindi: 'मैं एक लड़की हूँ।' },
    { english: 'I have a pen.', gujarati: 'મારી પાસે પેન છે.', hindi: 'मेरे पास पेन है।' },
    { english: 'I have a cup.', gujarati: 'મારી પાસે કપ છે.', hindi: 'मेरे पास कप है।' },
    { english: 'I can run.', gujarati: 'હું દોડી શકું છું.', hindi: 'मैं दौड़ सकता हूँ।' },
    { english: 'I can sit.', gujarati: 'હું બેસી શકું છું.', hindi: 'मैं बैठ सकता हूँ।' },
  ],
  heShe: [
    { english: 'He is big.', gujarati: 'તે મોટો છે.', hindi: 'वह बड़ा है।' },
    { english: 'He is sad.', gujarati: 'તે ઉદાસ છે.', hindi: 'वह उदास है।' },
    { english: 'She is happy.', gujarati: 'તે ખુશ છે.', hindi: 'वह खुश है।' },
    { english: 'She is in the van.', gujarati: 'તે વેનમાં છે.', hindi: 'वह वैन में है।' },
    { english: 'He is on the mat.', gujarati: 'તે ચાદર પર છે.', hindi: 'वह चटाई पर है।' },
  ],
  thisThat: [
    { english: 'This is a cat.', gujarati: 'આ બિલાડી છે.', hindi: 'यह बिल्ली है।' },
    { english: 'This is a pen.', gujarati: 'આ પેન છે.', hindi: 'यह पेन है।' },
    { english: 'This is my bag.', gujarati: 'આ મારી બેગ છે.', hindi: 'यह मेरा बैग है।' },
    { english: 'That is a dog.', gujarati: 'તે કૂતરો છે.', hindi: 'वह कुत्ता है।' },
    { english: 'That is a sun.', gujarati: 'તે સૂર્ય છે.', hindi: 'वह सूरज है।' },
  ],
  wordFamilySentences: [
    { english: 'The cat is fat.', gujarati: 'બિલાડી જાડી છે.', hindi: 'बिल्ली मोटी है।', family: 'at' },
    { english: 'The rat is on the mat.', gujarati: 'ઉંદર ચાદર પર છે.', hindi: 'चूहा चटाई पर है।', family: 'at' },
    { english: 'The man is sad.', gujarati: 'માણસ ઉદાસ છે.', hindi: 'आदमी उदास है।', family: 'an' },
    { english: 'The fan is on.', gujarati: 'પંખો ચાલુ છે.', hindi: 'पंखा चालू है।', family: 'an' },
    { english: 'I am in the van.', gujarati: 'હું વેનમાં છું.', hindi: 'मैं वैन में हूँ।', family: 'in' },
    { english: 'The pin is in the box.', gujarati: 'પિન બોક્સમાં છે.', hindi: 'पिन डब्बे में है।', family: 'in' },
    { english: 'I can sit.', gujarati: 'હું બેસી શકું છું.', hindi: 'मैं बैठ सकता हूँ।', family: 'it' },
    { english: 'The kit is in the bag.', gujarati: 'કિટ બેગમાં છે.', hindi: 'किट बैग में है।', family: 'it' },
    { english: 'The dog can run.', gujarati: 'કૂતરો દોડી શકે છે.', hindi: 'कुत्ता दौड़ सकता है।', family: 'og' },
    { english: 'The dog is on the log.', gujarati: 'કૂતરો લાકડા પર છે.', hindi: 'कुत्ता लकड़ी पर है।', family: 'og' },
    { english: 'The sun is hot.', gujarati: 'સૂર્ય ગરમ છે.', hindi: 'सूरज गरम है।', family: 'un' },
    { english: 'I can run.', gujarati: 'હું દોડી શકું છું.', hindi: 'मैं दौड़ सकता हूँ।', family: 'un' },
    { english: 'The bug is on the mug.', gujarati: 'જીવડું મગ પર છે.', hindi: 'कीड़ा मग पर है।', family: 'ug' },
  ],
  whSentences: [
    { english: 'What is this? This is a pen.', gujarati: 'આ શું છે? આ પેન છે.', hindi: 'यह क्या है? यह पेन है।' },
    { english: 'Where is the cat? The cat is on the mat.', gujarati: 'બિલાડી ક્યાં છે? બિલાડી ચાદર પર છે.', hindi: 'बिल्ली कहाँ है? बिल्ली चटाई पर है।' },
    { english: 'Who are you? I am a boy/girl.', gujarati: 'તમે કોણ છો? હું છોકરો/છોકરી છું.', hindi: 'तुम कौन हो? मैं लड़का/लड़की हूँ।' },
    { english: 'Why is he sad? He is sad.', gujarati: 'તે ઉદાસ કેમ છે? તે ઉદાસ છે.', hindi: 'वह उदास क्यों है? वह उदास है।' },
    { english: 'How are you? I am fine.', gujarati: 'તમે કેમ છો? હું સારો છું.', hindi: 'तुम कैसे हो? मैं ठीक हूँ।' },
  ],
  mixedPractice: [
    { english: 'The man has a red pen.', gujarati: 'માણસ પાસે લાલ પેન છે.', hindi: 'आदमी के पास लाल पेन है।' },
    { english: 'The dog is in the box.', gujarati: 'કૂતરો બોક્સમાં છે.', hindi: 'कुत्ता डब्बे में है।' },
    { english: 'The cat is on the mat.', gujarati: 'બિલાડી ચાદર પર છે.', hindi: 'बिल्ली चटाई पर है।' },
    { english: 'I have a map in the bag.', gujarati: 'મારી બેગમાં નકશો છે.', hindi: 'मेरे बैग में नक्शा है।' },
    { english: 'The sun is big and hot.', gujarati: 'સૂર્ય મોટો અને ગરમ છે.', hindi: 'सूरज बड़ा और गरम है।' },
    { english: 'We are in the van.', gujarati: 'અમે વેનમાં છીએ.', hindi: 'हम वैन में हैं।' },
    { english: 'They are on the top.', gujarati: 'તેઓ ટોચ પર છે.', hindi: 'वे ऊपर हैं।' },
    { english: 'She is in the hut.', gujarati: 'તે ઝૂંપડીમાં છે.', hindi: 'वह झोपड़ी में है।' },
  ],
};

// 7. PARAGRAPHS
export const PARAGRAPHS = [
  {
    id: 1,
    title: 'My Pet',
    text: 'I have a pet dog. His name is Tommy. He is brown. He can run fast. I love my pet.',
    gujarati: 'મારી પાસે કૂતરો છે. તેનું નામ ટોમી છે. તે બ્રાઉન છે. તે ઝડપથી દોડી શકે છે. મને મારો પાલતુ પ્રાણી ગમે છે.',
    hindi: 'मेरे पास एक कुत्ता है। उसका नाम टॉमी है। वह भूरा है। वह तेज दौड़ सकता है। मुझे अपना पालतू जानवर पसंद है।',
  },
  {
    id: 2,
    title: 'My School',
    text: 'I go to school. My school is big. I have many friends. We read and write. I love my school.',
    gujarati: 'હું શાળાએ જાઉં છું. મારી શાળા મોટી છે. મારા ઘણા મિત્રો છે. અમે વાંચીએ અને લખીએ છીએ. મને મારી શાળા ગમે છે.',
    hindi: 'मैं स्कूल जाता हूँ। मेरा स्कूल बड़ा है। मेरे बहुत सारे दोस्त हैं। हम पढ़ते और लिखते हैं। मुझे अपना स्कूल पसंद है।',
  },
  {
    id: 3,
    title: 'The Sun',
    text: 'The sun is in the sky. It is big and hot. It gives us light. We can see in the day. The sun is good.',
    gujarati: 'સૂર્ય આકાશમાં છે. તે મોટો અને ગરમ છે. તે અમને પ્રકાશ આપે છે. અમે દિવસે જોઈ શકીએ છીએ. સૂર્ય સારો છે.',
    hindi: 'सूरज आकाश में है। वह बड़ा और गरम है। वह हमें रोशनी देता है। हम दिन में देख सकते हैं। सूरज अच्छा है।',
  },
];

// 8. BARAKHADI DATA
export const BARAKHADI_ROOTS = [
  { english: 'K', gujarati: 'ક', hindi: 'क' },
  { english: 'Kh', gujarati: 'ખ', hindi: 'ख' },
  { english: 'G', gujarati: 'ગ', hindi: 'ग' },
  { english: 'Gh', gujarati: 'ઘ', hindi: 'घ' },
  { english: 'Ch', gujarati: 'ચ', hindi: 'च' },
  { english: 'Chh', gujarati: 'છ', hindi: 'छ' },
  { english: 'J', gujarati: 'જ', hindi: 'ज' },
  { english: 'T', gujarati: 'ટ', hindi: 'ट' },
  { english: 'D', gujarati: 'ડ', hindi: 'ड' },
  { english: 'N', gujarati: 'ણ', hindi: 'ण' },
  { english: 'P', gujarati: 'પ', hindi: 'प' },
  { english: 'Ph', gujarati: 'ફ', hindi: 'फ' },
  { english: 'B', gujarati: 'બ', hindi: 'ब' },
  { english: 'Bh', gujarati: 'ભ', hindi: 'भ' },
  { english: 'M', gujarati: 'મ', hindi: 'म' },
  { english: 'Y', gujarati: 'ય', hindi: 'य' },
  { english: 'R', gujarati: 'ર', hindi: 'र' },
  { english: 'L', gujarati: 'લ', hindi: 'ल' },
  { english: 'V', gujarati: 'વ', hindi: 'व' },
  { english: 'S', gujarati: 'સ', hindi: 'स' },
  { english: 'H', gujarati: 'હ', hindi: 'ह' },
];

export const BARAKHADI_MATRAS = [
  { suffix: '', english: 'a', gujarati: '', hindi: '' },
  { suffix: 'aa', english: 'aa', gujarati: 'ા', hindi: 'ा' },
  { suffix: 'i', english: 'i', gujarati: 'િ', hindi: 'ि' },
  { suffix: 'ee', english: 'ee', gujarati: 'ી', hindi: 'ी' },
  { suffix: 'u', english: 'u', gujarati: 'ુ', hindi: 'ु' },
  { suffix: 'oo', english: 'oo', gujarati: 'ૂ', hindi: 'ू' },
  { suffix: 'e', english: 'e', gujarati: 'ે', hindi: 'े' },
  { suffix: 'ai', english: 'ai', gujarati: 'ૈ', hindi: 'ै' },
  { suffix: 'o', english: 'o', gujarati: 'ો', hindi: 'ो' },
  { suffix: 'au', english: 'au', gujarati: 'ૌ', hindi: 'ौ' },
];

// Standards for student profiles
export const STANDARDS = [
  'Nursery', 'LKG', 'UKG', 
  '1st', '2nd', '3rd', '4th', '5th', 
  '6th', '7th', '8th', '9th', '10th', 
  '11th', '12th'
];

// Level configurations
export const LEVELS = [
  { id: 1, name: 'Alphabet Sounds', icon: '🔤', color: 'primary' },
  { id: 2, name: 'Barakhadi', icon: '📝', color: 'secondary' },
  { id: 3, name: '2-Letter Blending', icon: '🔗', color: 'success' },
  { id: 4, name: 'CVC Words', icon: '📖', color: 'accent' },
  { id: 5, name: 'Sight Words', icon: '👁️', color: 'warning' },
  { id: 6, name: 'Grammar', icon: '📚', color: 'primary' },
  { id: 7, name: 'Sentences', icon: '✍️', color: 'success' },
  { id: 8, name: 'Paragraphs', icon: '📄', color: 'accent' },
];
