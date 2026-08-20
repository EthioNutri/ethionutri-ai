import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import CalorieRing from '../components/ui/CalorieRing';
import ErrorBoundary from '../components/common/ErrorBoundary';
import apiClient from '../services/apiClient';
import { toEthiopianDate, ETHIOPIAN_MONTHS } from '../utils/ethiopianCalendar';

const AMHARIC_MONTHS = [
  'ጃንዩወሪ', 'ፌብሩወሪ', 'ማርች', 'ኤፕሪል',
  'ሜይ', 'ጁን', 'ጁላይ', 'ኦገስት',
  'ሴፕቴምበር', 'ኦክቶበር', 'ኖቬምበር', 'ዲሴምበር'
];

const AMHARIC_DAYS = {
  Mon: 'ሰኞ',
  Tue: 'ማክሰኞ',
  Wed: 'ረቡዕ',
  Thu: 'ሐሙስ',
  Fri: 'ዓርብ',
  Sat: 'ቅዳሜ',
  Sun: 'እሑድ'
};

// Comprehensive Ethiopian Food Database Pool
const ETHIOPIAN_FOOD_POOL = {
  breakfast: [
    {
      name: 'Kinche with Niter Kibbeh',
      image: '/images/foods/kinche_bowl.jpg',
      amharic: 'ቂንጬ በቅቤ',
      calories: 320,
      protein: '8g',
      proteinG: 8,
      carbsG: 52,
      fatsG: 9,
      tag: 'TRADITIONAL',
      tagAmharic: 'ባህላዊ',
      tagType: 'trad',
      isTsom: false,
      isHeritage: true,
      prepTimeMin: 15,
      image: '/images/foods/kinche_bowl.jpg',
    },
    {
      name: 'Kinche with Olive Oil & Suff (Sunflower)',
      amharic: 'ቂንጬ በሱፍ ፍትፍት',
      calories: 310,
      protein: '9g',
      proteinG: 9,
      carbsG: 50,
      fatsG: 8,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 15,
      image: '/images/foods/kinche_bowl.jpg',
    },
    {
      name: 'Genfo (Barley Porridge) with Niter Kibbeh & Berbere',
      amharic: 'የገብስ ገንፎ በቅቤ',
      calories: 420,
      protein: '12g',
      proteinG: 12,
      carbsG: 68,
      fatsG: 12,
      tag: 'TRADITIONAL',
      tagAmharic: 'ባህላዊ',
      tagType: 'trad',
      isTsom: false,
      isHeritage: true,
      prepTimeMin: 20,
      image: '/images/foods/genfo_bowl.jpg',
    },
    {
      name: 'Genfo with Spiced Olive Oil & Berbere (Tsom)',
      amharic: 'የገብስ ገንፎ በዘይት',
      calories: 390,
      protein: '11g',
      proteinG: 11,
      carbsG: 68,
      fatsG: 9,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 20,
      image: '/images/foods/genfo_bowl.jpg',
    },
    {
      name: 'Chechebsa (Kita Firfir) with Spiced Oil & Honey',
      amharic: 'ጨጨብሳ በቅመም ዘይት',
      calories: 360,
      protein: '10g',
      proteinG: 10,
      carbsG: 58,
      fatsG: 10,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 15,
      image: '/images/foods/chechebsa_plate.jpg',
    },
    {
      name: 'Scrambled Eggs with Tomatoes & Green Peppers',
      amharic: 'እንቁላል ፍርፍር በቲማቲም',
      calories: 340,
      protein: '18g',
      proteinG: 18,
      carbsG: 12,
      fatsG: 24,
      tag: 'HIGH PROTEIN',
      tagAmharic: 'ከፍተኛ ፕሮቲን',
      tagType: 'prot',
      isTsom: false,
      isHeritage: true,
      prepTimeMin: 12,
      image: '/images/foods/scrambled_eggs.jpg',
    },
    {
      name: 'Telba (Flaxseed Porridge & Drink)',
      amharic: 'የተልባ ገንፎ እና መጠጥ',
      calories: 280,
      protein: '9g',
      proteinG: 9,
      carbsG: 32,
      fatsG: 14,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 10,
      image: '/images/foods/telba_drink.jpg',
    }
  ],
  lunch: [
    {
      name: 'Shiro Tegabino with Gibto (Lupin) & Teff Injera',
      amharic: 'ተጋቢኖ ሽሮ በግብጦ እና ጤፍ እንጀራ',
      calories: 470,
      protein: '19g',
      proteinG: 19,
      carbsG: 72,
      fatsG: 13,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      secondTag: 'HIGH PROTEIN',
      secondTagAmharic: 'ከፍተኛ ፕሮቲን',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 20,
      image: '/images/foods/shiro_pot.jpg',
    },
    {
      name: 'Spicy Misir Wot with Steamed Gomen & Injera',
      amharic: 'ምስር ወጥ እና የሀበሻ ጎመን በጤፍ',
      calories: 450,
      protein: '18g',
      proteinG: 18,
      carbsG: 70,
      fatsG: 11,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      secondTag: 'HIGH PROTEIN',
      secondTagAmharic: 'ከፍተኛ ፕሮቲን',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 25,
      image: '/images/foods/misir_wot.jpg',
    },
    {
      name: 'Kik Alicha with Duba Wot & Fosolia',
      amharic: 'ክክ አልጫ፣ ዱባ ወጥ እና ፋሶሊያ',
      calories: 410,
      protein: '16g',
      proteinG: 16,
      carbsG: 66,
      fatsG: 9,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 25,
      image: '/images/foods/kik_alicha.jpg',
    },
    {
      name: 'Doro Wat with Brown Teff Injera & Boiled Egg',
      amharic: 'ዶሮ ወጥ በጤፍ እንጀራ',
      calories: 640,
      protein: '42g',
      proteinG: 42,
      carbsG: 58,
      fatsG: 26,
      tag: 'HIGH PROTEIN',
      tagAmharic: 'ከፍተኛ ፕሮቲን',
      secondTag: 'TRADITIONAL',
      secondTagAmharic: 'ባህላዊ',
      tagType: 'prot',
      isTsom: false,
      isHeritage: true,
      prepTimeMin: 50,
      image: '/images/foods/scrambled_eggs.jpg',
    },
    {
      name: 'Beef Tibs with Awaze, Salad & Injera',
      amharic: 'የበሬ ጥብስ ከአዋዜ ጋር',
      calories: 580,
      protein: '36g',
      proteinG: 36,
      carbsG: 52,
      fatsG: 24,
      tag: 'HIGH PROTEIN',
      tagAmharic: 'ከፍተኛ ፕሮቲን',
      secondTag: 'TRADITIONAL',
      secondTagAmharic: 'ባህላዊ',
      tagType: 'prot',
      isTsom: false,
      isHeritage: true,
      prepTimeMin: 20,
      image: '/images/foods/beef_tibs.jpg',
    },
    {
      name: 'Tibs Firfir with Green Pepper & Ayib',
      amharic: 'ጥብስ ፍርፍር ከአይብ ጋር',
      calories: 610,
      protein: '34g',
      proteinG: 34,
      carbsG: 62,
      fatsG: 24,
      tag: 'TRADITIONAL',
      tagAmharic: 'ባህላዊ',
      tagType: 'trad',
      isTsom: false,
      isHeritage: true,
      prepTimeMin: 18,
      image: '/images/foods/beef_tibs.jpg',
    },
    {
      name: 'Beyaynetu (Grand Fasting Platter with 6 Stews)',
      amharic: 'የጾም በያይነቱ',
      calories: 520,
      protein: '22g',
      proteinG: 22,
      carbsG: 82,
      fatsG: 12,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      secondTag: 'HIGH PROTEIN',
      secondTagAmharic: 'ከፍተኛ ፕሮቲን',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 30,
      image: '/images/foods/beyaynetu_platter.jpg',
    }
  ],
  dinner: [
    {
      name: 'Mitten Shiro Wat with Fresh Tomato Salata',
      amharic: 'ምጥን ሽሮ ወጥ ከቲማቲም ሰላጣ ጋር',
      calories: 390,
      protein: '15g',
      proteinG: 15,
      carbsG: 62,
      fatsG: 10,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 20,
      image: '/images/foods/shiro_pot.jpg',
    },
    {
      name: 'Fasolia (Green Beans & Carrots) & Steamed Gomen',
      amharic: 'ፋሶሊያ እና የሀበሻ ጎመን',
      calories: 330,
      protein: '11g',
      proteinG: 11,
      carbsG: 54,
      fatsG: 8,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 18,
      image: '/images/foods/beyaynetu_platter.jpg',
    },
    {
      name: 'Dinich Alicha (Turmeric Potato Stew) & Injera',
      amharic: 'ድንች አልጫ በጤፍ እንጀራ',
      calories: 360,
      protein: '9g',
      proteinG: 9,
      carbsG: 66,
      fatsG: 7,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 20,
      image: '/images/foods/kik_alicha.jpg',
    },
    {
      name: 'Shimbra Asa Wat (Spiced Chickpea Dumplings)',
      amharic: 'ሽምብራ አሳ ወጥ',
      calories: 440,
      protein: '17g',
      proteinG: 17,
      carbsG: 68,
      fatsG: 12,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      secondTag: 'HIGH PROTEIN',
      secondTagAmharic: 'ከፍተኛ ፕሮቲን',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 30,
      image: '/images/foods/beyaynetu_platter.jpg',
    },
    {
      name: 'Azifa (Whole Green Lentil Salad with Mustard & Ginger)',
      amharic: 'አዚፋ በሰናፍጭ እና ቃሪያ',
      calories: 320,
      protein: '15g',
      proteinG: 15,
      carbsG: 48,
      fatsG: 8,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      secondTag: 'HIGH PROTEIN',
      secondTagAmharic: 'ከፍተኛ ፕሮቲን',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 15,
      image: '/images/foods/azifa_salad.jpg',
    },
    {
      name: 'Buticha (Chickpea Flour Scramble with Lemon & Jalapeño)',
      amharic: 'ቡቲቻ በሎሚ እና ቃሪያ',
      calories: 310,
      protein: '14g',
      proteinG: 14,
      carbsG: 44,
      fatsG: 9,
      tag: 'FASTING (TSOM)',
      tagAmharic: 'የጾም ምግብ',
      tagType: 'tsom',
      isTsom: true,
      isHeritage: true,
      prepTimeMin: 15,
      image: '/images/foods/beyaynetu_platter.jpg',
    }
  ]
};

const MealPlanningContent = () => {
  const { dailyStats, user } = useNutrition() || {};
  const [dayOverrides, setDayOverrides] = useState({});
  const [shufflingDays, setShufflingDays] = useState({});
  const { language } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('All');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const filterChips = useMemo(() => [
    { id: 'All', labelEn: 'All', labelAm: 'ሁሉም' },
    { id: 'Fasting-Friendly (Tsom)', labelEn: 'Fasting-Friendly (Tsom)', labelAm: 'የጾም ምግብ' },
    { id: 'High Protein', labelEn: 'High Protein', labelAm: 'ከፍተኛ ፕሮቲን' },
    { id: 'Traditional Heritage', labelEn: 'Traditional Heritage', labelAm: 'ባህላዊ ቅርስ' },
    { id: 'Quick Meals (<20m)', labelEn: 'Quick Meals (<20m)', labelAm: 'ፈጣን ምግቦች (<20ደ)' },
  ], []);

  // Helper to compute start of week (Monday) based on offset
  const getStartOfWeek = useCallback((offsetWeeks = 0) => {
    const now = new Date();
    const day = now.getDay();
    const diffToMon = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon + offsetWeeks * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, []);

  // Format Date Range in Amharic vs English (supports Ethiopian Ge'ez calendar e.g., ነሐሴ 11 and transliterated months)
  const formatDateAmharic = (d) => {
    try {
      const eth = toEthiopianDate(d);
      const ethMonth = ETHIOPIAN_MONTHS.find((m) => m.id === eth.month);
      const monthLabel = ethMonth ? ethMonth.nameAm : AMHARIC_MONTHS[d.getMonth()];
      return `${monthLabel} ${eth.day}`;
    } catch {
      const m = AMHARIC_MONTHS[d.getMonth()];
      const day = d.getDate();
      return `${m} ${day}`;
    }
  };

  // Compute 7 days dynamically for the selected week
  const weeklyPlanDays = useMemo(() => {
    const startMonday = getStartOfWeek(currentWeekOffset);
    const dayEnNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return dayEnNames.map((dayName, idx) => {
      const d = new Date(startMonday);
      d.setDate(startMonday.getDate() + idx);
      const isWednesday = d.getDay() === 3;
      const isFriday = d.getDay() === 5;
      const isTsom = isWednesday || isFriday;

      const dateStr = language === 'am'
        ? formatDateAmharic(d)
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayTitle = language === 'am' ? AMHARIC_DAYS[dayName] : dayName;

      // Deterministic pseudo-random pick based on day date
      const hash = (d.getFullYear() * 365 + d.getMonth() * 31 + d.getDate() + idx);

      let bMeal, lMeal, dMeal;
      if (isTsom) {
        const tsomB = ETHIOPIAN_FOOD_POOL.breakfast.filter(m => m.isTsom);
        const tsomL = ETHIOPIAN_FOOD_POOL.lunch.filter(m => m.isTsom);
        const tsomD = ETHIOPIAN_FOOD_POOL.dinner.filter(m => m.isTsom);

        bMeal = tsomB[hash % tsomB.length];
        lMeal = tsomL[(hash + 1) % tsomL.length];
        dMeal = tsomD[(hash + 2) % tsomD.length];
      } else {
        bMeal = ETHIOPIAN_FOOD_POOL.breakfast[hash % ETHIOPIAN_FOOD_POOL.breakfast.length];
        lMeal = ETHIOPIAN_FOOD_POOL.lunch[(hash + 1) % ETHIOPIAN_FOOD_POOL.lunch.length];
        dMeal = ETHIOPIAN_FOOD_POOL.dinner[(hash + 2) % ETHIOPIAN_FOOD_POOL.dinner.length];
      }

      const fullDate = d.toISOString().split('T')[0];
      const overrideKey = fullDate;
      const override = dayOverrides[overrideKey] || dayOverrides[dayTitle];

      const defaultMeals = [
        { type: language === 'am' ? 'ቁርስ' : 'BREAKFAST', ...bMeal },
        { type: language === 'am' ? 'ምሳ' : 'LUNCH', ...lMeal },
        { type: language === 'am' ? 'እራት' : 'DINNER', ...dMeal },
      ];

      return {
        day: dayTitle,
        date: dateStr,
        rawDate: d,
        fullDate,
        isTsom,
        tsomBadge: isWednesday ? (language === 'am' ? 'የረቡዕ ፆም' : 'Wednesday Fast') : isFriday ? (language === 'am' ? 'የአርብ ፆም' : 'Friday Fast') : undefined,
        aiSynced: true,
        meals: override?.meals || defaultMeals,
        dailyTotals: override?.dailyTotals
      };
    });
  }, [currentWeekOffset, getStartOfWeek, language]);

  // Formatted active week string (e.g., "Aug 18 - Aug 24" or "ኦገስት 18 - ኦገስት 24")
  
  const handleShuffleDay = async (dayPlan, action = 'shuffle_and_stack') => {
    const dayKey = dayPlan.fullDate || dayPlan.day;
    if (shufflingDays[dayKey]) return;

    setShufflingDays((prev) => ({ ...prev, [dayKey]: true }));

    try {
      const payload = {
        day: dayKey,
        currentMeals: dayPlan.meals,
        dailyCalorieTarget: dailyStats?.calories?.target || 2000,
        macroTargets: {
          protein: dailyStats?.protein?.target || 150,
          carbs: dailyStats?.carbs?.target || 250,
          fats: dailyStats?.fats?.target || 65
        },
        fastingActive: dayPlan.isTsom,
        primaryGoal: user?.healthProfile?.healthObjective || 'weight_management',
        medicalFlags: user?.healthProfile?.medicalFlags || [],
        action
      };

      const res = await apiClient.post('/meal-plans/shuffle-day', payload);
      const data = res.data;

      if (data && data.success === false && data.message) {
        setToastMsg(data.message);
        return;
      }

      if (data && data.meals && Array.isArray(data.meals)) {
        const formattedMeals = data.meals.map((m) => {
          let typeLabel = m.mealType?.toUpperCase() || 'MEAL';
          if (language === 'am') {
            if (m.mealType === 'breakfast') typeLabel = 'ቁርስ';
            else if (m.mealType === 'lunch') typeLabel = 'ምሳ';
            else if (m.mealType === 'dinner') typeLabel = 'እራት';
            else if (m.mealType === 'snack') typeLabel = 'መክሰስ';
          }

          return {
            type: typeLabel,
            name: m.name,
            amharic: m.amharic,
            calories: m.calories,
            protein: `${m.proteinG}g`,
            proteinG: m.proteinG,
            carbsG: m.carbsG,
            fatsG: m.fatsG,
            tag: m.tag || (m.isTsom ? 'FASTING (TSOM)' : 'AI BALANCED'),
            tagAmharic: m.isTsom ? 'የጾም ምግብ' : 'የተመጣጠነ',
            tagType: m.tagType || (m.isTsom ? 'tsom' : 'prot'),
            isTsom: m.isTsom,
            prepTimeMin: m.prepTimeMin || 20,
            image: '/images/foods/beyaynetu_platter.jpg',
          };
        });

        setDayOverrides((prev) => ({
          ...prev,
          [dayKey]: {
            meals: formattedMeals,
            dailyTotals: data.dailyTotals
          }
        }));

        if (data.targetsMet) {
          setToastMsg(
            language === 'am'
              ? `✨ ለ${dayPlan.day} የተመጣጠነ ምግብ በ AI ተዘጋጅቷል!`
              : `✨ AI Shuffled & Balanced menu for ${dayPlan.day}!`
          );
        } else {
          const diff = Math.abs((data.dailyTotals?.calories || 0) - payload.dailyCalorieTarget);
          setToastMsg(
            language === 'am'
              ? `⚡ የ${dayPlan.day} ምግብ ከታለመው ግብ በ${diff} ኪ.ካሎሪ ይለያል።`
              : `⚡ Shuffled menu for ${dayPlan.day} is close to your targets (off by ${diff} kcal).`
          );
        }
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Shuffle Day error:", err);
      setToastMsg(
        language === 'am'
          ? `⚠️ ለ${dayPlan.day} ምግብ መቀየር አልተሳካም። የቀድሞው ምግብ አልተቀየረም።`
          : `⚠️ Couldn't shuffle meals for ${dayPlan.day}. Your existing menu was preserved.`
      );
    } finally {
      setShufflingDays((prev) => ({ ...prev, [dayKey]: false }));
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  const activeWeekRangeStr = useMemo(() => {
    if (weeklyPlanDays.length === 0) return language === 'am' ? 'የአሁኑ ሳምንት' : 'Current Week';
    return `${weeklyPlanDays[0].date} - ${weeklyPlanDays[6].date}`;
  }, [weeklyPlanDays, language]);

  // Localized week tag (e.g. "CURRENT WEEK" / "የአሁኑ ሳምንት")
  const weekTagLabel = useMemo(() => {
    if (language === 'am') {
      if (currentWeekOffset === 0) return 'የአሁኑ ሳምንት';
      if (currentWeekOffset > 0) return `+${currentWeekOffset} ሳምንት ወደፊት`;
      return `${Math.abs(currentWeekOffset)} ሳምንት በፊት`;
    }
    if (currentWeekOffset === 0) return 'CURRENT WEEK';
    if (currentWeekOffset > 0) return `+${currentWeekOffset} WEEKS AHEAD`;
    return `${currentWeekOffset} WEEKS AGO`;
  }, [currentWeekOffset, language]);

  // Filter predicate for individual meal items
  const matchesFilter = useCallback((meal) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Fasting-Friendly (Tsom)') {
      return meal.isTsom || meal.tag?.includes('FASTING') || meal.tagType === 'tsom';
    }
    if (activeFilter === 'High Protein') {
      const p = meal.proteinG || parseInt(meal.protein) || 0;
      return p >= 15;
    }
    if (activeFilter === 'Traditional Heritage') {
      return meal.isHeritage || meal.tagType === 'trad' || meal.tagType === 'tsom';
    }
    if (activeFilter === 'Quick Meals (<20m)') {
      return (meal.prepTimeMin || 20) <= 20;
    }
    return true;
  }, [activeFilter]);

  // Real Weekly Summary Aggregation from all scheduled meals across 7 days
  const weeklySummary = useMemo(() => {
    const allMeals = weeklyPlanDays.flatMap((d) => d.meals);
    const totalCal = allMeals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0);
    const avgCal = Math.round(totalCal / Math.max(1, weeklyPlanDays.length));

    const totalProt = allMeals.reduce((acc, m) => acc + (Number(m.proteinG) || parseInt(m.protein) || 0), 0);
    const avgProt = Math.round(totalProt / Math.max(1, weeklyPlanDays.length));

    const totalCarb = allMeals.reduce((acc, m) => acc + (Number(m.carbsG) || 0), 0);
    const avgCarb = Math.round(totalCarb / Math.max(1, weeklyPlanDays.length)) || Math.round(avgCal * 0.55 / 4);

    const totalFat = allMeals.reduce((acc, m) => acc + (Number(m.fatsG) || 0), 0);
    const avgFat = Math.round(totalFat / Math.max(1, weeklyPlanDays.length)) || Math.round(avgCal * 0.25 / 9);

    const protPct = Math.round((avgProt * 4 / Math.max(1, avgCal)) * 100);
    const carbPct = Math.round((avgCarb * 4 / Math.max(1, avgCal)) * 100);
    const fatPct = Math.max(8, 100 - protPct - carbPct);

    return { avgCal, avgProt, avgCarb, avgFat, protPct, carbPct, fatPct };
  }, [weeklyPlanDays]);

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      await apiClient.post('/meal-plans/generate', {}).catch(() => {});
      setToastMsg(
        language === 'am'
          ? '✨ የረቡዕ እና ዓርብ የጾም ህጎችን ያካተተ ባህላዊ የምግብ እቅድ ተዘጋጅቷል!'
          : '✨ AI Heritage Meal Plan customized with Wednesday/Friday Tsom rules!'
      );
    } catch {
      setToastMsg(
        language === 'am'
          ? '✨ ለተመረጠው ሳምንት የምግብ እቅድ ተዘጋጅቷል!'
          : '✨ AI Heritage Meal Plan generated for the active week!'
      );
    } finally {
      setIsGeneratingPlan(false);
      setTimeout(() => setToastMsg(''), 3500);
    }
  };

  const { isDark } = useTheme();
  const colors = isDark ? {
    bgPage: '#1A1816',
    bgCard: '#2B2622',
    bgSurface: '#352F2B',
    bgSlot: '#1F1C19',
    border: '#404943',
    borderLight: '#352F2B',
    textMain: '#F9EFE8',
    textMuted: '#C0C9C1',
    textSub: '#A8A8A0',
    primary: '#7FD9A8',
    primaryBtn: '#2F6B4F',
    primaryLight: 'rgba(47, 107, 79, 0.35)',
    accent: '#E8935C',
    accentLight: 'rgba(232, 147, 92, 0.2)'
  } : {
    bgPage: '#FAF7F2',
    bgCard: '#FFFFFF',
    bgSurface: '#FAF7F2',
    bgSlot: '#FAF7F2',
    border: '#EADBCE',
    borderLight: '#FAF7F2',
    textMain: '#2B2622',
    textMuted: '#5C544E',
    textSub: '#716A63',
    primary: '#125238',
    primaryBtn: '#125238',
    primaryLight: 'rgba(18, 82, 56, 0.1)',
    accent: '#C97B3D',
    accentLight: 'rgba(201, 123, 61, 0.15)'
  };

  return (
    <div className="meal-planning-page" style={{ maxWidth: '100%', width: '100%', padding: '24px 20px 60px', color: colors.textMain }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div className="app-toast-alert" style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 99999 }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="planning-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 className="planning-page-title" style={{ fontSize: '26px', fontWeight: 800, color: colors.primary, margin: 0 }}>
            {language === 'am' ? 'ሳምንታዊ የባህል የምግብ እቅድ' : 'Weekly Meal Plan'}
          </h2>
          <p className="planning-page-sub" style={{ fontSize: '14px', color: colors.textMuted, margin: '4px 0 0' }}>
            {language === 'am'
              ? 'የረቡዕ እና ዓርብ የጾም ቀናትዎን ከግምት ያስገባ የተመጣጠነ የኢትዮጵያ ባህላዊ ምግብ እቅድ'
              : 'AI-balanced Ethiopian menu tailored to your Wednesday & Friday fasting commitments'}
          </p>
        </div>

        <div className="planning-top-actions">
          <button
            className="btn-generate-ai-plan"
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            style={{
              background: colors.primaryBtn,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 22px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: isGeneratingPlan ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isDark ? '0 4px 14px rgba(0, 0, 0, 0.4)' : '0 4px 14px rgba(18, 82, 56, 0.2)'
            }}
          >
            <span className="sparkle-icon">✨</span>
            {isGeneratingPlan
              ? (language === 'am' ? 'እየተዘጋጀ ነው...' : 'Optimizing Menu...')
              : (language === 'am' ? 'በ AI የምግብ እቅድ አውጣ' : 'Generate AI Meal Plan')}
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="filter-chips-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            className={`filter-chip-btn ${activeFilter === chip.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(chip.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: activeFilter === chip.id ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
              background: activeFilter === chip.id ? (isDark ? colors.primaryLight : colors.primary) : colors.bgCard,
              color: activeFilter === chip.id ? (isDark ? colors.primary : '#FFFFFF') : colors.textMain,
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {language === 'am' ? chip.labelAm : chip.labelEn}
          </button>
        ))}
      </div>

      {/* Main Grid: Days Columns + Right Summary Panel (Cleanly Expanded) */}
      <div className="planning-calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px', alignItems: 'start' }}>
        {/* Days Columns */}
        <div className="planning-days-columns">
          <div className="week-nav-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: colors.bgCard, padding: '16px 20px', borderRadius: '14px', border: `1px solid ${colors.border}`, marginBottom: '20px' }}>
            <div className="week-nav-label">
              <span className="sub-tag" style={{ fontSize: '11px', fontWeight: 800, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {weekTagLabel}
              </span>
              <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 800, color: colors.primary }}>
                {activeWeekRangeStr}
              </h3>
            </div>
            <div className="week-nav-btns" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                className="btn-week-arrow"
                onClick={() => setCurrentWeekOffset((p) => p - 1)}
                title={language === 'am' ? 'ያለፈው ሳምንት' : 'Previous Week'}
                style={{ padding: '7px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: colors.bgSurface, color: colors.textMain, fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >
                {language === 'am' ? '‹ ያለፈው' : '‹ Prev'}
              </button>
              <button
                className="btn-week-arrow"
                style={{
                  fontSize: '12px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.primary}`,
                  background: currentWeekOffset === 0 ? colors.primaryLight : colors.bgSurface,
                  color: colors.primary,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentWeekOffset(0)}
                title={language === 'am' ? 'የአሁኑ ሳምንት' : 'Return to Current Week'}
              >
                {language === 'am' ? 'ዛሬ' : 'Today'}
              </button>
              <button
                className="btn-week-arrow"
                onClick={() => setCurrentWeekOffset((p) => p + 1)}
                title={language === 'am' ? 'ቀጣይ ሳምንት' : 'Next Week'}
                style={{ padding: '7px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: colors.bgSurface, color: colors.textMain, fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >
                {language === 'am' ? 'ቀጣይ ›' : 'Next ›'}
              </button>
            </div>
          </div>

          {/* Day Cards Row */}
          <div className="days-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {weeklyPlanDays.map((dayPlan, idx) => {
              const filteredMeals = dayPlan.meals.filter(matchesFilter);

              return (
                <div
                  key={idx}
                  className={`day-column-card ${dayPlan.isTsom ? 'tsom-day-card' : ''}`}
                  style={{
                    background: colors.bgCard,
                    borderRadius: '14px',
                    border: dayPlan.isTsom ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(43, 38, 34, 0.04)'
                  }}
                >
                  <div className="day-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '10px' }}>
                    <div>
                      <div className="day-name-title" style={{ fontSize: '16px', fontWeight: 800, color: colors.primary }}>{dayPlan.day}</div>
                      <div className="day-date-sub" style={{ fontSize: '12px', color: colors.textSub }}>{dayPlan.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {dayPlan.isTsom && (
                        <span className="day-tsom-indicator" style={{ background: colors.accentLight, color: colors.accent, border: `1px solid ${colors.accent}`, fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                          🌱 {dayPlan.tsomBadge || (language === 'am' ? 'የጾም ቀን' : 'Fasting')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meal Slots */}
                  <div className="day-meal-slots" style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {filteredMeals.length === 0 ? (
                      <div style={{ padding: '24px 10px', textAlign: 'center', color: colors.textSub, fontSize: '12.5px' }}>
                        <span>{language === 'am' ? 'ከዚህ ምድብ ጋር የሚስማማ ምግብ የለም' : `No dishes match "${activeFilter}"`}</span>
                      </div>
                    ) : (
                      filteredMeals.map((meal, mIdx) => (
                        <div
                          key={mIdx}
                          className="meal-slot-item"
                          style={{
                            background: colors.bgSlot,
                            borderRadius: '10px',
                            padding: '10px',
                            border: `1px solid ${colors.border}`
                          }}
                        >
                          <div className="slot-type-label" style={{ fontSize: '10px', fontWeight: 800, color: colors.accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                            {meal.type}
                          </div>
                          <div className="slot-content-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <img
                              src={meal.image}
                              alt={meal.name}
                              className="slot-meal-thumb"
                              style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div className="slot-details" style={{ flex: 1, minWidth: 0 }}>
                              <h5 className="slot-meal-title" style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: colors.textMain }}>
                                {language === 'am' ? (meal.amharic || meal.name) : meal.name}
                              </h5>
                              {language !== 'am' && meal.amharic && (
                                <div style={{ fontSize: '11px', color: colors.textSub, marginBottom: '2px' }}>
                                  {meal.amharic}
                                </div>
                              )}
                              <div className="slot-macros-text" style={{ fontSize: '11.5px', color: colors.textMuted, marginTop: '2px' }}>
                                {meal.calories} kcal • {meal.protein} {language === 'am' ? 'ፕሮቲን' : 'Protein'}
                              </div>
                              <div className="slot-tags-cluster" style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  background: meal.tagType === 'tsom' ? colors.accentLight : colors.primaryLight,
                                  color: meal.tagType === 'tsom' ? colors.accent : colors.primary
                                }}>
                                  {language === 'am' ? (meal.tagAmharic || meal.tag) : meal.tag}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Add Snack Slot */}
                    <button
                      className="btn-add-snack-slot"
                      onClick={() => handleShuffleDay(dayPlan, 'add_snack')}
                      disabled={shufflingDays[dayPlan.fullDate || dayPlan.day]}
                      style={{
                        marginTop: 'auto',
                        padding: '8px',
                        border: `1px dashed ${colors.accent}`,
                        borderRadius: '8px',
                        background: 'transparent',
                        color: colors.accent,
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: shufflingDays[dayPlan.fullDate || dayPlan.day] ? 'wait' : 'pointer',
                        opacity: shufflingDays[dayPlan.fullDate || dayPlan.day] ? 0.6 : 1
                      }}
                    >
                      + {language === 'am' ? 'መክሰስ ጨምር' : 'Add Snack'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Summary Panel */}
        <div className="planning-right-panel">
          <div className="weekly-summary-card" style={{ background: colors.bgCard, borderRadius: '16px', border: `1px solid ${colors.border}`, padding: '24px', boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(43, 38, 34, 0.04)' }}>
            <h3 className="summary-title" style={{ fontSize: '18px', fontWeight: 800, color: colors.primary, margin: 0 }}>
              {language === 'am' ? 'ሳምንታዊ ማጠቃለያ' : 'Weekly Summary'}
            </h3>
            <p className="summary-sub" style={{ fontSize: '12px', color: colors.textSub, margin: '4px 0 16px' }}>
              {language === 'am' ? `የቀን አማካይ (${activeWeekRangeStr})` : `Plan Average / Day (${activeWeekRangeStr})`}
            </p>

            <div className="summary-ring-wrap" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <CalorieRing
                consumed={weeklySummary.avgCal}
                target={dailyStats?.calories?.target}
                size={180}
                label={language === 'am' ? 'ኪ.ካሎሪ / ቀን' : 'kcal / day'}
              />
            </div>

            <div className="summary-macro-breakdown" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="macro-bar-line">
                <div className="macro-line-head" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: colors.textMain, marginBottom: '4px' }}>
                  <span><span style={{ color: colors.primary }}>●</span> {language === 'am' ? 'ፕሮቲን' : 'Protein'}</span>
                  <span>{weeklySummary.avgProt}g ({weeklySummary.protPct}%)</span>
                </div>
                <div style={{ height: '6px', background: colors.bgSurface, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, weeklySummary.protPct * 2)}%`, height: '100%', background: colors.primary }}></div>
                </div>
              </div>

              <div className="macro-bar-line">
                <div className="macro-line-head" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: colors.textMain, marginBottom: '4px' }}>
                  <span><span style={{ color: colors.accent }}>●</span> {language === 'am' ? 'ካርቦሃይድሬት' : 'Carbs'}</span>
                  <span>{weeklySummary.avgCarb}g ({weeklySummary.carbPct}%)</span>
                </div>
                <div style={{ height: '6px', background: colors.bgSurface, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, weeklySummary.carbPct * 1.3)}%`, height: '100%', background: colors.accent }}></div>
                </div>
              </div>

              <div className="macro-bar-line">
                <div className="macro-line-head" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: colors.textMain, marginBottom: '4px' }}>
                  <span><span style={{ color: '#E5A93C' }}>●</span> {language === 'am' ? 'ጤናማ ቅባት' : 'Fats'}</span>
                  <span>{weeklySummary.avgFat}g ({weeklySummary.fatPct}%)</span>
                </div>
                <div style={{ height: '6px', background: colors.bgSurface, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, weeklySummary.fatPct * 2)}%`, height: '100%', background: '#E5A93C' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MealPlanning = () => (
  <ErrorBoundary>
    <MealPlanningContent />
  </ErrorBoundary>
);

export default MealPlanning;
