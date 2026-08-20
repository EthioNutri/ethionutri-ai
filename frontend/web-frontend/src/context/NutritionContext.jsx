import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './AuthContext';

const NutritionContext = createContext(null);

const DEFAULT_SHOPPING_LIST = [
  {
    category: 'Grains & Flours',
    icon: '🌾',
    items: [
      { id: 1, name: 'Magna Teff Flour', amharic: 'የማኛ ጤፍ ዱቄት', amount: '5 kg', note: 'Rich in iron & fiber for Injera', priceETB: 450, checked: false },
      { id: 2, name: 'Barley Grain / Flour', amharic: 'የገብስ ዱቄት (ለገንፎ)', amount: '2 kg', note: 'For breakfast Genfo / Kinche', priceETB: 180, checked: true },
    ]
  },
  {
    category: 'Legumes & Pulses (Tsom Protein)',
    icon: '🫘',
    items: [
      { id: 3, name: 'Shiro Powder (Mitten)', amharic: 'ምጥን የሽሮ ዱቄት', amount: '1 kg', note: 'High protein chickpea & pea blend', priceETB: 260, checked: false },
      { id: 4, name: 'Red Split Lentils (Misir)', amharic: 'የቀይ ምስር ክክ', amount: '1.5 kg', note: 'Iron-dense staple for fasting', priceETB: 220, checked: false },
      { id: 5, name: 'Yellow Split Peas (Kik)', amharic: 'የአተር ክክ', amount: '1 kg', note: 'For Kik Alicha stew', priceETB: 140, checked: false },
    ]
  },
  {
    category: 'Spices & Aromatics',
    icon: '🌶️',
    items: [
      { id: 6, name: 'Pure Berbere Blend', amharic: 'የወጥ ንጹህ በርበሬ', amount: '500 g', note: 'Sun-dried traditional blend', priceETB: 190, checked: false },
      { id: 7, name: 'Fresh Garlic & Ginger', amharic: 'ነጭ ሽንኩርት እና ዝንጅብል', amount: '500 g', note: 'Aromatic base for all stews', priceETB: 110, checked: true },
    ]
  },
  {
    category: 'Produce & Greens',
    icon: '🥬',
    items: [
      { id: 8, name: 'Fresh Gomen (Collard Greens)', amharic: 'የሀበሻ ጎመን', amount: '2 bunches', note: 'Folate, calcium & vitamin K', priceETB: 70, checked: false },
      { id: 9, name: 'Fresh Lemons (Lomi)', amharic: 'ሎሚ', amount: '1 kg', note: 'Vitamin C booster for iron absorption', priceETB: 90, checked: false },
    ]
  }
];

export const NutritionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fastingCycle, setFastingCycle] = useState({
    title: 'Wednesday Fast',
    dayCount: 'Tsom Adherence Active',
    amharicTitle: 'የረቡዕ ጾም',
    description: '100% Plant-based heritage nutrition',
    allowedBadge: 'Fasting (Tsom)'
  });

  const initialDailyStats = {
    calories: { consumed: 0, target: 2000 },
    protein: { consumed: 0, target: 150, unit: 'g' },
    carbs: { consumed: 0, target: 200, unit: 'g' },
    fats: { consumed: 0, target: 65, unit: 'g' },
    water: { consumed: 0, target: 2.5, unit: 'L' },
    iron: { consumed: 0, target: 18, unit: 'mg' },
    fiber: { consumed: 0, target: 30, unit: 'g' },
  };

  const [dailyStats, setDailyStats] = useState(initialDailyStats);
  const [foodLogs, setFoodLogs] = useState([]);
  const [recommendedMeal, setRecommendedMeal] = useState({
    name: 'Shiro Mitten with Teff Injera',
    amharicName: 'ሽሮ ምጥን በጤፍ እንጀራ',
    description: 'Complete amino acid profile with chickpea protein and iron-rich whole grain teff.',
    calories: 460,
    tags: ['460 kcal', '18g Protein', 'High Iron', '100% Plant-Based']
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [shoppingList, setShoppingList] = useState(DEFAULT_SHOPPING_LIST);

  // Recalculate daily totals dynamically from an array of logged meals
  const computeStatsFromLogs = useCallback((logs, baseGoals = {}) => {
    const totalCal = logs.reduce((sum, item) => sum + Number(item.calories || 0), 0);
    const totalProt = logs.reduce((sum, item) => sum + Number(item.protein || 0), 0);
    const totalCarb = logs.reduce((sum, item) => sum + Number(item.carbs || 0), 0);
    const totalFat = logs.reduce((sum, item) => sum + Number(item.fats || 0), 0);
    const totalIron = logs.reduce((sum, item) => sum + Number(item.iron || 0), 0);
    const totalFiber = logs.reduce((sum, item) => sum + (Number(item.carbs || 0) * 0.12), 0); // Estimated fiber from teff/legumes

    return {
      calories: { consumed: Math.round(totalCal), target: baseGoals.kcal_goal || 2000 },
      protein: { consumed: Math.round(totalProt), target: baseGoals.protein_goal_g || 150, unit: 'g' },
      carbs: { consumed: Math.round(totalCarb), target: baseGoals.carbs_goal_g || 200, unit: 'g' },
      fats: { consumed: Math.round(totalFat), target: baseGoals.fats_goal_g || 65, unit: 'g' },
      water: { consumed: Number(baseGoals.water_l || 0), target: baseGoals.water_goal_l || 2.5, unit: 'L' },
      iron: { consumed: Math.round(totalIron * 10) / 10, target: baseGoals.iron_goal_mg || 18, unit: 'mg' },
      fiber: { consumed: Math.round(totalFiber * 10) / 10, target: baseGoals.fiber_goal_g || 30, unit: 'g' },
    };
  }, []);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);

    try {
      let dashData = {};
      // 1. Fetch Dashboard Metrics
      try {
        const dashRes = await apiClient.get('/dashboard');
        dashData = dashRes.data || {};

        if (dashData.current_cycle) {
          setFastingCycle({
            title: dashData.current_cycle.name || 'Fasting Calendar',
            dayCount: `Day ${dashData.current_cycle.day || 1}`,
            amharicTitle: '',
            description: dashData.current_cycle.allowed_today || 'Strict Vegan rules',
            allowedBadge: dashData.current_cycle.allowed_today || 'Fasting',
          });
        }

        if (dashData.suggested_meal) {
          setRecommendedMeal({
            name: dashData.suggested_meal.name || 'Traditional Ethiopian Stew',
            amharicName: dashData.suggested_meal.amharicName || '',
            description: dashData.suggested_meal.reason || 'Nutritionally balanced heritage recipe',
            calories: dashData.suggested_meal.calories || 450,
            tags: [`${dashData.suggested_meal.calories || 450} kcal`, 'Heritage Recipe', 'AI Balanced']
          });
        }
      } catch (dashErr) {
        console.warn('Dashboard fetch warning:', dashErr);
      }

      // 2. Fetch Food Logs for Today
      try {
        const todayIso = new Date().toISOString().split('T')[0];
        const logsRes = await apiClient.get(`/food-logs?date=${todayIso}`);
        const groupedLogs = logsRes.data || {};
        const flatLogs = [];
        ['breakfast', 'lunch', 'dinner', 'snack', 'snacks'].forEach((meal) => {
          if (Array.isArray(groupedLogs[meal])) {
            groupedLogs[meal].forEach((l) => {
              flatLogs.push({
                id: l._id || l.id,
                category: (l.mealType || meal).toLowerCase(),
                name: l.customName || 'Logged Food',
                amharicName: l.amharicName || '',
                portion: l.quantityG ? `${l.quantityG}g` : '1 serving',
                calories: Number(l.calories || 0),
                protein: Number(l.proteinG || l.protein || 0),
                carbs: Number(l.carbsG || l.carbs || 0),
                fats: Number(l.fatsG || l.fats || 0),
                iron: Number(l.ironMg || l.iron || 0),
                isTsom: l.isTsom !== undefined ? l.isTsom : true,
                time: l.loggedAt ? new Date(l.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
                image: l.photoUrl || (l.calories > 400 ? 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80' : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80')
              });
            });
          }
        });
        setFoodLogs(flatLogs);

        // Dynamically compute daily stats from actual flat logs
        const computed = computeStatsFromLogs(flatLogs, dashData);
        setDailyStats(computed);
      } catch (logErr) {
        console.warn('Food logs fetch warning:', logErr);
      }

      // 3. Fetch Chat Conversation
      try {
        const chatRes = await apiClient.get('/chat');
        if (chatRes.data && Array.isArray(chatRes.data.messages)) {
          setChatMessages(chatRes.data.messages.map((m) => ({
            id: m._id || Math.random().toString(),
            sender: m.sender === 'user' ? 'user' : 'nutritionist',
            text: m.content,
            time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'
          })));
        }
      } catch (chatErr) {
        console.warn('Chat fetch warning:', chatErr);
      }

    } catch (err) {
      console.error('General error fetching nutrition data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const addFoodLog = async (newMeal) => {
    try {
      await apiClient.post('/food-logs/manual', {
        meal_type: (newMeal.category || 'lunch').toLowerCase(),
        custom_name: newMeal.name || 'Food Item',
        calories: Number(newMeal.calories) || 0,
        protein_g: Number(newMeal.protein) || 0,
        carbs_g: Number(newMeal.carbs) || 0,
        fats_g: Number(newMeal.fats) || 0,
        iron_mg: Number(newMeal.iron) || 0,
        quantity_g: Number(newMeal.quantityG) || 150
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to add food log', err);
      // Fallback local update
      const localEntry = {
        id: `local-${Date.now()}`,
        category: (newMeal.category || 'lunch').toLowerCase(),
        name: newMeal.name || 'Food Item',
        amharicName: newMeal.amharicName || '',
        portion: newMeal.portion || '1 serving',
        calories: Number(newMeal.calories) || 0,
        protein: Number(newMeal.protein) || 0,
        carbs: Number(newMeal.carbs) || 0,
        fats: Number(newMeal.fats) || 0,
        iron: Number(newMeal.iron) || 0,
        isTsom: newMeal.isTsom !== undefined ? newMeal.isTsom : true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: newMeal.image || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80'
      };
      setFoodLogs((prev) => {
        const updated = [...prev, localEntry];
        setDailyStats(computeStatsFromLogs(updated));
        return updated;
      });
    }
  };

  const removeFoodLog = async (id) => {
    try {
      if (!String(id).startsWith('local-')) {
        await apiClient.delete(`/food-logs/${id}`);
      }
      await fetchData();
    } catch (err) {
      console.error('Failed to delete log', err);
      setFoodLogs((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        setDailyStats(computeStatsFromLogs(updated));
        return updated;
      });
    }
  };

  const toggleShoppingItem = (itemId) => {
    setShoppingList((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }))
    );
  };

  const addShoppingItem = (categoryName, newItem) => {
    setShoppingList((prev) => {
      let foundCat = false;
      const updated = prev.map((cat) => {
        if (cat.category.toLowerCase() === categoryName.toLowerCase()) {
          foundCat = true;
          return {
            ...cat,
            items: [...cat.items, { ...newItem, id: Date.now(), checked: false }]
          };
        }
        return cat;
      });
      if (!foundCat) {
        return [
          ...prev,
          {
            category: categoryName,
            icon: '🛒',
            items: [{ ...newItem, id: Date.now(), checked: false }]
          }
        ];
      }
      return updated;
    });
  };

  const sendChatMessage = async (text, attachment = null, conversationId = null) => {
    if ((!text || !text.trim()) && !attachment) return;
    try {
      const tempId = `temp-${Date.now()}`;
      const displayText = text || (attachment ? `📎 [Attached: ${attachment.name || 'File'}]` : '');
      const tempMsg = {
        id: tempId,
        sender: 'user',
        text: displayText,
        attachment: attachment ? { name: attachment.name, data: attachment.data, mimeType: attachment.mimeType, isImage: attachment.isImage } : null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, tempMsg]);

      // Call /ai/chat (or /chat)
      let res;
      try {
        res = await apiClient.post('/ai/chat', { message: text || '', attachment, conversationId });
      } catch (e) {
        res = await apiClient.post('/chat', { message: text || '', attachment, conversationId });
      }

      if (res.data && res.data.message) {
        const aiMsg = res.data.message;
        setChatMessages((prev) => [
          ...prev,
          {
            id: aiMsg._id || `ai-${Date.now()}`,
            sender: 'nutritionist',
            text: aiMsg.content,
            time: new Date(aiMsg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return res.data;
      } else {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to send chat', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'nutritionist',
          text: 'Thank you for your question. As your Certified Clinical Ethiopian Nutritionist, I recommend prioritizing teff injera for bioavailable iron and pairing shiro or misir wat with vitamin C (fresh lemon or tomato salata) to maximize nutrient absorption during fasting cycles.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <NutritionContext.Provider
      value={{
        loading,
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
        setChatMessages,
        sendChatMessage,
        refreshData: fetchData
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


