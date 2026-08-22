/**
 * Ethiopian Calendar (13 Months) and Orthodox Fasting Utility
 * Supports all 13 Ethiopian Calendar months, leap years (Pagume 5/6 days),
 * Julian/Gregorian conversions, and complete canonical fasting calculations.
 */

export const ETHIOPIAN_MONTHS = [
  { id: 1, nameEn: 'Meskerem', nameAm: 'መስከረም', geez: 'መስከረም', seasonEn: 'Spring (Tseday)', seasonAm: 'መፀው' },
  { id: 2, nameEn: 'Tikimt', nameAm: 'ጥቅምት', geez: 'ጥቅምት', seasonEn: 'Harvest (Metsaw)', seasonAm: 'መፀው' },
  { id: 3, nameEn: 'Hidar', nameAm: 'ኅዳር', geez: 'ኅዳር', seasonEn: 'Autumn (Metsaw)', seasonAm: 'መፀው' },
  { id: 4, nameEn: 'Tahsas', nameAm: 'ታኅሣሥ', geez: 'ታኅሣሥ', seasonEn: 'Winter (Bega)', seasonAm: 'በጋ' },
  { id: 5, nameEn: 'Tir', nameAm: 'ጥር', geez: 'ጥር', seasonEn: 'Winter (Bega)', seasonAm: 'በጋ' },
  { id: 6, nameEn: 'Yakatit', nameAm: 'የካቲት', geez: 'የካቲት', seasonEn: 'Late Winter', seasonAm: 'በጋ' },
  { id: 7, nameEn: 'Magabit', nameAm: 'መጋቢት', geez: 'መጋቢት', seasonEn: 'Spring / Lent Season', seasonAm: 'በልግ' },
  { id: 8, nameEn: 'Miazia', nameAm: 'ሚያዝያ', geez: 'ሚያዝያ', seasonEn: 'Fasika / Easter Season', seasonAm: 'በልግ' },
  { id: 9, nameEn: 'Ginbot', nameAm: 'ግንቦት', geez: 'ግንቦት', seasonEn: 'Dry Spring', seasonAm: 'በልግ' },
  { id: 10, nameEn: 'Sene', nameAm: 'ሰኔ', geez: 'ሰኔ', seasonEn: 'Rainy Season (Kiremt)', seasonAm: 'ክረምት' },
  { id: 11, nameEn: 'Hamle', nameAm: 'ሐምሌ', geez: 'ሐምሌ', seasonEn: 'Heavy Rain (Kiremt)', seasonAm: 'ክረምት' },
  { id: 12, nameEn: 'Nehase', nameAm: 'ነሐሴ', geez: 'ነሐሴ', seasonEn: 'Late Rain / Filseta', seasonAm: 'ክረምት' },
  { id: 13, nameEn: 'Pagume', nameAm: 'ጳጉሜን', geez: 'ጳጉሜን', seasonEn: 'The 13th Month (Intercalary)', seasonAm: 'ጳጉሜ' },
];

export const ETHIOPIAN_WEEKDAYS = [
  { id: 1, nameEn: 'MON', fullEn: 'Monday', nameAm: 'ሰኞ', geez: 'ሰኑይ' },
  { id: 2, nameEn: 'TUE', fullEn: 'Tuesday', nameAm: 'ማክሰኞ', geez: 'ሠሉስ' },
  { id: 3, nameEn: 'WED', fullEn: 'Wednesday', nameAm: 'ረቡዕ', geez: 'ረቡዕ' },
  { id: 4, nameEn: 'THU', fullEn: 'Thursday', nameAm: 'ሐሙስ', geez: 'ኃሙስ' },
  { id: 5, nameEn: 'FRI', fullEn: 'Friday', nameAm: 'ዓርብ', geez: 'ዓርብ' },
  { id: 6, nameEn: 'SAT', fullEn: 'Saturday', nameAm: 'ቅዳሜ', geez: 'ቀዳሚት' },
  { id: 0, nameEn: 'SUN', fullEn: 'Sunday', nameAm: 'እሑድ', geez: 'እሑድ' },
];

/**
 * Check if an Ethiopian Year is a leap year (Pagume has 6 days instead of 5).
 * In the Ethiopian calendar, a leap year occurs when year % 4 === 3.
 */
export function isEthiopianLeapYear(year) {
  return year % 4 === 3;
}

/**
 * Number of days in a given Ethiopian month and year.
 */
export function getDaysInEthiopianMonth(year, month) {
  if (month >= 1 && month <= 12) {
    return 30;
  }
  if (month === 13) {
    return isEthiopianLeapYear(year) ? 6 : 5;
  }
  return 30;
}

/**
 * Convert Ethiopian Date (year, month 1-13, day 1-30) to Julian Day Number (JDN)
 */
export function ethiopianToJDN(year, month, day) {
  return (
    1723856 +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * (month - 1) +
    day
  );
}

/**
 * Convert JDN to Ethiopian Date { year, month, day }
 */
export function jdnToEthiopian(jdn) {
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
}

/**
 * Convert Gregorian Date to JDN
 */
export function gregorianToJDN(gYear, gMonth, gDay) {
  const a = Math.floor((14 - gMonth) / 12);
  const y = gYear + 4800 - a;
  const m = gMonth + 12 * a - 3;
  return (
    gDay +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Convert JDN to Gregorian Date { year, month, day }
 */
export function jdnToGregorian(jdn) {
  const l = jdn + 68569;
  const n = Math.floor((4 * l) / 146097);
  const l2 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l2 + 1)) / 1461001);
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l3) / 2447);
  const day = l3 - Math.floor((2447 * j) / 80);
  const l4 = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;
  return { year, month, day };
}

/**
 * Convert Gregorian Date to Ethiopian Date
 */
export function toEthiopianDate(gregorianDate = new Date()) {
  const gy = gregorianDate.getFullYear();
  const gm = gregorianDate.getMonth() + 1;
  const gd = gregorianDate.getDate();
  const jdn = gregorianToJDN(gy, gm, gd);
  return jdnToEthiopian(jdn);
}

/**
 * Convert Ethiopian Date to Gregorian Date
 */
export function toGregorianDate(ethYear, ethMonth, ethDay) {
  const jdn = ethiopianToJDN(ethYear, ethMonth, ethDay);
  const { year, month, day } = jdnToGregorian(jdn);
  return new Date(year, month - 1, day);
}

/**
 * Day of week for Ethiopian Date:
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export function getEthiopianDayOfWeek(ethYear, ethMonth, ethDay) {
  const jdn = ethiopianToJDN(ethYear, ethMonth, ethDay);
  return (jdn + 1) % 7;
}

/**
 * Computes Ethiopian Orthodox Easter (Fasika) for a given Ethiopian Year.
 * Returns { jdn, year, month, day }
 */
export function getEthiopianEaster(ethYear) {
  const a = (ethYear + 5500) % 19;
  const b = (19 * a + 15) % 30;
  const c = (ethYear + 5500) % 4;
  const d = (2 * c + 4 * ((ethYear + 5500) % 7) + 6 * b + 6) % 7;
  const daysFromMegabit21 = b + d + 1; // Days after Megabit 21
  
  // Megabit is month 7
  let ethMonth = 7;
  let ethDay = 21 + daysFromMegabit21;
  if (ethDay > 30) {
    ethMonth = 8; // Miazia
    ethDay = ethDay - 30;
  }
  const jdn = ethiopianToJDN(ethYear, ethMonth, ethDay);
  return { jdn, year: ethYear, month: ethMonth, day: ethDay };
}

/**
 * Comprehensive Fasting Evaluation for any Ethiopian Calendar Date.
 * Accurately determines:
 * - Weekly Wednesday & Friday Fasts (except during 50 days of Pentecost)
 * - The Great Lent (Abiy Tsom / ሁዳዴ) - 55 days
 * - Fast of Nineveh (Tsome Nenewe) - 3 days
 * - Fast of the Apostles (Tsome Hawaryat) - from Pentecost Monday to Hamle 5
 * - Fast of the Assumption (Tsome Filseta) - Nehase 1 to Nehase 16
 * - Fast of the Prophets / Advent (Tsome Nebiyat / Gena) - Hidar 15 to Tahsas 28
 * - Fast of Gahad (Christmas & Epiphany Eve)
 */
export function getEthiopianFastingInfo(ethYear, ethMonth, ethDay) {
  const jdn = ethiopianToJDN(ethYear, ethMonth, ethDay);
  const dayOfWeek = (jdn + 1) % 7; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  const easter = getEthiopianEaster(ethYear);
  const easterJdn = easter.jdn;

  // Key fasting JDN markers
  const neneweStartJdn = easterJdn - 69;
  const neneweEndJdn = neneweStartJdn + 2; // 3 days (Mon, Tue, Wed)

  const abiyTsomStartJdn = easterJdn - 55; // Monday 8 weeks before Easter
  const abiyTsomEndJdn = easterJdn - 1;   // Holy Saturday

  const pentecostJdn = easterJdn + 49;    // 50th day (Pentecost Sunday)
  const apostlesStartJdn = pentecostJdn + 1; // Monday after Pentecost
  const apostlesEndJdn = ethiopianToJDN(ethYear, 11, 5); // Hamle 5 (always concludes on Hamle 5)

  const isPentecostPeriod = jdn >= easterJdn && jdn <= pentecostJdn;

  let isFasting = false;
  let fastNameEn = 'Non-Fasting (Feasting Day)';
  let fastNameAm = 'የፍስክ ቀን';
  let category = 'regular';
  let descriptionEn = 'Standard heritage nutrition. Animal and plant foods permitted.';
  let descriptionAm = 'መደበኛ የተመጣጠነ የፍስክ አመጋገብ።';
  let dietaryRule = 'All healthy Ethiopian foods permitted';
  let icon = '🍖';

  // 1. Tsome Nenewe
  if (jdn >= neneweStartJdn && jdn <= neneweEndJdn) {
    isFasting = true;
    fastNameEn = 'Fast of Nineveh (Tsome Nenewe)';
    fastNameAm = 'ጾመ ነነዌ';
    category = 'major_fast';
    descriptionEn = '3-day fast of repentance and supplication before Great Lent.';
    descriptionAm = 'ከአቢይ ጾም አስቀድሞ የሚጾም የ3 ቀናት የንስሐ እና የልመና ጾም።';
    dietaryRule = 'Strict 100% vegan plant-based (Tsom)';
    icon = '🕊️';
  }
  // 2. Abiy Tsom (Great Lent)
  else if (jdn >= abiyTsomStartJdn && jdn <= abiyTsomEndJdn) {
    isFasting = true;
    fastNameEn = 'The Great Lent (Abiy Tsom / Hudadi)';
    fastNameAm = 'አቢይ ጾም (ሁዳዴ)';
    category = 'major_fast';
    descriptionEn = '55 days of sacred plant-based fasting commemorating Christ in the wilderness.';
    descriptionAm = 'ጌታችን በመዋዕለ ስጋዌው የጾመው 55 ቀናት ታላቅ የንስሐ እና የጸሎት ወቅት።';
    dietaryRule = 'Strict 100% vegan (No meat, dairy, butter, eggs). Late eating.';
    icon = '✨';
  }
  // 3. Fast of the Apostles (Tsome Hawaryat)
  else if (jdn >= apostlesStartJdn && jdn <= apostlesEndJdn) {
    isFasting = true;
    fastNameEn = 'Fast of the Apostles (Tsome Hawaryat)';
    fastNameAm = 'የሐዋርያት ጾም (የሰኔ ጾም)';
    category = 'major_fast';
    descriptionEn = 'Commemorates the apostles receiving the Holy Spirit and preaching.';
    descriptionAm = 'ቅዱሳን ሐዋርያት መንፈስ ቅዱስን ከተቀበሉ በኋላ ለስብከተ ወንጌል የጾሙት ጾም።';
    dietaryRule = 'Strict 100% vegan plant-based (Tsom)';
    icon = '📜';
  }
  // 4. Fast of the Assumption (Tsome Filseta) - Nehase 1 to Nehase 16 (Month 12)
  else if (ethMonth === 12 && ethDay >= 1 && ethDay <= 16) {
    isFasting = true;
    fastNameEn = 'Fast of the Assumption (Tsome Filseta)';
    fastNameAm = 'የፍልሰታ ጾም';
    category = 'major_fast';
    descriptionEn = '16-day fast dedicated to the dormition and bodily assumption of the Virgin Mary.';
    descriptionAm = 'የእመቤታችን ቅድስት ድንግል ማርያም የዕርገት መታሰቢያ 16 ቀናት የተከበረ ጾም።';
    dietaryRule = 'Strict 100% vegan plant-based (Tsom)';
    icon = '🌸';
  }
  // 5. Fast of the Prophets / Advent (Tsome Nebiyat / Gena) - Hidar 15 to Tahsas 28
  else if (
    (ethMonth === 3 && ethDay >= 15) ||
    (ethMonth === 4 && ethDay <= 28)
  ) {
    isFasting = true;
    fastNameEn = 'Prophets / Advent Fast (Tsome Nebiyat)';
    fastNameAm = 'የነቢያት ጾም (የገና ጾም)';
    category = 'major_fast';
    descriptionEn = '43-day fast anticipating the Nativity / Christmas (Gena).';
    descriptionAm = 'ነቢያት ክርስቶስ እንዲወለድ የተነበዩበትና ለገና በዓል መዘጋጃ 43 ቀናት ጾም።';
    dietaryRule = 'Strict 100% vegan plant-based (Tsom)';
    icon = '🕯️';
  }
  // 6. Fast of Gahad (Eve of Christmas Tahsas 28, Eve of Timket Tir 10)
  else if ((ethMonth === 4 && ethDay === 28) || (ethMonth === 5 && ethDay === 10)) {
    isFasting = true;
    fastNameEn = 'Gahad Fast (Eve of Holy Feast)';
    fastNameAm = 'የጋድ ጾም (የበዓላት ዋዜማ)';
    category = 'minor_fast';
    descriptionEn = 'Strict fasting vigil on the eve of Christmas or Epiphany (Timkat).';
    descriptionAm = 'የገና ወይም የጥምቀት በዓል ዋዜማ ጥብቅ የጾም ቀን።';
    dietaryRule = 'Strict vegan fasting until late afternoon';
    icon = '⏳';
  }
  // 7. Weekly Wednesday & Friday Fasts (outside of the 50 days of Pentecost)
  else if ((dayOfWeek === 3 || dayOfWeek === 5) && !isPentecostPeriod) {
    isFasting = true;
    const isWed = dayOfWeek === 3;
    fastNameEn = isWed ? 'Wednesday Fast (Tsome Dihnet)' : 'Friday Fast (Tsome Dihnet)';
    fastNameAm = isWed ? 'የረቡዕ ጾም (ጾመ ድኅነት)' : 'የዓርብ ጾም (ጾመ ድኅነት)';
    category = 'weekly_fast';
    descriptionEn = isWed
      ? 'Weekly Wednesday fast commemorating the consultation and betrayal of Christ.'
      : 'Weekly Friday fast commemorating the crucifixion and passion of Christ.';
    descriptionAm = isWed
      ? 'የጌታችን ምክረ ሞት የተፈጸመበት ሳምንታዊ የቀኖና ጾም።'
      : 'የጌታችን ስቅለት እና ሕማማት መታሰቢያ ሳምንታዊ የቀኖና ጾም።';
    dietaryRule = '100% Plant-Based. Shiro, Misir, Gomen, Teff Injera, Veggies.';
    icon = '🌱';
  }
  // 8. 50 Days of Pentecost (Feasting exemption)
  else if (isPentecostPeriod) {
    isFasting = false;
    fastNameEn = 'Season of Pentecost (በዓለ ሃምሳ)';
    fastNameAm = 'የትንሣኤ ወቅት (በዓለ ሃምሳ)';
    category = 'feasting_season';
    descriptionEn = '50 days of joy celebrating the Resurrection of Christ. No weekly fasting.';
    descriptionAm = 'የትንሣኤ የደስታ ወቅት፤ ሳምንታዊ ረቡዕና ዓርብ የማይጾምበት የ50 ቀናት ስርዓት።';
    dietaryRule = 'Feasting permitted throughout all 50 days.';
    icon = '🕊️';
  }

  return {
    isFasting,
    fastNameEn,
    fastNameAm,
    category,
    descriptionEn,
    descriptionAm,
    dietaryRule,
    icon,
    dayOfWeek,
    ethYear,
    ethMonth,
    ethDay,
    jdn
  };
}

/**
 * Generate full calendar matrix (grouped in rows of 7 days: Monday to Sunday)
 * for any given Ethiopian Year and Month (1 to 13).
 */
export function generateEthiopianMonthMatrix(ethYear, ethMonth) {
  const totalDays = getDaysInEthiopianMonth(ethYear, ethMonth);
  const rows = [];
  let currentRow = [];

  // Find the day of week of day 1 (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = getEthiopianDayOfWeek(ethYear, ethMonth, 1);
  // Mon-based padding (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6)
  const padDays = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);

  // Today in Ethiopian calendar for current day indicator
  const todayEth = toEthiopianDate(new Date());

  // Padding preceding cells
  for (let i = 0; i < padDays; i++) {
    currentRow.push({
      day: '',
      isCurrentMonth: false,
      isFasting: false,
      isCurrentDay: false,
    });
  }

  // Month days
  for (let d = 1; d <= totalDays; d++) {
    const fastInfo = getEthiopianFastingInfo(ethYear, ethMonth, d);
    const isToday =
      todayEth.year === ethYear &&
      todayEth.month === ethMonth &&
      todayEth.day === d;

    currentRow.push({
      day: d,
      month: ethMonth,
      year: ethYear,
      isCurrentMonth: true,
      isCurrentDay: isToday,
      isFasting: fastInfo.isFasting,
      fastInfo: fastInfo,
      gregorianDate: toGregorianDate(ethYear, ethMonth, d),
    });

    if (currentRow.length === 7) {
      rows.push(currentRow);
      currentRow = [];
    }
  }

  // Padding trailing cells
  if (currentRow.length > 0) {
    while (currentRow.length < 7) {
      currentRow.push({
        day: '',
        isCurrentMonth: false,
        isFasting: false,
        isCurrentDay: false,
      });
    }
    rows.push(currentRow);
  }

  return {
    rows,
    totalDays,
    isLeapYear: isEthiopianLeapYear(ethYear),
    monthMeta: ETHIOPIAN_MONTHS[ethMonth - 1],
  };
}
