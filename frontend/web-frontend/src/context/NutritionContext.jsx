import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './AuthContext';

const NutritionContext = createContext(null);

export const NutritionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fastingCycle, setFastingCycle] = useState({});
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
  const [recommendedMeal, setRecommendedMeal] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);

    try {
      // 1. Fetch Dashboard Metrics
      try {
        const dashRes = await apiClient.get('/dashboard');
        const data = dashRes.data || {};
        
        setDailyStats({
          calories: { consumed: data.kcal_eaten || 0, target: data.kcal_goal || 2000 },
          protein: { consumed: data.protein_g || 0, target: data.protein_goal_g || 150, unit: 'g' },
          carbs: { consumed: data.carbs_g || 0, target: data.carbs_goal_g || 200, unit: 'g' },
          fats: { consumed: data.fats_g || 0, target: data.fats_goal_g || 65, unit: 'g' },
          water: { consumed: data.water_l || 0, target: data.water_goal_l || 2.5, unit: 'L' },
          iron: { consumed: data.iron_mg || 0, target: data.iron_goal_mg || 18, unit: 'mg' },
          fiber: { consumed: data.fiber_g || 0, target: data.fiber_goal_g || 30, unit: 'g' },
        });

        if (data.current_cycle) {
          setFastingCycle({
            title: data.current_cycle.name || 'Fasting Calendar',
            dayCount: `Day ${data.current_cycle.day || 1}`,
            amharicTitle: '',
            description: data.current_cycle.allowed_today || 'Strict Vegan rules',
            allowedBadge: data.current_cycle.allowed_today || 'Fasting',
          });
        }

        if (data.suggested_meal) {
          setRecommendedMeal({
            name: data.suggested_meal.name || 'Traditional Ethiopian Stew',
            description: data.suggested_meal.reason || 'Nutritionally balanced',
            calories: data.suggested_meal.calories || 450,
            tags: [`${data.suggested_meal.calories || 450} kcal`]
          });
        }
      } catch (dashErr) {
        console.warn("Failed to fetch dashboard data", dashErr);
      }

      // 2. Fetch Food Logs for Today
      try {
        const todayIso = new Date().toISOString().split('T')[0];
        const logsRes = await apiClient.get(`/food-logs?date=${todayIso}`);
        const groupedLogs = logsRes.data || {};
        const flatLogs = [];
        ['breakfast', 'lunch', 'dinner', 'snack'].forEach(meal => {
          if (Array.isArray(groupedLogs[meal])) {
            groupedLogs[meal].forEach(l => {
              flatLogs.push({
                id: l._id || l.id,
                category: l.mealType,
                name: l.customName || 'Logged Food',
                calories: l.calories || 0,
                protein: l.proteinG || 0,
                carbs: l.carbsG || 0,
                fats: l.fatsG || 0,
                iron: l.ironMg || 0,
                time: l.loggedAt ? new Date(l.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
                image: l.photoUrl
              });
            });
          }
        });
        setFoodLogs(flatLogs);
      } catch (logErr) {
        console.warn("Failed to fetch food logs", logErr);
      }

      // 3. Fetch Active Chat Messages
      try {
        const chatRes = await apiClient.get('/chat');
        if (chatRes.data && Array.isArray(chatRes.data.messages)) {
          setChatMessages(chatRes.data.messages.map(m => ({
            id: m._id || Math.random().toString(),
            sender: m.sender === 'user' ? 'user' : 'nutritionist',
            text: m.content,
            time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'
          })));
        }
      } catch (chatErr) {
        console.warn("Failed to fetch chat conversation", chatErr);
      }

    } catch (err) {
      console.error("General error fetching nutrition data", err);
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
        meal_type: newMeal.category || 'snack',
        custom_name: newMeal.name || 'Food Item',
        calories: Number(newMeal.calories) || 0,
        protein_g: Number(newMeal.protein) || 0,
        carbs_g: Number(newMeal.carbs) || 0,
        fats_g: Number(newMeal.fats) || 0,
        iron_mg: Number(newMeal.iron) || 0,
        quantity_g: Number(newMeal.quantityG) || 100
      });
      fetchData();
    } catch (err) {
      console.error("Failed to add food log", err);
    }
  };

  const removeFoodLog = async (id) => {
    try {
      await apiClient.delete(`/food-logs/${id}`);
      fetchData();
    } catch (err) {
      console.error("Failed to delete log", err);
    }
  };

  const toggleShoppingItem = () => {};
  const addShoppingItem = () => {};

  const sendChatMessage = async (text) => {
    if (!text || !text.trim()) return;
    try {
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        id: tempId,
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, tempMsg]);
      
      const res = await apiClient.post('/chat', { message: text });
      if (res.data && res.data.message) {
        const aiMsg = res.data.message;
        setChatMessages(prev => [
          ...prev,
          {
            id: aiMsg._id || `ai-${Date.now()}`,
            sender: 'nutritionist',
            text: aiMsg.content,
            time: new Date(aiMsg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to send chat", err);
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

