import { createContext, useContext, useState, useEffect } from 'react';

const QuoteContext = createContext(null);

export function QuoteProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('marketero_quote');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('marketero_quote', JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1, comment: '' }];
    });
    setIsDrawerOpen(true);
    setTimeout(() => setIsDrawerOpen(false), 2500);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeItem(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const updateComment = (id, comment) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, comment } : i));
  };

  const clearQuote = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <QuoteContext.Provider value={{
      items,
      totalItems,
      isDrawerOpen,
      setIsDrawerOpen,
      addItem,
      removeItem,
      updateQuantity,
      updateComment,
      clearQuote,
    }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider');
  return ctx;
}
