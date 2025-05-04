import React, { createContext, useContext, useState } from 'react';

// 创建 Context
const TarotContext = createContext();

export function TarotProvider({ children }) {
  // 记录抽到的牌（用 idx 记录，便于多语言切换）
  const [drawResult, setDrawResult] = useState(null);
  // AI解读结果，按语言分别保存
  const [aiResult, setAiResult] = useState({ zh: '', ja: '', en: '' });
  // 当前语言
  const [lang, setLang] = useState('zh');

  return (
    <TarotContext.Provider value={{
      drawResult, setDrawResult,
      aiResult, setAiResult,
      lang, setLang
    }}>
      {children}
    </TarotContext.Provider>
  );
}

// 自定义 Hook，便于使用
export function useTarot() {
  return useContext(TarotContext);
}
