import React, { useState, useEffect } from 'react';
import { useTarot } from './TarotContext';

const tarotCards = {
  zh: [
    '愚者', '魔术师', '女祭司', '女皇', '皇帝', '教皇', '恋人', '战车', '力量', '隐者', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', '高塔', '星星', '月亮', '太阳', '审判', '世界'
  ],
  ja: [
    '愚者', '魔術師', '女教皇', '女帝', '皇帝', '法王', '恋人', '戦車', '力', '隠者', '運命の輪', '正義', '吊るされた男', '死神', '節制', '悪魔', '塔', '星', '月', '太陽', '審判', '世界'
  ],
  en: [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
  ]
};

const tarotMeanings = {
  zh: [
    '新的开始，冒险与自由。',
    '创造力与行动力。',
    '直觉与神秘。',
    '丰收与母性。',
    '权威与领导。',
    '信仰与智慧。',
    '爱情与选择。',
    '胜利与意志。',
    '勇气与力量。',
    '内省与寻找答案。',
    '命运的转折点。',
    '公平与正义。',
    '牺牲与等待。',
    '结束与新生。',
    '平衡与节制。',
    '诱惑与束缚。',
    '突变与觉醒。',
    '希望与灵感。',
    '迷茫与潜意识。',
    '光明与成功。',
    '觉醒与审视。',
    '圆满与完成。'
  ],
  ja: [
    '新しい始まり、冒険と自由。',
    '創造力と行動力。',
    '直感と神秘。',
    '豊かさと母性。',
    '権威とリーダーシップ。',
    '信仰と知恵。',
    '愛と選択。',
    '勝利と意志。',
    '勇気と力。',
    '内省と答え探し。',
    '運命の転換点。',
    '公平と正義。',
    '犠牲と待機。',
    '終わりと再生。',
    'バランスと節制。',
    '誘惑と束縛。',
    '変化と覚醒。',
    '希望とインスピレーション。',
    '迷いと潜在意識。',
    '光と成功。',
    '目覚めと審判。',
    '完成と達成。'
  ],
  en: [
    'A new beginning, adventure and freedom.',
    'Creativity and action.',
    'Intuition and mystery.',
    'Abundance and motherhood.',
    'Authority and leadership.',
    'Faith and wisdom.',
    'Love and choices.',
    'Victory and willpower.',
    'Courage and strength.',
    'Introspection and seeking answers.',
    'Turning point of fate.',
    'Fairness and justice.',
    'Sacrifice and waiting.',
    'Endings and rebirth.',
    'Balance and moderation.',
    'Temptation and bondage.',
    'Sudden change and awakening.',
    'Hope and inspiration.',
    'Confusion and subconscious.',
    'Light and success.',
    'Awakening and judgment.',
    'Completion and fulfillment.'
  ]
};

const texts = {
  zh: {
    title: '每日塔罗展示',
    button: '抽一张牌',
    result: '今日之牌：',
    meaning: '本地解读：',
    ai: '解读',
    aiLoading: '解读生成中...',
    lang: '语言'
  },
  ja: {
    title: '本日のタロットカード展示',
    button: 'カードを引く',
    result: '今日のカード：',
    meaning: 'ローカル解釈：',
    ai: '解釈',
    aiLoading: '解釈生成中...',
    lang: '言語'
  },
  en: {
    title: 'Daily Tarot Showcase',
    button: 'Draw a Card',
    result: "Today's Card:",
    meaning: 'Local Meaning:',
    ai: 'Interpretation',
    aiLoading: 'Generating interpretation...',
    lang: 'Language'
  }
};

const languages = [
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' }
];

function detectLang() {
  const lang = navigator.language || navigator.userLanguage;
  if (lang.startsWith('zh')) return 'zh'; // 中文（大陆、台湾、香港、澳门）
  if (lang.startsWith('ja')) return 'ja'; // 日文
  return 'en'; // 其他默认英文
}

function App() {
  const {
    drawResult, setDrawResult,
    aiResult, setAiResult,
    lang, setLang
  } = useTarot();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLang(detectLang());
  }, [setLang]);

  const handleDraw = () => {
    const idx = Math.floor(Math.random() * tarotCards[lang].length);
    setDrawResult({ idx });
    setAiResult({ zh: '', ja: '', en: '' });
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
  };

  // AI解读按钮
  const handleAIFortune = async () => {
    if (!drawResult) return;
    setLoading(true);
    const res = await fetch('https://tarot-production-2a63.up.railway.app/api/fortune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card: tarotCards[lang][drawResult.idx], lang })
    });
    const data = await res.json();
    setAiResult(prev => ({ ...prev, [lang]: data.fortune }));
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      {/* 语言选择 */}
      <div style={{ position: 'absolute', top: 30, right: 40 }}>
        <span style={{ marginRight: 8, color: '#4B2067', fontWeight: 600 }}>{texts[lang].lang}:</span>
        {languages.map(l => (
          <button
            key={l.code}
            onClick={() => handleLangChange(l.code)}
            style={{
              margin: '0 4px',
              padding: '4px 12px',
              borderRadius: '6px',
              border: lang === l.code ? '2px solid #4B2067' : '1px solid #ccc',
              background: lang === l.code ? '#4B2067' : '#fff',
              color: lang === l.code ? '#fff' : '#4B2067',
              cursor: 'pointer',
              fontWeight: lang === l.code ? 700 : 400
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <h1 style={{ color: '#4B2067', marginBottom: 40 }}>{texts[lang].title}</h1>
      <button
        onClick={handleDraw}
        style={{
          padding: '12px 32px',
          fontSize: '18px',
          borderRadius: '8px',
          border: 'none',
          background: '#4B2067',
          color: '#fff',
          cursor: 'pointer',
          marginBottom: 30
        }}
      >
        {texts[lang].button}
      </button>
      {drawResult && (
        <div
          style={{
            marginTop: 20,
            padding: '24px 5vw',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '12px',
            fontSize: '24px',
            color: '#4B2067',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            width: '100%',
            maxWidth: 420,
            minWidth: 0,
            boxSizing: 'border-box'
          }}
        >
          <div>{texts[lang].result}{tarotCards[lang][drawResult.idx]}</div>
          <div style={{ marginTop: 16, fontSize: '18px', color: '#333' }}>
            <b>{texts[lang].meaning}</b> {tarotMeanings[lang][drawResult.idx]}
          </div>
          <button
            onClick={handleAIFortune}
            disabled={loading}
            style={{
              marginTop: 10,
              padding: '8px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              background: '#4B2067',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 2px 8px rgba(75,32,103,0.08)'
            }}
          >
            {loading ? texts[lang].aiLoading : texts[lang].ai}
          </button>
          {aiResult[lang] && (
            <div
              style={{
                marginTop: 28,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(120deg, #f8fafc 60%, #e0c3fc 100%)',
                  borderRadius: 16,
                  boxShadow: '0 4px 24px rgba(75,32,103,0.10)',
                  padding: '28px 32px',
                  maxWidth: 480,
                  minWidth: 320,
                  width: '100%',
                  border: '1.5px solid #e0c3fc',
                  position: 'relative',
                  fontFamily: 'serif'
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#4B2067',
                    marginBottom: 12,
                    letterSpacing: 1
                  }}
                >
                  {texts[lang].ai}
                </div>
                <div
                  style={{
                    color: '#3a2257',
                    fontSize: 17,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word'
                  }}
                >
                  {aiResult[lang]}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

