export const calculateNutritionGoals = (profile) => {
  const {
    age = 28,
    biologicalSex = 'female',
    heightCm = 170,
    weightKg = 65,
    targetWeightKg = 65,
    activityLevel = 'moderately_active',
    healthObjective = 'weight_management',
    medicalFlags = []
  } = profile;

  let bmr = 0;
  if (biologicalSex === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  bmr = Math.round(bmr);

  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725
  };
  const multiplier = activityMultipliers[activityLevel] || 1.375;
  let tdee = Math.round(bmr * multiplier);

  let dailyCalories = tdee;
  if (targetWeightKg < weightKg) {
    dailyCalories -= 500;
  } else if (targetWeightKg > weightKg) {
    dailyCalories += 500;
  }

  if (biologicalSex === 'female' && dailyCalories < 1200) dailyCalories = 1200;
  if (biologicalSex === 'male' && dailyCalories < 1500) dailyCalories = 1500;

  let proteinPercent = 0.20;
  let fatPercent = 0.25;
  let carbPercent = 0.55;

  if (healthObjective === 'weight_management') {
    proteinPercent = 0.25;
    fatPercent = 0.30;
    carbPercent = 0.45;
  } else if (healthObjective === 'high_protein_strength') {
    proteinPercent = 0.35;
    fatPercent = 0.25;
    carbPercent = 0.40;
  } else if (healthObjective === 'blood_sugar_cardio') {
    proteinPercent = 0.25;
    fatPercent = 0.40;
    carbPercent = 0.35;
  }

  if (medicalFlags.includes('type2_diabetes')) {
    carbPercent = Math.min(carbPercent, 0.30);
    proteinPercent = Math.max(proteinPercent, (1 - carbPercent - fatPercent));
  }
  
  if (medicalFlags.includes('pregnancy_lactation')) {
    dailyCalories += 300;
  }

  const proteinG = Math.round((dailyCalories * proteinPercent) / 4);
  const carbsG = Math.round((dailyCalories * carbPercent) / 4);
  const fatsG = Math.round((dailyCalories * fatPercent) / 9);

  let waterL = (weightKg * 30) / 1000;
  if (activityLevel === 'moderately_active') waterL += 0.5;
  if (activityLevel === 'very_active') waterL += 1.0;
  waterL = Math.round(waterL * 10) / 10;
  
  let ironRdaMg = biologicalSex === 'female' && age < 50 ? 18 : 8;
  if (medicalFlags.includes('pregnancy_lactation')) ironRdaMg = 27;
  else if (medicalFlags.includes('anemia')) ironRdaMg = Math.round(ironRdaMg * 1.5);
  
  let sodiumRdaMg = 2300;
  if (medicalFlags.includes('hypertension')) sodiumRdaMg = 1500;

  return {
    calories: dailyCalories,
    protein: proteinG,
    carbs: carbsG,
    fats: fatsG,
    water: waterL,
    bmr: bmr,
    tdee: tdee,
    ironMg: ironRdaMg,
    sodiumMg: sodiumRdaMg
  };
};
