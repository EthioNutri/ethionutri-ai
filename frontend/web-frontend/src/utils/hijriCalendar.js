// Hijri Calendar & Islamic Fasting Engine for EthioNutri AI
// Supports Ramadan, Sunnah Monday/Thursday, White Days (Ayyam al-Bid), and API fetcher

export const HIJRI_MONTHS = [
  { id: 1, nameEn: 'Muharram', nameAr: 'مُحَرَّم', nameAm: 'ሙሐረም', days: 30, sacred: true },
  { id: 2, nameEn: 'Safar', nameAr: 'صَفَر', nameAm: 'ሰፈር', days: 29, sacred: false },
  { id: 3, nameEn: "Rabi' al-Awwal", nameAr: 'رَبِيع الأَوَّل', nameAm: 'ረቢዕ አል-አወል', days: 30, sacred: false },
  { id: 4, nameEn: "Rabi' al-Thani", nameAr: 'رَبِيع الآخِر', nameAm: 'ረቢዕ አል-ሳኒ', days: 29, sacred: false },
  { id: 5, nameEn: 'Jumada al-Awwal', nameAr: 'جُمَادَى الأُولَى', nameAm: 'ጁማዳ አል-ኡላ', days: 30, sacred: false },
  { id: 6, nameEn: 'Jumada al-Thani', nameAr: 'جُمَادَى الآخِرَة', nameAm: 'ጁማዳ አል-አኺራ', days: 29, sacred: false },
  { id: 7, nameEn: 'Rajab', nameAr: 'رَجَب', nameAm: 'ረጀብ', days: 30, sacred: true },
  { id: 8, nameEn: "Sha'ban", nameAr: 'شَعْبَان', nameAm: 'ሸዕባን', days: 29, sacred: false },
  { id: 9, nameEn: 'Ramadan', nameAr: 'رَمَضَان', nameAm: 'ረመዳን', days: 30, sacred: true, isRamadan: true },
  { id: 10, nameEn: 'Shawwal', nameAr: 'شَوَّال', nameAm: 'ሸዋል', days: 29, sacred: false },
  { id: 11, nameEn: "Dhul-Qi'dah", nameAr: 'ذُو القَعْدَة', nameAm: 'ዙል-ቂዕዳ', days: 30, sacred: true },
  { id: 12, nameEn: 'Dhul-Hijjah', nameAr: 'ذُو الحِجَّة', nameAm: 'ዙል-ሒጃ', days: 29, sacred: true },
];

export const HIJRI_WEEKDAYS = [
  { id: 1, nameEn: 'Mon', fullEn: 'Monday', nameAr: 'الإثنين', nameAm: 'ሰኞ' },
  { id: 2, nameEn: 'Tue', fullEn: 'Tuesday', nameAr: 'الثلاثاء', nameAm: 'ማክሰኞ' },
  { id: 3, nameEn: 'Wed', fullEn: 'Wednesday', nameAr: 'الأربعاء', nameAm: 'ረቡዕ' },
  { id: 4, nameEn: 'Thu', fullEn: 'Thursday', nameAr: 'الخميس', nameAm: 'ሐሙስ' },
  { id: 5, nameEn: 'Fri', fullEn: 'Friday', nameAr: 'الجمعة', nameAm: 'ዓርብ' },
  { id: 6, nameEn: 'Sat', fullEn: 'Saturday', nameAr: 'السبت', nameAm: 'ቅዳሜ' },
  { id: 7, nameEn: 'Sun', fullEn: 'Sunday', nameAr: 'الأحد', nameAm: 'እሑድ' },
];

// Bidirectional Gregorian to approximate Hijri date
export function toHijriDate(gregorianDate = new Date()) {
  const gYear = gregorianDate.getFullYear();
  const gMonth = gregorianDate.getMonth();
  const gDay = gregorianDate.getDate();

  // Julian Day Number
  let a = Math.floor((14 - (gMonth + 1)) / 12);
  let y = gYear + 4800 - a;
  let m = (gMonth + 1) + 12 * a - 3;
  let jdn = gDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  let l = jdn - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  let hMonth = Math.floor((24 * l) / 709);
  let hDay = l - Math.floor((709 * hMonth) / 24);
  let hYear = 30 * n + j - 30;

  return {
    year: hYear,
    month: Math.max(1, Math.min(12, hMonth)),
    day: Math.max(1, Math.min(30, hDay)),
    dayOfWeek: (gregorianDate.getDay() + 6) % 7 + 1 // 1=Mon, 7=Sun
  };
}

// Convert approximate Hijri date to Gregorian Date
export function toGregorianFromHijri(hYear, hMonth, hDay) {
  let jdn = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
  let l = jdn + 68569;
  let n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  let i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  let j = Math.floor((80 * l) / 2447);
  let gDay = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  let gMonth = j + 2 - 12 * l;
  let gYear = 100 * (n - 49) + i + l;

  return new Date(gYear, gMonth - 1, gDay);
}

// Islamic Fasting Evaluation
export function getIslamicFastingInfo(hYear, hMonth, hDay) {
  const gDate = toGregorianFromHijri(hYear, hMonth, hDay);
  const dayOfWeek = (gDate.getDay() + 6) % 7 + 1; // 1=Mon, 4=Thu

  // 1. Ramadan (Month 9) - Obligatory Fast
  if (hMonth === 9) {
    return {
      isFasting: true,
      fastType: 'ramadan',
      titleEn: `Ramadan Day ${hDay}`,
      titleAr: `رمضان - اليوم ${hDay}`,
      titleAm: `የረመዳን ቀን ${hDay}`,
      obligation: 'Fard (Obligatory / ግዴታ)',
      suhoorEnd: '5:05 AM',
      iftarTime: '6:35 PM',
      icon: '🌙',
      ruleEn: 'Strict dawn-to-sunset fast (No food, drink, or water). Break fast at Maghrib with dates & water.',
      ruleAm: 'ከፈጅር (ንጋት) እስከ መግሪብ (ጀምበር መጥለቂያ) ሙሉ በሙሉ መጾም።',
      nutritionTipEn: 'Focus on complex carbohydrates (Teff/Oats) at Suhoor for sustained energy. Hydrate with 2.5L water between Iftar and Suhoor.'
    };
  }

  // 2. Day of Arafah (9th Dhul-Hijjah)
  if (hMonth === 12 && hDay === 9) {
    return {
      isFasting: true,
      fastType: 'arafah',
      titleEn: 'Day of Arafah',
      titleAr: 'يوم عرفة',
      titleAm: 'የዐረፋ ቀን ጾም',
      obligation: 'Sunnah Mu’akkadah (Highly Recommended)',
      suhoorEnd: '5:05 AM',
      iftarTime: '6:35 PM',
      icon: '🕋',
      ruleEn: 'Forgives sins of the previous and upcoming year.',
      ruleAm: 'የአለፈውን እና የሚመጣውን ዓመት ወንጀል የሚያስምር ታላቅ ሱና ጾም።',
      nutritionTipEn: 'Eat a nutrient-dense Suhoor rich in protein and fiber (Shiro, lentils, eggs) with adequate hydration.'
    };
  }

  // 3. Day of Ashura (10th Muharram) & Tasu'a (9th Muharram)
  if (hMonth === 1 && (hDay === 9 || hDay === 10)) {
    return {
      isFasting: true,
      fastType: 'ashura',
      titleEn: hDay === 10 ? 'Day of Ashura' : 'Tasu’a (9th Muharram)',
      titleAr: hDay === 10 ? 'يوم عاشوراء' : 'تاسوعاء',
      titleAm: hDay === 10 ? 'የዐሹራ ቀን ጾም' : 'የታሱዓ ቀን ጾም',
      obligation: 'Sunnah (Recommended)',
      suhoorEnd: '5:05 AM',
      iftarTime: '6:35 PM',
      icon: '✨',
      ruleEn: 'Expiates the sins of the past year.',
      ruleAm: 'የአንድ ዓመት ወንጀልን የሚያስተሰርይ የተወደደ ጾም።',
      nutritionTipEn: 'Combine dates, water, and traditional lentil soup at Iftar to replenish blood glucose safely.'
    };
  }

  // 4. White Days / Ayyam al-Bid (13th, 14th, 15th of any Hijri Month)
  if (hDay === 13 || hDay === 14 || hDay === 15) {
    return {
      isFasting: true,
      fastType: 'white_days',
      titleEn: `White Day (${hDay}th ${HIJRI_MONTHS[hMonth - 1]?.nameEn})`,
      titleAr: `أيام البيض - ${hDay}`,
      titleAm: `የነጭ ቀናት ጾም (${hDay}ኛ ቀን)`,
      obligation: 'Sunnah (Recommended)',
      suhoorEnd: '5:05 AM',
      iftarTime: '6:35 PM',
      icon: '🌕',
      ruleEn: 'Fasting the 3 middle days of the lunar month is equivalent to fasting the entire month in reward.',
      ruleAm: 'በየወሩ አጋማሽ (13፣ 14 እና 15) የሚጾም የሱና ጾም።',
      nutritionTipEn: 'Hydrate well during the evening and focus on potassium-rich foods (bananas, avocado) to prevent thirst.'
    };
  }

  // 5. Sunnah Monday & Thursday Fast
  if (dayOfWeek === 1 || dayOfWeek === 4) {
    return {
      isFasting: true,
      fastType: 'monday_thursday',
      titleEn: dayOfWeek === 1 ? 'Sunnah Monday Fast' : 'Sunnah Thursday Fast',
      titleAr: dayOfWeek === 1 ? 'صيام يوم الإثنين' : 'صيام يوم الخميس',
      titleAm: dayOfWeek === 1 ? 'የሰኞ ሱና ጾም' : 'የሐሙስ ሱና ጾም',
      obligation: 'Sunnah (Voluntary)',
      suhoorEnd: '5:05 AM',
      iftarTime: '6:35 PM',
      icon: '🌱',
      ruleEn: 'Deeds are presented to Allah on Mondays and Thursdays.',
      ruleAm: 'ሥራዎች ወደ አላህ የሚቀርቡባቸው የሰኞ እና የሐሙስ ሱና ጾሞች።',
      nutritionTipEn: 'Perfect for metabolic reset. Maintain high-protein dinner and consume whole grain Teff.'
    };
  }

  // Regular Non-Fasting Day
  return {
    isFasting: false,
    fastType: 'regular',
    titleEn: 'Regular Day',
    titleAr: 'يوم عادي',
    titleAm: 'መደበኛ ቀን',
    obligation: 'Non-Fasting',
    suhoorEnd: 'N/A',
    iftarTime: 'N/A',
    icon: '🍽️',
    ruleEn: 'Standard balanced nutrition across breakfast, lunch, and dinner.',
    ruleAm: 'መደበኛ የተመጣጠነ የአመጋገብ ቀን።',
    nutritionTipEn: 'Balance macros evenly: 45-60% carbs, 20-30% protein, 20-30% healthy fats.'
  };
}

// Generate Hijri Month Matrix (7 columns Mon-Sun)
export function generateHijriMonthMatrix(hYear, hMonth) {
  const monthMeta = HIJRI_MONTHS[hMonth - 1] || HIJRI_MONTHS[0];
  const numDays = monthMeta.days;

  const firstDate = toGregorianFromHijri(hYear, hMonth, 1);
  const firstDayOfWeek = (firstDate.getDay() + 6) % 7; // 0=Mon, 6=Sun

  const rows = [];
  let currentRow = [];

  // Pad beginning of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentRow.push({ day: '', isCurrentMonth: false, isFasting: false });
  }

  const todayHijri = toHijriDate(new Date());

  for (let d = 1; d <= numDays; d++) {
    const fastInfo = getIslamicFastingInfo(hYear, hMonth, d);
    const isToday = todayHijri.year === hYear && todayHijri.month === hMonth && todayHijri.day === d;

    currentRow.push({
      day: d,
      isCurrentMonth: true,
      isFasting: fastInfo.isFasting,
      fastType: fastInfo.fastType,
      isCurrentDay: isToday,
      fastInfo
    });

    if (currentRow.length === 7) {
      rows.push(currentRow);
      currentRow = [];
    }
  }

  if (currentRow.length > 0) {
    while (currentRow.length < 7) {
      currentRow.push({ day: '', isCurrentMonth: false, isFasting: false });
    }
    rows.push(currentRow);
  }

  return {
    monthMeta,
    year: hYear,
    rows
  };
}

// Live fetcher for EthioAll Hijri API
export async function fetchLiveHijriData() {
  try {
    const res = await fetch('https://api.ethioall.com/hijri/api.php');
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        data
      };
    }
  } catch (err) {
    console.warn('Live Hijri API unreachable, using canonical lunar calculation:', err);
  }
  return { success: false };
}
