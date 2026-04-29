import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const weatherCodes = {
  0: ['☀️', '晴朗'],
  1: ['🌤️', '大部晴朗'],
  2: ['⛅', '局部多云'],
  3: ['☁️', '阴天'],
  45: ['🌫️', '有雾'],
  48: ['🌫️', '霜雾'],
  51: ['🌦️', '小毛毛雨'],
  53: ['🌦️', '毛毛雨'],
  55: ['🌧️', '较强毛毛雨'],
  61: ['🌧️', '小雨'],
  63: ['🌧️', '中雨'],
  65: ['🌧️', '大雨'],
  71: ['🌨️', '小雪'],
  73: ['🌨️', '中雪'],
  75: ['❄️', '大雪'],
  80: ['🌦️', '阵雨'],
  81: ['🌧️', '较强阵雨'],
  82: ['⛈️', '强阵雨'],
  95: ['⛈️', '雷暴'],
  96: ['⛈️', '雷暴伴冰雹'],
  99: ['⛈️', '强雷暴伴冰雹'],
};

const fallbackTrends = [
  { title: 'AI 工具正在改变个人网站的表达方式', hot: '新', url: 'https://s.weibo.com/top/summary' },
  { title: '春日城市漫游攻略', hot: '热', url: 'https://s.weibo.com/top/summary' },
  { title: '年轻人如何打造自己的数字名片', hot: '热', url: 'https://s.weibo.com/top/summary' },
  { title: '今日天气与出行提醒', hot: '荐', url: 'https://s.weibo.com/top/summary' },
  { title: '设计师作品集页面灵感', hot: '荐', url: 'https://s.weibo.com/top/summary' },
  { title: '前端开发者常用效率工具', hot: '新', url: 'https://s.weibo.com/top/summary' },
  { title: '个人品牌建设从一个主页开始', hot: '热', url: 'https://s.weibo.com/top/summary' },
  { title: '周末适合学习的新技术', hot: '新', url: 'https://s.weibo.com/top/summary' },
];

// ── API Routes ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'personal-site-smart-demo' });
});

app.get('/api/weather', async (req, res) => {
  const city = String(req.query.city || '').trim();
  if (!city) return res.status(400).json({ message: '请提供城市名称' });

  try {
    const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
    geoUrl.searchParams.set('name', city);
    geoUrl.searchParams.set('count', '1');
    geoUrl.searchParams.set('language', 'zh');
    geoUrl.searchParams.set('format', 'json');

    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error('城市查询服务暂不可用');
    const geoData = await geoRes.json();
    const location = geoData.results?.[0];

    if (!location) return res.status(404).json({ message: `没有找到城市：${city}` });

    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
    weatherUrl.searchParams.set('latitude', location.latitude);
    weatherUrl.searchParams.set('longitude', location.longitude);
    weatherUrl.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m');
    weatherUrl.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min');
    weatherUrl.searchParams.set('timezone', 'auto');
    weatherUrl.searchParams.set('forecast_days', '1');

    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error('天气服务暂不可用');
    const weatherData = await weatherRes.json();
    const [icon, description] = weatherCodes[weatherData.current.weather_code] || ['🌡️', '天气状态未知'];

    return res.json({
      city: [location.name, location.admin1, location.country].filter(Boolean).join(' · '),
      temperature: weatherData.current.temperature_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      code: weatherData.current.weather_code,
      icon,
      description,
      max: weatherData.daily.temperature_2m_max[0],
      min: weatherData.daily.temperature_2m_min[0],
      time: weatherData.current.time.replace('T', ' '),
    });
  } catch (error) {
    return res.status(502).json({ message: error.message || '天气查询失败' });
  }
});

app.get('/api/weibo-hot', async (_req, res) => {
  try {
    const weiboRes = await fetch('https://weibo.com/ajax/side/hotSearch', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        Referer: 'https://weibo.com/',
      },
    });

    if (!weiboRes.ok) throw new Error('微博热搜服务暂不可用');
    const weiboData = await weiboRes.json();
    const realtimeItems = weiboData.data?.realtime || [];

    const items = realtimeItems
      .filter((item) => item.word || item.note)
      .slice(0, 12)
      .map((item) => {
        const title = item.word || item.note;
        return {
          title,
          hot: item.num ? formatHotValue(item.num) : item.category || '',
          url: `https://s.weibo.com/weibo?q=${encodeURIComponent(title)}`,
        };
      });

    if (!items.length) throw new Error('暂无热搜数据');
    return res.json({ source: 'weibo', items });
  } catch {
    return res.json({ source: 'fallback', items: fallbackTrends });
  }
});

// ── Static files (production: serve Vite build output) ──────
app.use(express.static(distDir));

// ── SPA fallback ─────────────────────────────────────────────
app.use((_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

function formatHotValue(value) {
  if (!Number.isFinite(Number(value))) return String(value || '');
  const number = Number(value);
  if (number >= 10000) return `${Math.round(number / 10000)}万`;
  return String(number);
}
