export type QuestionClass = 'B' | 'A' | 'A1' | 'A2';
export type QuestionTopic =
  | 'gefahrenlehre'
  | 'verhalten'
  | 'vorfahrt'
  | 'verkehrszeichen'
  | 'umwelt'
  | 'technik'
  | 'eignung';

export type Language = 'de' | 'tr' | 'ar' | 'en' | 'ru';

export interface Question {
  id: string;
  class: QuestionClass[];
  topic: QuestionTopic;
  points: number; // 2, 3, 4, or 5
  question: { [key in Language]?: string };
  answers: {
    text: { [key in Language]?: string };
    correct: boolean;
  }[];
  imageUrl?: string;
  explanation?: { [key in Language]?: string };
}

export interface UserProgress {
  questionId: string;
  correct: number;
  wrong: number;
  lastSeen: number; // timestamp
  nextReview: number; // SM-2 next review timestamp
  easeFactor: number; // SM-2 ease factor
  interval: number; // SM-2 interval in days
}

export const TOPICS: { id: QuestionTopic; label: { [key in Language]?: string }; icon: string; color: string }[] = [
  { id: 'gefahrenlehre', label: { de: 'Gefahrenlehre', tr: 'Tehlike Öğretisi', en: 'Hazard Theory', ar: 'نظرية الخطر', ru: 'Теория опасности' }, icon: '⚠️', color: '#F85149' },
  { id: 'verhalten', label: { de: 'Verhalten im Verkehr', tr: 'Trafik Davranışı', en: 'Traffic Behavior', ar: 'السلوك في حركة المرور', ru: 'Поведение в трафике' }, icon: '🚦', color: '#3FB950' },
  { id: 'vorfahrt', label: { de: 'Vorfahrt', tr: 'Öncelik Hakkı', en: 'Right of Way', ar: 'حق الأولوية', ru: 'Приоритет' }, icon: '➡️', color: '#F4A700' },
  { id: 'verkehrszeichen', label: { de: 'Verkehrszeichen', tr: 'Trafik İşaretleri', en: 'Traffic Signs', ar: 'إشارات المرور', ru: 'Дорожные знаки' }, icon: '🚧', color: '#58A6FF' },
  { id: 'umwelt', label: { de: 'Umweltschutz', tr: 'Çevre Koruma', en: 'Environment', ar: 'حماية البيئة', ru: 'Окружающая среда' }, icon: '🌱', color: '#3FB950' },
  { id: 'technik', label: { de: 'Fahrzeugtechnik', tr: 'Araç Teknolojisi', en: 'Vehicle Tech', ar: 'تقنية المركبات', ru: 'Техника авто' }, icon: '🔧', color: '#8B949E' },
  { id: 'eignung', label: { de: 'Eignung & Verhalten', tr: 'Yeterlilik', en: 'Fitness & Conduct', ar: 'اللياقة والسلوك', ru: 'Пригодность' }, icon: '👤', color: '#D2A8FF' },
];

// Sample questions (MVP — will be replaced with full 1300+ DB)
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'B-GEF-001',
    class: ['B', 'A'],
    topic: 'gefahrenlehre',
    points: 5,
    question: {
      de: 'Sie fahren auf einer Straße mit einem Gefälle von mehr als 10%. Womit müssen Sie rechnen?',
      tr: 'Yüzde 10\'dan fazla eğimi olan bir yolda sürüyorsunuz. Ne ile karşılaşabilirsiniz?',
      en: 'You are driving on a road with a gradient of more than 10%. What must you expect?',
      ar: 'أنت تقود على طريق به انحدار يزيد عن 10٪. بماذا يجب أن تتوقع؟',
      ru: 'Вы едете по дороге с уклоном более 10%. С чем вы должны считаться?',
    },
    answers: [
      {
        text: {
          de: 'Mit einem erhöhten Kraftstoffverbrauch beim Bergauffahren',
          tr: 'Yokuş çıkarken artan yakıt tüketimiyle',
          en: 'With increased fuel consumption when driving uphill',
          ar: 'بزيادة في استهلاك الوقود عند الصعود',
          ru: 'С увеличенным расходом топлива при подъёме',
        },
        correct: true,
      },
      {
        text: {
          de: 'Mit einer Überhitzung der Bremsen beim Bergabfahren',
          tr: 'Yokuş inerken frenlerin aşırı ısınmasıyla',
          en: 'With overheating of the brakes when driving downhill',
          ar: 'بارتفاع درجة حرارة الفرامل عند النزول',
          ru: 'С перегревом тормозов при спуске',
        },
        correct: true,
      },
      {
        text: {
          de: 'Mit einem verbesserten Bremsweg auf nassem Untergrund',
          tr: 'Islak zemin üzerinde iyileştirilmiş fren mesafesiyle',
          en: 'With an improved braking distance on wet surfaces',
          ar: 'بتحسين مسافة الفرملة على الأسطح المبللة',
          ru: 'С улучшенным тормозным путём на мокром покрытии',
        },
        correct: false,
      },
    ],
    explanation: {
      de: 'Bei Gefälle über 10% wird die Motorbremse beim Bergabfahren entlastet. Starkes Bremsen führt zur Überhitzung.',
      tr: 'Yüzde 10\'dan fazla eğimde yokuş aşağı inerken motor freni yük alır. Güçlü fren uygulaması aşırı ısınmaya yol açar.',
      en: 'With a gradient over 10%, engine braking is used when driving downhill. Heavy braking leads to overheating.',
    },
  },
  {
    id: 'B-VOR-001',
    class: ['B', 'A'],
    topic: 'vorfahrt',
    points: 4,
    question: {
      de: 'Wer hat an dieser Kreuzung Vorfahrt?',
      tr: 'Bu kavşakta kimin öncelik hakkı vardır?',
      en: 'Who has the right of way at this intersection?',
      ar: 'من له حق الأولوية في هذا التقاطع؟',
      ru: 'Кто имеет преимущество на этом перекрёстке?',
    },
    answers: [
      {
        text: {
          de: 'Fahrzeuge von rechts',
          tr: 'Sağdan gelen araçlar',
          en: 'Vehicles from the right',
          ar: 'المركبات القادمة من اليمين',
          ru: 'Транспортные средства справа',
        },
        correct: true,
      },
      {
        text: {
          de: 'Fahrzeuge von links',
          tr: 'Soldan gelen araçlar',
          en: 'Vehicles from the left',
          ar: 'المركبات القادمة من اليسار',
          ru: 'Транспортные средства слева',
        },
        correct: false,
      },
      {
        text: {
          de: 'Geradeausfahrende Fahrzeuge',
          tr: 'Düz giden araçlar',
          en: 'Vehicles going straight ahead',
          ar: 'المركبات التي تسير مباشرةً',
          ru: 'Транспортные средства, едущие прямо',
        },
        correct: false,
      },
    ],
    explanation: {
      de: 'Rechts vor links gilt an Kreuzungen ohne Vorfahrtsregelung.',
      tr: 'Öncelik hakkı düzenlemesi olmayan kavşaklarda sağdan gelen araçlar önceliklidir.',
      en: 'Right before left applies at intersections without priority rules.',
    },
  },
  {
    id: 'B-TEC-001',
    class: ['B'],
    topic: 'technik',
    points: 3,
    question: {
      de: 'Was bewirkt das Antiblockiersystem (ABS) beim Bremsen?',
      tr: 'Fren yaparken ABS (Kilitlenme Önleme Sistemi) ne işe yarar?',
      en: 'What does the anti-lock braking system (ABS) do when braking?',
      ar: 'ما الذي يفعله نظام منع الانزلاق (ABS) عند الكبح؟',
      ru: 'Что делает антиблокировочная система (ABS) при торможении?',
    },
    answers: [
      {
        text: {
          de: 'Es verhindert das Blockieren der Räder',
          tr: 'Tekerleklerin kilitlenmesini önler',
          en: 'It prevents the wheels from locking',
          ar: 'يمنع انغلاق العجلات',
          ru: 'Предотвращает блокировку колёс',
        },
        correct: true,
      },
      {
        text: {
          de: 'Es verkürzt den Bremsweg immer',
          tr: 'Fren mesafesini her zaman kısaltır',
          en: 'It always shortens the braking distance',
          ar: 'يقصر دائمًا مسافة الفرملة',
          ru: 'Всегда сокращает тормозной путь',
        },
        correct: false,
      },
      {
        text: {
          de: 'Es ermöglicht das Lenken während einer Vollbremsung',
          tr: 'Tam frenleme sırasında direksiyon kullanmayı sağlar',
          en: 'It allows steering during full braking',
          ar: 'يتيح التوجيه أثناء الفرملة الكاملة',
          ru: 'Позволяет управлять автомобилем при экстренном торможении',
        },
        correct: true,
      },
    ],
    explanation: {
      de: 'ABS verhindert das Blockieren der Räder und ermöglicht so das Lenken auch bei Vollbremsung. Der Bremsweg wird auf losem Untergrund nicht immer kürzer.',
      tr: 'ABS tekerleklerin kilitlenmesini önler ve tam frenleme sırasında bile direksiyon kullanımına izin verir. Gevşek zeminde fren mesafesi her zaman kısalmaz.',
    },
  },
  {
    id: 'B-VEK-001',
    class: ['B', 'A'],
    topic: 'verkehrszeichen',
    points: 2,
    question: {
      de: 'Was bedeutet ein rundes Schild mit rotem Rand und einem Fahrrad-Symbol?',
      tr: 'Kırmızı kenarlı yuvarlak bir tabelada bisiklet sembolü ne anlama gelir?',
      en: 'What does a round sign with a red border and a bicycle symbol mean?',
      ar: 'ماذا يعني اللافتة الدائرية ذات الحافة الحمراء ورمز الدراجة؟',
      ru: 'Что означает круглый знак с красной каймой и символом велосипеда?',
    },
    answers: [
      {
        text: {
          de: 'Fahrräder verboten',
          tr: 'Bisiklet yasak',
          en: 'Bicycles prohibited',
          ar: 'الدراجات ممنوعة',
          ru: 'Велосипеды запрещены',
        },
        correct: true,
      },
      {
        text: {
          de: 'Fahrradweg',
          tr: 'Bisiklet yolu',
          en: 'Bicycle path',
          ar: 'مسار للدراجات',
          ru: 'Велосипедная дорожка',
        },
        correct: false,
      },
      {
        text: {
          de: 'Fahrräder bevorzugt',
          tr: 'Bisikletler öncelikli',
          en: 'Bicycles preferred',
          ar: 'الدراجات مفضلة',
          ru: 'Велосипеды имеют приоритет',
        },
        correct: false,
      },
    ],
  },
  {
    id: 'B-VER-001',
    class: ['B', 'A'],
    topic: 'verhalten',
    points: 4,
    question: {
      de: 'Sie fahren auf der Autobahn und möchten überholen. Was müssen Sie beachten?',
      tr: 'Otoyolda sürüyorsunuz ve geçmek istiyorsunuz. Neye dikkat etmelisiniz?',
      en: 'You are driving on the motorway and want to overtake. What must you pay attention to?',
      ar: 'أنت تقود على الطريق السريع وتريد التجاوز. بماذا يجب أن تنتبه؟',
      ru: 'Вы едете по автобану и хотите обогнать. На что нужно обратить внимание?',
    },
    answers: [
      {
        text: {
          de: 'Nur links überholen',
          tr: 'Yalnızca soldan geçmek',
          en: 'Only overtake on the left',
          ar: 'التجاوز من اليسار فقط',
          ru: 'Обгонять только слева',
        },
        correct: true,
      },
      {
        text: {
          de: 'Auf ausreichenden Abstand achten',
          tr: 'Yeterli mesafeye dikkat etmek',
          en: 'Pay attention to sufficient distance',
          ar: 'الانتباه إلى المسافة الكافية',
          ru: 'Соблюдать достаточное расстояние',
        },
        correct: true,
      },
      {
        text: {
          de: 'Auf der rechten Fahrspur bleiben nach dem Überholen',
          tr: 'Geçişten sonra sağ şeride dönmek',
          en: 'Return to the right lane after overtaking',
          ar: 'العودة إلى الحارة اليمنى بعد التجاوز',
          ru: 'Вернуться в правый ряд после обгона',
        },
        correct: true,
      },
    ],
    explanation: {
      de: 'Auf der Autobahn gilt: immer rechts fahren, links überholen, danach sofort zurück auf die rechte Spur.',
      tr: 'Otoyolda kural: daima sağda kal, soldan geç, ardından hemen sağ şeride dön.',
    },
  },
];
