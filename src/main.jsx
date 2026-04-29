import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const navItems = [
  ['about', '关于我'],
  ['smart', '智能工具'],
  ['skills', '能力'],
  ['projects', '项目'],
  ['contact', '联系'],
];

const skills = [
  ['产品设计', '用户研究、信息架构、交互流程、原型设计与可用性测试。'],
  ['视觉表达', '品牌视觉、界面设计、设计系统、动效与展示型页面设计。'],
  ['前端实现', 'React、CSS、Node.js API，注重响应式体验与工程结构。'],
];

const projects = [
  ['Web Design', '个人品牌官网', '为自由职业者打造清晰、可信且易转化的个人展示网站。', 'gradient-one'],
  ['Dashboard', '数据分析后台', '优化复杂数据的浏览路径，帮助团队更快发现业务洞察。', 'gradient-two'],
  ['Mobile App', '习惯养成应用', '用轻量化激励机制提升用户持续记录与自我管理体验。', 'gradient-three'],
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [city, setCity] = useState('上海');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [trends, setTrends] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState('');

  const year = useMemo(() => new Date().getFullYear(), []);

  async function fetchWeather(targetCity = city) {
    const keyword = targetCity.trim();
    if (!keyword) {
      setWeatherError('请输入城市名称');
      return;
    }

    setWeatherLoading(true);
    setWeatherError('');

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '天气查询失败');
      setWeather(data);
    } catch (error) {
      setWeather(null);
      setWeatherError(error.message || '天气查询失败，请稍后重试');
    } finally {
      setWeatherLoading(false);
    }
  }

  async function fetchTrends() {
    setTrendsLoading(true);
    setTrendsError('');

    try {
      const response = await fetch('/api/weibo-hot');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '热搜获取失败');
      setTrends(data.items || []);
    } catch (error) {
      setTrendsError(error.message || '热搜获取失败，请稍后重试');
    } finally {
      setTrendsLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather('上海');
    fetchTrends();
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="nav" aria-label="主导航">
          <a className="brand" href="#home" aria-label="返回首页">
            <span className="brand-mark">A</span>
            <span>Alex Chen</span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label="打开导航菜单"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="home">
        <section className="hero section">
          <div className="hero-content">
            <p className="eyebrow">Smart Personal Hub</p>
            <h1>
              你好，我是 <span>Alex Chen</span>
              <br />一名热爱创造的产品设计师。
            </h1>
            <p className="hero-text">
              这是一个采用 React + Node API 的现代化个人网站 Demo。除了个人展示，还集成了天气查询与微博热搜，让网站更实用、更有互动感。
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#smart">体验功能</a>
              <a className="btn btn-secondary" href="#projects">查看项目</a>
            </div>
          </div>
          <div className="profile-card" aria-label="个人简介卡片">
            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>
            <div className="avatar" aria-hidden="true">AC</div>
            <div>
              <h2>Alex Chen</h2>
              <p>Product Designer / Full-stack Learner</p>
            </div>
            <ul className="quick-stats">
              <li><strong>5+</strong><span>年经验</span></li>
              <li><strong>20+</strong><span>项目交付</span></li>
              <li><strong>2</strong><span>实时功能</span></li>
            </ul>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="section-heading">
            <p className="eyebrow">About</p>
            <h2>关于我</h2>
          </div>
          <div className="about-grid">
            <p>我喜欢探索设计、技术与商业之间的连接点，擅长从用户视角拆解问题，并通过原型、视觉设计和前端实现快速验证方案。</p>
            <p>业余时间我会写作、摄影、学习新的开发工具，也乐于和不同领域的人交流，把灵感变成可落地的作品。</p>
          </div>
        </section>

        <section id="smart" className="section smart-section">
          <div className="section-heading smart-heading">
            <p className="eyebrow">Live Widgets</p>
            <h2>简单但实用的实时功能</h2>
            <p>通过后端 API 代理外部数据源，避免前端跨域问题，也让页面架构更接近真实项目。</p>
          </div>
          <div className="widget-grid">
            <WeatherWidget
              city={city}
              setCity={setCity}
              weather={weather}
              loading={weatherLoading}
              error={weatherError}
              onSearch={fetchWeather}
            />
            <TrendsWidget
              trends={trends}
              loading={trendsLoading}
              error={trendsError}
              onRefresh={fetchTrends}
            />
          </div>
        </section>

        <section id="skills" className="section skills">
          <div className="section-heading">
            <p className="eyebrow">Skills</p>
            <h2>我的能力</h2>
          </div>
          <div className="card-grid">
            {skills.map(([title, text], index) => (
              <article className="info-card" key={title}>
                <span className="card-icon">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section projects">
          <div className="section-heading">
            <p className="eyebrow">Projects</p>
            <h2>精选项目</h2>
          </div>
          <div className="project-list">
            {projects.map(([tag, title, text, gradient]) => (
              <article className="project-card" key={title}>
                <div className={`project-cover ${gradient}`}></div>
                <div className="project-content">
                  <p className="project-tag">{tag}</p>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="contact-card">
            <p className="eyebrow">Contact</p>
            <h2>想一起做点有趣的事？</h2>
            <p>欢迎联系我聊聊项目合作、产品想法或个人网站定制。</p>
            <div className="contact-actions">
              <a className="btn btn-primary" href="mailto:hello@example.com">hello@example.com</a>
              <a className="btn btn-secondary" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {year} Alex Chen. Built with React, Node.js & Open APIs.</p>
      </footer>
    </>
  );
}

function WeatherWidget({ city, setCity, weather, loading, error, onSearch }) {
  return (
    <article className="widget weather-widget">
      <div className="widget-topline">
        <div>
          <p className="eyebrow">Weather</p>
          <h3>城市天气查询</h3>
        </div>
        <span className="status-pill">Open-Meteo</span>
      </div>
      <form
        className="search-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="输入城市，如 北京 / 上海"
          aria-label="城市名称"
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? '查询中' : '查询'}</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {weather ? (
        <div className="weather-result">
          <div className="weather-main">
            <span className="weather-icon">{weather.icon}</span>
            <div>
              <strong>{Math.round(weather.temperature)}°C</strong>
              <p>{weather.description}</p>
            </div>
          </div>
          <dl className="weather-meta">
            <div><dt>城市</dt><dd>{weather.city}</dd></div>
            <div><dt>风速</dt><dd>{weather.windSpeed} km/h</dd></div>
            <div><dt>最高 / 最低</dt><dd>{Math.round(weather.max)}° / {Math.round(weather.min)}°</dd></div>
            <div><dt>更新时间</dt><dd>{weather.time}</dd></div>
          </dl>
        </div>
      ) : (
        !loading && <p className="muted-text">输入城市名，即可查看当前天气。</p>
      )}
    </article>
  );
}

function TrendsWidget({ trends, loading, error, onRefresh }) {
  return (
    <article className="widget trends-widget">
      <div className="widget-topline">
        <div>
          <p className="eyebrow">Weibo</p>
          <h3>今日微博热搜</h3>
        </div>
        <button className="refresh-button" type="button" onClick={onRefresh} disabled={loading}>{loading ? '刷新中' : '刷新'}</button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <div className="skeleton-list">
          {Array.from({ length: 6 }).map((_, index) => <span key={index}></span>)}
        </div>
      ) : (
        <ol className="trend-list">
          {trends.slice(0, 8).map((item, index) => (
            <li key={`${item.title}-${index}`}>
              <span className="trend-rank">{index + 1}</span>
              <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
              {item.hot && <small>{item.hot}</small>}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
