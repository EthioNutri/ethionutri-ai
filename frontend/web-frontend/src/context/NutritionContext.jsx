import React, { createContext, useContext, useState, useEffect } from 'react';

const NutritionContext = createContext(null);

export const NutritionProvider = ({ children }) => {
  // Current fasting status & cycle info
  const [fastingCycle, setFastingCycle] = useState({
    title: 'Wednesday Fast',
    dayCount: 'Day 3',
    amharicTitle: 'የረቡዕ ፆም',
    description: 'Adhering to strict plant-based guidelines. Your body is adapting well, maintaining good hydration levels.',
    allowedBadge: '100% Plant-Based (Tsom)',
    isFastingToday: true,
    fastingEndsTime: '3:00 PM (9 ሰዓት)',
    complianceRate: 92,
  });

  // Daily target and consumption values
  const [dailyStats, setDailyStats] = useState({
    calories: { consumed: 1240, target: 2100 },
    protein: { consumed: 45, target: 60, unit: 'g' },
    carbs: { consumed: 180, target: 220, unit: 'g' },
    fats: { consumed: 32, target: 50, unit: 'g' },
    water: { consumed: 1.2, target: 2.5, unit: 'L' },
    iron: { consumed: 9.4, target: 18, unit: 'mg', status: 'low' },
    fiber: { consumed: 28, target: 35, unit: 'g' },
  });

  // Logged foods for today grouped by meal time
  const [foodLogs, setFoodLogs] = useState([
    {
      id: 'log-1',
      category: 'breakfast',
      name: 'Kinche with Olive Oil & Herbs',
      amharicName: 'ቂንጬ በዘይት',
      portion: '1 bowl (180g)',
      calories: 320,
      protein: 8,
      carbs: 58,
      fats: 7,
      iron: 3.2,
      isTsom: true,
      time: '8:15 AM',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'log-2',
      category: 'lunch',
      name: 'Spicy Misir Wat with Teff Injera',
      amharicName: 'ምስር ወጥ በእንጀራ',
      portion: '1 plate (280g)',
      calories: 490,
      protein: 21,
      carbs: 76,
      fats: 11,
      iron: 4.8,
      isTsom: true,
      time: '1:30 PM',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'log-3',
      category: 'lunch',
      name: 'Gomen (Ethiopian Collard Greens)',
      amharicName: 'የጎመን ወጥ',
      portion: '1 side (120g)',
      calories: 90,
      protein: 3,
      carbs: 12,
      fats: 3,
      iron: 1.4,
      isTsom: true,
      time: '1:30 PM',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'log-4',
      category: 'dinner',
      name: 'Shiro Wat with Side Salad',
      amharicName: 'ሽሮ ወጥ ከሰላጣ ጋር',
      portion: '1 serving (220g)',
      calories: 340,
      protein: 13,
      carbs: 34,
      fats: 11,
      iron: 2.1,
      isTsom: true,
      time: 'Plan for 7:30 PM',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    },
  ]);

  // AI Recommended meals
  const [recommendedMeal, setRecommendedMeal] = useState({
    name: 'Doro Wat & Quinoa',
    amharicName: 'ዶሮ ወጥ',
    description: 'A modern twist on a heritage classic. High protein to meet yo...',
    calories: 450,
    tags: ['450 kcal', 'High Protein', 'Iron Rich'],
    image: '/images/doro-wat.jpg',
  });

  // Shopping list items with ETB pricing
  const [shoppingList, setShoppingList] = useState([
    {
      category: 'Grains & Legumes',
      icon: '🌾',
      items: [
        { id: 'shop-1', name: 'Teff Flour', amharic: 'ጤፍ ዱቄት', amount: '5 kg', note: 'Requires 5kg for Injera prep', priceETB: 450, checked: false },
        { id: 'shop-2', name: 'Misir (Lentils)', amharic: 'ምስር', amount: '1 kg', note: 'Split red lentils', priceETB: 180, checked: false },
        { id: 'shop-3', name: 'Shiro Flour', amharic: 'የሽሮ ዱቄት', amount: '1.5 kg', note: 'Spiced chickpea powder', priceETB: 210, checked: true },
      ],
    },
    {
      category: 'Vegetables & Fruits',
      icon: '🥦',
      items: [
        { id: 'shop-4', name: 'Onions', amharic: 'ቀይ ሽንኩርት', amount: '2 kg', note: 'Essential base for wats', priceETB: 120, checked: false },
        { id: 'shop-5', name: 'Garlic', amharic: 'ነጭ ሽንኩርት', amount: '0.5 kg', note: 'Fresh cloves', priceETB: 60, checked: false },
        { id: 'shop-6', name: 'Gomen (Collard Greens)', amharic: 'ጎመን', amount: '1 kg', note: 'High iron green', priceETB: 70, checked: false },
      ],
    },
  ]);

  // AI Chat Messages
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'nutritionist',
      text: "Hello! I've analyzed your recent logs and noticed your iron intake is lower than usual. Would you like some traditional recipe suggestions high in iron?",
      time: 'Yesterday, 4:30 PM',
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'Thank you, doctor. I will add Gomen and Misir to my dinner tonight.',
      time: 'Today, 9:15 AM',
    },
    {
      id: 'msg-3',
      sender: 'nutritionist',
      text: "Excellent choice! To maximize iron absorption from Gomen and Teff, squeeze a dash of fresh lemon or pair with tomato salata for Vitamin C.",
      time: 'Today, 9:17 AM',
    }
  ]);

  // Add meal log function
  const addFoodLog = (newMeal) => {
    const logItem = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...newMeal,
    };
    setFoodLogs((prev) => [logItem, ...prev]);

    // Recalculate daily stats
    setDailyStats((prev) => ({
      ...prev,
      calories: { ...prev.calories, consumed: prev.calories.consumed + (Number(newMeal.calories) || 0) },
      protein: { ...prev.protein, consumed: prev.protein.consumed + (Number(newMeal.protein) || 0) },
      carbs: { ...prev.carbs, consumed: prev.carbs.consumed + (Number(newMeal.carbs) || 0) },
      fats: { ...prev.fats, consumed: prev.fats.consumed + (Number(newMeal.fats) || 0) },
    }));
  };

  const removeFoodLog = (id) => {
    const item = foodLogs.find((l) => l.id === id);
    if (item) {
      setDailyStats((prev) => ({
        ...prev,
        calories: { ...prev.calories, consumed: Math.max(0, prev.calories.consumed - item.calories) },
        protein: { ...prev.protein, consumed: Math.max(0, prev.protein.consumed - item.protein) },
        carbs: { ...prev.carbs, consumed: Math.max(0, prev.carbs.consumed - item.carbs) },
        fats: { ...prev.fats, consumed: Math.max(0, prev.fats.consumed - item.fats) },
      }));
      setFoodLogs((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const toggleShoppingItem = (itemId) => {
    setShoppingList((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      }))
    );
  };

  const addShoppingItem = (categoryName, newItem) => {
    setShoppingList((prev) =>
      prev.map((cat) => {
        if (cat.category.toLowerCase().includes(categoryName.toLowerCase())) {
          return {
            ...cat,
            items: [...cat.items, { id: `shop-${Date.now()}`, checked: false, ...newItem }],
          };
        }
        return cat;
      })
    );
  };

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now',
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // AI intelligent auto-reply based on Ethiopian nutrition context
    setTimeout(() => {
      let reply = "I'm reviewing your diet log. During fasting days, remember that Teff Injera provides prebiotic fiber and slow-release complex carbs, making it great for steady energy.";
      const lower = text.toLowerCase();
      if (lower.includes('iron')) {
        reply = "For iron on Tsom days, focus on 100% Brown Teff injera, red lentils (Misir Wat), roasted chickpeas (Kolo), and steamed Gomen with lemon!";
      } else if (lower.includes('protein')) {
        reply = "To reach 60g protein on plant-based days, combine Shiro (chickpeas) with Kinche (bulgur/wheat) and Misir. This provides all 9 essential amino acids!";
      } else if (lower.includes('eat') || lower.includes('dinner') || lower.includes('lunch')) {
        reply = "I recommend our AI-balanced 'Spicy Misir & Gomen with Brown Teff Injera' tonight: 490 kcal, 21g protein, and rich in natural iron.";
      } else if (lower.includes('water') || lower.includes('hydrat')) {
        reply = "Fasting until 3 PM can dehydrate you quickly. Aim for at least 2.5L throughout your eating window, infused with fresh mint or lemon.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'nutritionist',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 900);
  };

  return (
    <NutritionContext.Provider
      value={{
        fastingCycle,
        setFastingCycle,
        dailyStats,
        setDailyStats,
        foodLogs,
        addFoodLog,
        removeFoodLog,
        recommendedMeal,
        setRecommendedMeal,
        shoppingList,
        toggleShoppingItem,
        addShoppingItem,
        chatMessages,
        sendChatMessage,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
