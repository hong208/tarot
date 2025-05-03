require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

async function getGeminiContent(prompt, lang) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  // 可根据 lang 生成不同语言的 prompt
  let fullPrompt = prompt;
  if (lang === 'zh') {
    fullPrompt = `请用中文详细解读：${prompt}`;
  } else if (lang === 'ja') {
    fullPrompt = `日本語で詳しく説明してください：${prompt}`;
  } // 英文默认

  const response = await axios.post(
    url,
    {
      contents: [{
        parts: [{ text: fullPrompt }]
      }]
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  // 解析 Gemini 返回的内容
  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'AI解读失败';
}

app.post('/api/fortune', async (req, res) => {
  const { card, lang } = req.body;
  let prompt = '';
  if (lang === 'zh') {
    prompt = `塔罗牌「${card}」的含义和今日运势建议。`;
  } else if (lang === 'ja') {
    prompt = `タロットカード「${card}」の意味と今日の運勢アドバイス。`;
  } else {
    prompt = `The meaning of the tarot card "${card}" and today's fortune advice.`;
  }

  try {
    const fortune = await getGeminiContent(prompt, lang);
    res.json({ fortune });
  } catch (err) {
    res.status(500).json({ fortune: 'AI解读失败，请稍后再试。' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
