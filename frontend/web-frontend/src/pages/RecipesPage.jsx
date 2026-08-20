import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';
import useFavoriteRecipes from '../hooks/useFavoriteRecipes';
import FavoriteRecipeButton from '../components/recipes/FavoriteRecipeButton';

const RECIPES_DATA = [
  {
    id: 'doro-wat',
    name: 'Doro Wat (Traditional Chicken Stew)',
    nameAm: 'ዶሮ ወጥ (ባህላዊ የዶሮ ወጥ)',
    amharicName: 'ዶሮ ወጥ',
    category: 'traditional',
    isFasting: false,
    calories: 680,
    protein: 42,
    carbs: 64,
    fats: 22,
    prepTimeEn: '60 mins',
    prepTimeAm: '60 ደቂቃ',
    servings: 4,
    difficultyEn: 'Intermediate',
    difficultyAm: 'መካከለኛ',
    image: '/images/doro-wat.jpg',
    descriptionEn: 'The crown jewel of Ethiopian festive cuisine. Slow-simmered chicken drumsticks and hardboiled eggs enveloped in a rich, spicy berbere reduction infused with korerima and niter kibbeh.',
    descriptionAm: 'የኢትዮጵያ የክብረ በዓላት ማዕድ ዋነኛ ምግብ። በቅቤ፣ በርበሬ፣ ነጭ ሽንኩርት፣ ዝንጅብልና ኮረሪማ ተንተክትኮ የሚዘጋጅ የዶሮ ስጋ እና የተቀቀለ እንቁላል ወጥ።',
    ingredientsEn: [
      '1 kg Chicken drumsticks & thighs',
      '4 Hardboiled eggs, pierced',
      '4 Large red onions, finely diced (slow caramelization)',
      '3 tbsp Berbere spice blend',
      '2 tbsp Niter Kibbeh (spiced clarified butter)',
      '4 Cloves garlic & 2 tbsp grated ginger',
      '1/2 tsp Korerima (Ethiopian black cardamom)',
      'Fresh lemon juice & salt to taste'
    ],
    ingredientsAm: [
      '1 ኪሎ የዶሮ ስጋ (ጭን እና ክንፍ)',
      '4 የተቀቀሉ እንቁላሎች',
      '4 ትላልቅ ቀይ ሽንኩርት (በደቃቁ የተከተፈ)',
      '3 የሾርባ ማንኪያ ጥሩ የደለዘ በርበሬ',
      '2 የሾርባ ማንኪያ አንጓሎ የተዘጋጀ ንጥር ቅቤ',
      '4 ጥርስ ነጭ ሽንኩርት እና የተፈጨ ዝንጅብል',
      '1/2 የሻይ ማንኪያ የተፈጨ ኮረሪማ እና መከለሻ',
      'የሎሚ ጭማቂ እና ጨው እንደ ፍላጎት'
    ],
    instructionsEn: [
      'Clean chicken with fresh lemon water and make slight diagonal slits for flavor absorption.',
      'Dry simmer the diced onions in a heavy pot over low heat until deeply golden brown and moisture evaporates.',
      'Add berbere spice and niter kibbeh; sauté for 10-15 minutes until fragrant and oil separates.',
      'Stir in garlic, ginger, and korerima. Add chicken pieces and simmer gently for 35 minutes.',
      'Gently submerge pierced hardboiled eggs during the final 10 minutes. Serve hot on teff injera.'
    ],
    instructionsAm: [
      'የዶሮውን ስጋ በሎሚ ውሃ አጥበው ቅመሙ እንዲገባበት በስሱ ይሸንሽኑት።',
      'በደቃቁ የተከተፈውን ሽንኩርት በድስት ላይ ያለ ዘይት በዝግታ እያማሰሉ ቡናማ እስኪሆን ያቁላሉ።',
      'በርበሬ እና ንጥር ቅቤ ጨምረው ለ10-15 ደቂቃ መዓዛው እስኪወጣ ድረስ በደንብ ያቁላሉ።',
      'ነጭ ሽንኩርት፣ ዝንጅብል እና ኮረሪማ ጨምረው ስጋውን አዋህደው ለ35 ደቂቃ ያብስሉት።',
      'የተቀቀሉትን እንቁላሎች በሹካ በስሱ ወግተው ወጡ ውስጥ ጨምረው ለ10 ደቂቃ አንተክትከው በጤፍ እንጀራ ያቅርቡ።'
    ],
    nutritionHighlightsEn: 'Exceptionally high in bioavailable iron, zinc, and protein. Paired with whole grain teff injera for complete amino acid profiles.',
    nutritionHighlightsAm: 'በከፍተኛ የብረት (Iron)፣ ዚንክ እና የተሟላ ፕሮቲን ይዘት የበለጸገ። ከጤፍ እንጀራ ጋር ሲወሰድ የተሟላ አሚኖ አሲድ ይሰጣል።'
  },
  {
    id: 'shiro-tegamino',
    name: 'Shiro Tegamino (Clay Pot Chickpea Stew)',
    nameAm: 'ሽሮ ተጋሚኖ (በሸክላ ድስት የሚንተከተክ)',
    amharicName: 'ሽሮ ተጋሚኖ',
    category: 'fasting',
    isFasting: true,
    calories: 420,
    protein: 24,
    carbs: 58,
    fats: 10,
    prepTimeEn: '20 mins',
    prepTimeAm: '20 ደቂቃ',
    servings: 2,
    difficultyEn: 'Easy',
    difficultyAm: 'ቀላል',
    image: '/images/shiro.jpg',
    descriptionEn: 'A comforting, velvety stew made from roasted spiced chickpea flour simmered with garlic, onions, and herbal besobila, served bubbling hot in an earthenware clay pot.',
    descriptionAm: 'ከተቆላና በቅመማ ቅመም ከተፈጨ የሽሮ ዱቄት፣ ነጭ ሽንኩርት፣ ዝንጅብልና በሶቢላ ጋር በሸክላ ድስት ተንተክትኮ የሚቀርብ ተወዳጅ የጾም ምግብ።',
    ingredientsEn: [
      '1 cup Mitten Shiro flour (sun-dried spiced chickpea flour)',
      '1 Medium red onion, minced',
      '3 Cloves garlic, minced',
      '2 tbsp Vegetable or sesame oil (or niter kibbeh on feasting days)',
      '1 Whole green chili pepper (Karia)',
      '1/2 tsp Besobila (sacred Ethiopian basil)',
      '2.5 cups Warm water or vegetable broth'
    ],
    ingredientsAm: [
      '1 ኩባያ ጥሩ የሚጥን ሽሮ ዱቄት',
      '1 መካከለኛ ቀይ ሽንኩርት (በደቃቁ የተከተፈ)',
      '3 ጥርስ ነጭ ሽንኩርት (የተከተፈ)',
      '2 የሾርባ ማንኪያ የሱፍ ዘይት ወይም የኑግ ዘይት',
      '1 ቃሪያ',
      '1/2 የሻይ ማንኪያ የደረቀ በሶቢላ',
      '2.5 ኩባያ የሞቀ ውሃ'
    ],
    instructionsEn: [
      'Sauté minced onions and garlic in cooking oil in a clay pot (tegamino) until translucent.',
      'Gradually whisk in the spiced shiro powder with warm water to prevent lumps.',
      'Simmer on medium-low heat for 12-15 minutes until thick, creamy, and bubbling.',
      'Top with a fresh green chili pepper and serve immediately with rolled injera.'
    ],
    instructionsAm: [
      'በሸክላ ድስት ላይ ሽንኩርት እና ነጭ ሽንኩርቱን በዘይት በደንብ ያቁላሉ።',
      'የሽሮውን ዱቄት በሞቀ ውሃ እያፈሰሱ እንዳይጓጉል በደንብ ያማስሉታል።',
      'እሳቱን ቀነስ አድርገው ለ12-15 ደቂቃ ያህል ወፍሮ እስኪንተከተክ ድረስ ያብስሉት።',
      'በላዩ ላይ ቃሪያ እና በሶቢላ ነስንሰው ትኩስ በሆነው እንጀራ አቅርበው ይመገቡ።'
    ],
    nutritionHighlightsEn: 'Rich in plant-based soluble fiber, potassium, and magnesium. Excellent staple for sustained fasting satiety and blood sugar stabilization.',
    nutritionHighlightsAm: 'በተፈጥሮ ፋይበር፣ ፖታሲየም እና ማግኒዚየም የበለጸገ። በጾም ወቅት ረሃብን ለመቋቋም እና የስኳር መጠንን ለማስተካከል እጅግ ተስማሚ ነው።'
  },
  {
    id: 'yetsom-beyaynetu',
    name: 'Yetsom Beyaynetu (Fasting Rainbow Platter)',
    nameAm: 'የጾም በያይነቱ (የተሟላ የጾም ማዕድ)',
    amharicName: 'የጾም በያይነቱ',
    category: 'fasting',
    isFasting: true,
    calories: 520,
    protein: 28,
    carbs: 88,
    fats: 8,
    prepTimeEn: '45 mins',
    prepTimeAm: '45 ደቂቃ',
    servings: 3,
    difficultyEn: 'Intermediate',
    difficultyAm: 'መካከለኛ',
    image: '/images/bayenetu.jpg',
    descriptionEn: 'A colorful mosaic of plant-based fasting stews including spicy red lentils (misir), mild yellow split peas (kik), steamed collard greens (gomen), and spiced cabbage (atkilt).',
    descriptionAm: 'የተለያዩ የጾም ወጦች ስብስብ፡ ምስር ወጥ፣ ክክ አልጫ፣ የጎመን ክክ፣ የአትክልት ወጥ እና የቀይ ስር ሰላጣ በአንድ ላይ በጤፍ እንጀራ ላይ የሚያምር ማዕድ።',
    ingredientsEn: [
      '1 cup Red lentils (Misir)',
      '1 cup Yellow split peas (Kik)',
      '1 bunch Fresh collard greens (Gomen), chopped',
      '2 cups Cabbage & carrots, chopped (Atkilt)',
      'Fresh beetroot salad',
      'Berbere, turmeric, garlic, ginger, and shallots',
      'Fresh pure Teff Injera'
    ],
    ingredientsAm: [
      '1 ኩባያ የድልህ ቀይ ምስር',
      '1 ኩባያ የክክ ክክ አልጫ',
      '1 ጭብጥ የተከተፈ የሀበሻ ጎመን',
      '2 ኩባያ የተከተፈ ጥቅል ጎመን እና ካሮት',
      'የቀይ ስር እና ድንች ሰላጣ',
      'በርበሬ፣ እርድ፣ ነጭ ሽንኩርትና ዝንጅብል',
      'የሰርገኛ ወይም የነጭ ጤፍ እንጀራ'
    ],
    instructionsEn: [
      'Cook Misir Wot with berbere and onions until soft and velvety.',
      'Cook Kik Alicha with turmeric, ginger, and garlic for a mild golden contrast.',
      'Steam collard greens with garlic and ginger; sauté cabbage with carrots.',
      'Arrange artfully in vibrant portions atop a large round platter of teff injera.'
    ],
    instructionsAm: [
      'ምስር ወጡን በበርበሬና ሽንኩርት ለስልሶ እስኪበስል ድረስ ያብስሉት።',
      'ክክ አልጫውን በእርድ፣ ነጭ ሽንኩርትና ዝንጅብል ወርቃማ ቀለም እንዲኖረው አድርገው ያዘጋጁት።',
      'ጎመኑን እና ጥቅል ጎመኑን በቅመማ ቅመም ለየብቻ ቀቅለው ያቁላሉ።',
      'በሰፊ የሰፌድ እንጀራ ላይ ሁሉንም ወጦች በውብ አቀማመጥ ደልድለው ያቅርቡ።'
    ],
    nutritionHighlightsEn: 'Provides a complete spectrum of phytonutrients, prebiotics, non-heme iron, and dietary fiber across multiple legume and vegetable groups.',
    nutritionHighlightsAm: 'የተሟላ የዕፅዋት ንጥረ-ነገሮችን፣ አንቲኦክሲዳንትስ፣ ብረት እና ፋይበርን በአንድ ላይ በማካተት በሽታ የመከላከል አቅምን ያጠናክራል።'
  },
  {
    id: 'derek-tibs',
    name: 'Sizzling Derek Tibs (Crisp Sautéed Beef)',
    nameAm: 'ድስ ጥብስ (የበሬ ድርቅ ጥብስ)',
    amharicName: 'ድስ ጥብስ',
    category: 'high-protein',
    isFasting: false,
    calories: 590,
    protein: 48,
    carbs: 22,
    fats: 32,
    prepTimeEn: '25 mins',
    prepTimeAm: '25 ደቂቃ',
    servings: 2,
    difficultyEn: 'Easy',
    difficultyAm: 'ቀላል',
    image: '/images/tibs.jpg',
    descriptionEn: 'Tender cubes of beef seared in a smoking cast-iron skillet with onions, garlic, fresh rosemary sprigs, and sliced green chilies, served with awaze dipping sauce.',
    descriptionAm: 'በጋለ የብረት መጥበሻ ወይም በድስ ላይ በሽንኩርት፣ ቃሪያ፣ ነጭ ሽንኩርት እና ሮዝማሪ (የጥብስ ቅጠል) ተጠብሶ ከአዋዜ ጋር የሚቀርብ የበሬ ጥብስ።',
    ingredientsEn: [
      '500g Lean beef sirloin or tenderloin, cubed',
      '1 Large red onion, sliced',
      '2 Fresh jalapenos or serano peppers, sliced',
      '2 Fresh rosemary sprigs',
      '2 tbsp Niter Kibbeh or ghee',
      '2 cloves Garlic, crushed',
      'Awaze paste (berbere + tej/water) for dipping'
    ],
    ingredientsAm: [
      '500ግ ለስላሳ የበሬ ስጋ (በቁራጭ የተከተፈ)',
      '1 ትልቅ ቀይ ሽንኩርት (በስሱ የተከተፈ)',
      '2 ቃሪያ (በቁመት የተሰነጠቀ)',
      'የጥብስ ቅጠል (ሮዝማሪ)',
      '2 የሾርባ ማንኪያ ንጥር ቅቤ',
      'ነጭ ሽንኩርት እና ጨው',
      'ለማባያ የሚሆን አዋዜ ወይም ሚጥሚጣ'
    ],
    instructionsEn: [
      'Heat a heavy skillet or clay stove until smoking hot.',
      'Sear the beef cubes quickly over high heat until browned on all sides.',
      'Add niter kibbeh, rosemary, onions, and sliced peppers; toss vigorously for 3-4 minutes.',
      'Serve sizzling hot directly in the skillet with fresh injera and awaze dip.'
    ],
    instructionsAm: [
      'ድስቱን ወይም መጥበሻውን እሳት ላይ አግለው ስጋውን በከፍተኛ ሙቀት ይጠብሱት።',
      'ቅቤ፣ የጥብስ ቅጠል፣ ሽንኩርትና ቃሪያውን ጨምረው ለ3-4 ደቂቃ ያገላብጡት።',
      'ትኩስነቱ ሳይበርድ ከእንጀራ እና ከአዋዜ ጋር አቅርበው ይመገቡ።'
    ],
    nutritionHighlightsEn: 'High protein density with essential amino acids, creatine, and easily absorbed heme iron.',
    nutritionHighlightsAm: 'ከፍተኛ የፕሮቲን መጠን፣ አሚኖ አሲዶች እና በቀላሉ ወደ ሰውነት የሚገባ የብረት (Heme Iron) ይዘት አለው።'
  },
  {
    id: 'chechebsa',
    name: 'Chechebsa / Kita Firfir (Spiced Flatbread)',
    nameAm: 'ጨጨብሳ (ቂጣ ፍርፍር በቅቤና ማር)',
    amharicName: 'ጨጨብሳ',
    category: 'quick',
    isFasting: false,
    calories: 460,
    protein: 16,
    carbs: 68,
    fats: 14,
    prepTimeEn: '15 mins',
    prepTimeAm: '15 ደቂቃ',
    servings: 2,
    difficultyEn: 'Easy',
    difficultyAm: 'ቀላል',
    image: '/images/chechebsa.jpg',
    descriptionEn: 'A beloved traditional morning breakfast. Warm, pan-cooked unleavened flatbread torn into bite-sized pieces and tossed in golden niter kibbeh, berbere spice, and pure honey.',
    descriptionAm: 'ተወዳጅ ባህላዊ የቁርስ ምግብ። ለስላሳ የቂጣ ቁርጥራጮች በንጥር ቅቤ እና በርበሬ ተለውሰው ከንጹህ ማር እና እርጎ ጋር የሚቀርቡበት ጣፋጭ ምግብ።',
    ingredientsEn: [
      '1.5 cups Whole wheat or teff flour',
      '1 cup Water + pinch of salt',
      '2 tbsp Niter kibbeh (or sesame oil for fasting adaptation)',
      '1 tsp Berbere spice',
      '1 tbsp Pure raw Ethiopian honey',
      'Plain yogurt / Ayib on the side'
    ],
    ingredientsAm: [
      '1.5 ኩባያ የጤፍ ወይም የስንዴ ዱቄት',
      '1 ኩባያ ውሃ እና ቁንጥጫ ጨው',
      '2 የሾርባ ማንኪያ ንጥር ቅቤ (ለጾም በዘይት ይተካል)',
      '1 የሻይ ማንኪያ በርበሬ',
      '1 የሾርባ ማንኪያ ንጹህ የማር ወለላ',
      'እርጎ ወይም አይብ በማባያነት'
    ],
    instructionsEn: [
      'Mix flour and water into a smooth batter; cook into a thin golden flatbread (kita).',
      'Tear the warm flatbread into small bite-sized squares.',
      'In a warm skillet, melt niter kibbeh with berbere spice.',
      'Toss the torn flatbread in the spiced butter until thoroughly coated and aromatic.',
      'Drizzle with honey and serve with warm spiced tea.'
    ],
    instructionsAm: [
      'ዱቄቱን በውሃ ለውሰው በምጣድ ላይ ስስ ቂጣ ጋግረው ያውጡ።',
      'ቂጣውን በደቃቁ ቆራርጠው ያዘጋጁ።',
      'በመጥበሻ ላይ ቅቤውን አቅልጠው በርበሬውን ያዋህዱት።',
      'የተቆራረጠውን ቂጣ ጨምረው ቅቤው በደንብ እስኪዋሃደው ድረስ ያገላብጡት።',
      'ማር አፍስሰውበት ከሞቀ የቅመም ሻይ ጋር ያቅርቡት።'
    ],
    nutritionHighlightsEn: 'Quick complex energy release, healthy fats for hormone production, and warming spices that stimulate digestion.',
    nutritionHighlightsAm: 'ቀኑን በሙሉ የሚቆይ ኃይል ይሰጣል፣ ለምግብ መፈጨት የሚረዱ ባህላዊ ቅመሞች አሉት።'
  },
  {
    id: 'misir-wot',
    name: 'Misir Wot (Spicy Red Lentil Stew)',
    nameAm: 'ምስር ወጥ (የደለዘ ቀይ ምስር ወጥ)',
    amharicName: 'ምስር ወጥ',
    category: 'fasting',
    isFasting: true,
    calories: 380,
    protein: 22,
    carbs: 56,
    fats: 6,
    prepTimeEn: '35 mins',
    prepTimeAm: '35 ደቂቃ',
    servings: 3,
    difficultyEn: 'Easy',
    difficultyAm: 'ቀላል',
    image: '/images/bayenetu.jpg',
    descriptionEn: 'Hearty split red lentils slow-simmered in a rich garlic, ginger, and berbere reduction. A fasting staple beloved across Ethiopia for its deep warmth and nutritional density.',
    descriptionAm: 'ቀይ ምስር በሽንኩርት፣ ነጭ ሽንኩርት፣ ዝንጅብልና በርበሬ ተንተክትኮ የሚዘጋጅ የጾም ምግብ። በከፍተኛ ፕሮቲን እና የብረት ንጥረ ነገር የበለጸገ።',
    ingredientsEn: [
      '1.5 cups Red split lentils, rinsed',
      '2 Red onions, finely diced',
      '2 tbsp Berbere spice blend',
      '3 cloves Garlic & 1 tbsp grated ginger',
      '2 tbsp Vegetable or olive oil',
      'Salt to taste'
    ],
    ingredientsAm: [
      '1.5 ኩባያ የታጠበ ቀይ ምስር',
      '2 ቀይ ሽንኩርት (በደቃቁ የተከተፈ)',
      '2 የሾርባ ማንኪያ በርበሬ',
      '3 ጥርስ ነጭ ሽንኩርት እና የተፈጨ ዝንጅብል',
      '2 የሾርባ ማንኪያ ዘይት',
      'ጨው እንደ ጣዕምዎ'
    ],
    instructionsEn: [
      'Dry cook diced onions in a saucepan until soft and sweet.',
      'Add oil, berbere, garlic, and ginger; cook for 8 minutes to build deep flavor.',
      'Add lentils and 3 cups hot water. Simmer on low for 25 minutes until creamy and tender.',
      'Season with salt and serve over warm injera.'
    ],
    instructionsAm: [
      'ሽንኩርቱን በድስት ላይ በደንብ ያቁላሉ።',
      'ዘይት፣ በርበሬ፣ ነጭ ሽንኩርት እና ዝንጅብል ጨምረው ያቁላሉ።',
      'ምስሩን እና 3 ኩባያ የፈላ ውሃ ጨምረው ምስሩ እስኪለሰልስ ለ25 ደቂቃ ያብስሉት።',
      'ጨው አስተካክለው በሞቀ እንጀራ ያቅርቡ።'
    ],
    nutritionHighlightsEn: 'Abundant in plant protein, folate, and iron. Synergizes with teff injera for complete plant protein bioavailability.',
    nutritionHighlightsAm: 'በዕፅዋት ፕሮቲን፣ ፎሌት እና ብረት የበለጸገ። ከጤፍ እንጀራ ጋር ተጣምሮ የተሟላ አልሚ ምግብ ይሰጣል።'
  }
];

const RecipesPage = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { addFoodLog } = useNutrition();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [toastMsg, setToastMsg] = useState('');


  const {
  favoriteRecipeIds,
  toggleFavorite,
  isFavorite,
} = useFavoriteRecipes();

  const filterChips = [
  {
    id: 'all',
    label: language === 'am' ? 'ሁሉም ምግቦች' : 'All Recipes',
  },
  {
    id: 'favorites',
    label: language === 'am' ? 'የተወደዱ' : 'Favorites',
  },
  {
    id: 'fasting',
    label: language === 'am' ? 'የጾም ምግቦች (Tsom)' : 'Fasting-Friendly',
  },
  {
    id: 'high-protein',
    label: language === 'am' ? 'ከፍተኛ ፕሮቲን' : 'High Protein',
  },
  {
    id: 'traditional',
    label: language === 'am' ? 'ባህላዊ ክላሲኮች' : 'Traditional Classics',
  },
  {
    id: 'quick',
    label: language === 'am' ? 'ቀላልና ፈጣን' : 'Quick Meals',
  },
];

  const filteredRecipes = useMemo(() => {
  return RECIPES_DATA.filter((recipe) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'favorites'
        ? favoriteRecipeIds.has(recipe.id)
        : activeCategory === 'fasting'
        ? recipe.isFasting
        : recipe.category === activeCategory;


      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        recipe.name.toLowerCase().includes(q) ||
        recipe.nameAm.includes(q) ||
        recipe.amharicName.includes(q) ||
        recipe.descriptionEn.toLowerCase().includes(q) ||
        recipe.descriptionAm.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, favoriteRecipeIds]);

  const handleLogRecipe = (recipe) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    addFoodLog({
      name: recipe.name,
      amharicName: recipe.amharicName,
      portion: language === 'am' ? '1 መደበኛ እጅ' : '1 full serving',
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fats: recipe.fats,
      category: 'lunch',
      isTsom: recipe.isFasting,
      image: recipe.image,
    });

    setToastMsg(language === 'am' ? `✨ ${recipe.amharicName} በተሳካ ሁኔታ ተመዝግቧል!` : `✨ ${recipe.name} logged to your dashboard!`);
    setSelectedRecipe(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="recipes-page">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="app-toast-alert" style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999 }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="how-hero-section">
        <div className="how-hero-container">
          <div className="landing-badge-pill">
            {language === 'am' ? 'የባህል ማዕድ እና የአመጋገብ ሳይንስ' : 'Heritage Kitchen & Macro Database'}
          </div>
          <h1 className="how-hero-title">
            {language === 'am' ? 'የኢትዮጵያ ባህላዊ የምግብ አዘገጃጀቶች' : 'Ethiopian Heritage Recipes & Nutrition'}
          </h1>
          <p className="how-hero-subtitle">
            {language === 'am'
              ? 'እያንዳንዱ ምግብ በካሎሪ፣ በፕሮቲን፣ በብረት እና በፋይበር መጠን በጥንቃቄ የተሰላ ነው። የጾም እና የፍስክ ምግቦችን በቀላሉ ያግኙ።'
              : 'Explore clinically verified macronutrient profiles, authentic ingredients, and fasting adaptations for classic Ethiopian culinary favorites.'}
          </p>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="recipes-filter-section">
        <div className="recipes-filter-container">
          {/* Search Box */}
          <div className="recipes-search-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={language === 'am' ? 'ምግብ ይፈልጉ (ለምሳሌ፡ ሽሮ፣ ዶሮ ወጥ፣ ምስር)...' : 'Search recipes by name, spice, or ingredient...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="recipes-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="recipes-chips-row">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`recipe-chip-btn ${activeCategory === chip.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="recipes-grid-section">
        <div className="recipes-grid-container">
          {filteredRecipes.length === 0 ? (
            <div className="recipes-empty-state">
              <span className="empty-icon">🍲</span>
             <h3>
  {activeCategory === 'favorites'
    ? language === 'am'
      ? 'የተወደዱ ምግቦች የሉም'
      : 'No favorite recipes yet'
    : language === 'am'
      ? 'ምንም አይነት ምግብ አልተገኘም'
      : 'No recipes found'}
</h3>
              <p>
  {activeCategory === 'favorites'
    ? language === 'am'
      ? 'በምግብ ካርዶች ላይ ያለውን ♡ ቁልፍ በመጫን የሚወዷቸውን ምግቦች ያስቀምጡ።'
      : 'Tap the ♡ button on any recipe to save it here for quick access.'
    : language === 'am'
      ? 'እባክዎ የፍለጋ ቃሉን ይቀይሩ ወይም ማጣሪያውን ያስተካክሉ።'
      : 'Try adjusting your search query or selecting a different category filter.'}
</p>
              <button
                type="button"
                className="landing-cta-primary"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              >
                {language === 'am' ? 'ሁሉንም አሳይ' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="recipes-cards-grid">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="recipe-card-item"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="recipe-card-media">
                <FavoriteRecipeButton
                 isFavorite={isFavorite(recipe.id)}
                 onToggle={() => toggleFavorite(recipe.id)}
                 />

                   <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="recipe-card-img"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="recipe-card-badges">
                      {recipe.isFasting ? (
                        <span className="recipe-badge-tsom">🌿 {language === 'am' ? 'የጾም ምግብ' : 'Fasting-Friendly'}</span>
                      ) : (
                        <span className="recipe-badge-meat">🍗 {language === 'am' ? 'የፍስክ ምግብ' : 'Feasting'}</span>
                      )}
                    </div>
                  </div>

                  <div className="recipe-card-content">
                    <div className="recipe-card-header">
                      <h3 className="recipe-card-title">
                        {language === 'am' ? recipe.nameAm : recipe.name}
                      </h3>
                      <span className="recipe-card-amharic">{recipe.amharicName}</span>
                    </div>

                    <p className="recipe-card-excerpt">
                      {language === 'am' ? recipe.descriptionAm : recipe.descriptionEn}
                    </p>

                    <div className="recipe-card-macros-pill-row">
                      <span className="macro-pill cal">{recipe.calories} {language === 'am' ? 'ካሎሪ' : 'kcal'}</span>
                      <span className="macro-pill pro">{recipe.protein}g {language === 'am' ? 'ፕሮቲን' : 'Protein'}</span>
                      <span className="macro-pill carb">{recipe.carbs}g {language === 'am' ? 'ካርቦሃይድሬት' : 'Carbs'}</span>
                      <span className="macro-pill fat">{recipe.fats}g {language === 'am' ? 'ቅባት' : 'Fat'}</span>
                    </div>

                    <div className="recipe-card-footer">
                      <span className="recipe-time">⏱ {language === 'am' ? recipe.prepTimeAm : recipe.prepTimeEn}</span>
                      <span className="recipe-view-btn">{language === 'am' ? 'ዝርዝር ይመልከቱ →' : 'View Recipe →'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="recipe-modal-backdrop" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="recipe-modal-close-btn"
              onClick={() => setSelectedRecipe(null)}
            >
              ✕
            </button>

            <div className="recipe-modal-scroll-area">
              <div className="recipe-modal-banner">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                  className="modal-banner-img"
                />
                <div className="modal-banner-badge">
                  {selectedRecipe.isFasting ? (
                    <span className="recipe-badge-tsom">🌿 {language === 'am' ? 'የጾም ምግብ (Tsom)' : 'Fasting-Friendly (Tsom)'}</span>
                  ) : (
                    <span className="recipe-badge-meat">🍗 {language === 'am' ? 'ባህላዊ የፍስክ ምግብ' : 'Traditional Feast'}</span>
                  )}
                </div>
              </div>

              <div className="recipe-modal-body">
                <div className="modal-title-row">
                  <div>
                    <h2 className="modal-title">
                      {language === 'am' ? selectedRecipe.nameAm : selectedRecipe.name}
                    </h2>
                    <p className="modal-amharic-title">{selectedRecipe.amharicName}</p>
                  </div>
                  <div className="modal-quick-meta">
                    <span>⏱ {language === 'am' ? selectedRecipe.prepTimeAm : selectedRecipe.prepTimeEn}</span>
                    <span>👥 {selectedRecipe.servings} {language === 'am' ? 'ሰው ያበላል' : 'Servings'}</span>
                    <span>📊 {language === 'am' ? selectedRecipe.difficultyAm : selectedRecipe.difficultyEn}</span>
                  </div>
                </div>

                <p className="modal-description">
                  {language === 'am' ? selectedRecipe.descriptionAm : selectedRecipe.descriptionEn}
                </p>

                {/* Macro Cards Row */}
                <div className="modal-macros-grid">
                  <div className="modal-macro-box">
                    <span className="box-val">{selectedRecipe.calories}</span>
                    <span className="box-lbl">{language === 'am' ? 'ካሎሪ' : 'Calories'}</span>
                  </div>
                  <div className="modal-macro-box forest">
                    <span className="box-val">{selectedRecipe.protein}g</span>
                    <span className="box-lbl">{language === 'am' ? 'ፕሮቲን' : 'Protein'}</span>
                  </div>
                  <div className="modal-macro-box terracotta">
                    <span className="box-val">{selectedRecipe.carbs}g</span>
                    <span className="box-lbl">{language === 'am' ? 'ካርቦሃይድሬት' : 'Carbs'}</span>
                  </div>
                  <div className="modal-macro-box amber">
                    <span className="box-val">{selectedRecipe.fats}g</span>
                    <span className="box-lbl">{language === 'am' ? 'ቅባት' : 'Fats'}</span>
                  </div>
                </div>

                {/* Ingredients & Instructions */}
                <div className="modal-two-col-grid">
                  <div className="modal-ingredients-section">
                    <h4 className="section-heading">
                      🛒 {language === 'am' ? 'የሚያስፈልጉ ንጥረ ነገሮች' : 'Ingredients'}
                    </h4>
                    <ul className="modal-list">
                      {(language === 'am' ? selectedRecipe.ingredientsAm : selectedRecipe.ingredientsEn).map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-instructions-section">
                    <h4 className="section-heading">
                      👩‍🍳 {language === 'am' ? 'ደረጃ በደረጃ የአዘገጃጀት ቅደም ተከተል' : 'Preparation Steps'}
                    </h4>
                    <ol className="modal-steps-list">
                      {(language === 'am' ? selectedRecipe.instructionsAm : selectedRecipe.instructionsEn).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Clinical Nutrition Note */}
                <div className="modal-nutrition-note">
                  <strong>💡 {language === 'am' ? 'የክሊኒካል አመጋገብ ማስታወሻ፡' : 'Clinical Nutrition Note:'}</strong>{' '}
                  {language === 'am' ? selectedRecipe.nutritionHighlightsAm : selectedRecipe.nutritionHighlightsEn}
                </div>

                {/* Action CTA Row */}
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="landing-cta-primary"
                    style={{ flex: 1 }}
                    onClick={() => handleLogRecipe(selectedRecipe)}
                  >
                    {isAuthenticated
                      ? (language === 'am' ? '✨ ይህን ምግብ ወደ ዳሽቦርድ መዝግብ' : '✨ Log This Meal to Dashboard')
                      : (language === 'am' ? 'ይህን ምግብ ለመመዝገብ ይመዝገቡ' : 'Sign Up to Log This Meal')}
                  </button>
                  <button
                    type="button"
                    className="landing-cta-secondary"
                    onClick={() => setSelectedRecipe(null)}
                  >
                    {language === 'am' ? 'ዝጋ' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
