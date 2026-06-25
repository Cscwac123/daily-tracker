import { useState, useEffect } from 'react';
import { getExpenses } from '../utils/storage';
import { getCategoryByKey } from '../utils/categories';
import './Home.css';

/* ── rotating backend tech phrases ── */
const TECH_LIST = [
  'Spring Boot 微服务',
  'Redis 缓存穿透',
  'MySQL 索引优化',
  'Docker 容器编排',
  'Kubernetes 集群',
  'RabbitMQ 消息队列',
  'Nginx 反向代理',
  'Linux 系统调优',
  'Elasticsearch 全文检索',
  'JVM 垃圾回收',
  '分布式事务 Seata',
  'CI/CD 流水线',
  'Netty 高性能 IO',
  'MyBatis 源码解析',
  'Sentinel 熔断降级',
];

/* ── weather helpers ── */
function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('no geolocation'));
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
  });
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia/Shanghai`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error('weather fetch failed');
  const data = await res.json();
  return data.current_weather;
}

const WEATHER_CODE_MAP = {
  0: ['☀️', '晴'], 1: ['🌤️', '少云'], 2: ['⛅', '多云'], 3: ['☁️', '阴'],
  45: ['🌫️', '雾'], 48: ['🌫️', '雾凇'], 51: ['🌦️', '小雨'], 53: ['🌦️', '中雨'],
  55: ['🌧️', '大雨'], 61: ['🌧️', '阵雨'], 71: ['🌨️', '小雪'], 73: ['🌨️', '中雪'],
  75: ['❄️', '大雪'], 80: ['⛈️', '雷阵雨'], 95: ['⛈️', '雷暴'],
};

export default function Home() {
  /* ── month expense data (direct read, always fresh) ── */
  const [monthOffset, setMonthOffset] = useState(0);

  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;

  const all = getExpenses();
  const filtered = all.filter(e => e.date && e.date.startsWith(monthStr));
  let incomeTotal = 0, expenseTotal = 0;
  const catMap = {};
  filtered.forEach(e => {
    if (e.type === 'income') {
      incomeTotal += e.amount;
    } else {
      expenseTotal += e.amount;
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    }
  });
  const categoryStats = Object.entries(catMap)
    .map(([key, amount]) => ({ ...getCategoryByKey(key, 'expense'), key, amount }))
    .sort((a, b) => b.amount - a.amount);
  const recentList = filtered.slice(0, 10);

  /* ── rotating tech text ── */
  const [techIdx, setTechIdx] = useState(() => Math.floor(Math.random() * TECH_LIST.length));
  useEffect(() => {
    const id = setInterval(() => setTechIdx(i => (i + 1) % TECH_LIST.length), 3 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  /* ── weather ── */
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pos = await getPosition();
        const w = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
        if (!cancelled) setWeather(w);
      } catch {
        if (!cancelled) setWeatherError(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const formatMoney = (v) => {
    if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
    return v.toFixed(2);
  };

  const maxCatAmount = categoryStats.length > 0 ? categoryStats[0].amount : 1;
  const monthLabel = `${year}年${month}月`;

  return (
    <div className="page">
      {/* Month header */}
      <div className="home-header">
        <button className="month-nav" onClick={() => setMonthOffset(o => o - 1)}>‹</button>
        <h2 className="month-title">{monthLabel}</h2>
        <button
          className="month-nav"
          onClick={() => { if (monthOffset < 0) setMonthOffset(o => o + 1); }}
          disabled={monthOffset >= 0}
        >›</button>
      </div>

      <div className="page-scroll">
        {/* ── weather bar ── */}
        {weather && (
          <div className="weather-bar anim-fade-in">
            {(() => {
              const wm = WEATHER_CODE_MAP[weather.weathercode] || ['🌡️', '--'];
              return (
                <>
                  <span className="weather-icon">{wm[0]}</span>
                  <span className="weather-text">{wm[1]} {weather.temperature}°C</span>
                  <span className="weather-wind">💨 {weather.windspeed}km/h</span>
                </>
              );
            })()}
          </div>
        )}
        {weatherError && (
          <div className="weather-bar weather-muted anim-fade-in">
            <span className="weather-icon">🌍</span>
            <span className="weather-text">允许定位即可获取天气</span>
          </div>
        )}
        {!weather && !weatherError && (
          <div className="weather-bar weather-muted">
            <span className="weather-text">📍 正在获取天气...</span>
          </div>
        )}

        {/* ── rotating tech ticker ── */}
        <div className="tech-ticker anim-fade-in" key={techIdx}>
          <span className="tech-label">📚 后端技术</span>
          <span className="tech-phrase">{TECH_LIST[techIdx]}</span>
        </div>

        {/* Summary cards */}
        <div className="summary-row">
          <div className="summary-card expense-card">
            <span className="summary-label">支出</span>
            <span className="summary-amount expense-amount">¥{formatMoney(expenseTotal)}</span>
          </div>
          <div className="summary-card income-card">
            <span className="summary-label">收入</span>
            <span className="summary-amount income-amount">¥{formatMoney(incomeTotal)}</span>
          </div>
          <div className="summary-card balance-card">
            <span className="summary-label">结余</span>
            <span className={`summary-amount ${incomeTotal - expenseTotal >= 0 ? 'income-amount' : 'expense-amount'}`}>
              ¥{formatMoney(incomeTotal - expenseTotal)}
            </span>
          </div>
        </div>

        {/* Category breakdown */}
        {categoryStats.length > 0 && (
          <section className="card section-card">
            <h3 className="section-title">支出分类排行</h3>
            <div className="category-bars">
              {categoryStats.slice(0, 8).map(cat => (
                <div key={cat.key} className="cat-bar-row">
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{
                      width: `${Math.max((cat.amount / maxCatAmount) * 100, 3)}%`,
                      background: cat.color,
                    }} />
                  </div>
                  <span className="cat-amount">¥{formatMoney(cat.amount)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent transactions */}
        <section className="card section-card">
          <h3 className="section-title">最近账单</h3>
          {recentList.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>本月暂无账单记录</p>
              <p className="empty-hint">点击底部"记账"开始记录吧</p>
            </div>
          ) : (
            <div className="recent-list">
              {recentList.map(item => {
                const cat = getCategoryByKey(item.category, item.type);
                return (
                  <div key={item.id} className="recent-item">
                    <span className="recent-icon" style={{ background: cat.color + '22' }}>{cat.icon}</span>
                    <div className="recent-info">
                      <span className="recent-cat">{cat.label}</span>
                      {item.note && <span className="recent-note">{item.note}</span>}
                    </div>
                    <div className="recent-right">
                      <span className={`recent-amount ${item.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
                        {item.type === 'income' ? '+' : '-'}¥{item.amount.toFixed(2)}
                      </span>
                      <span className="recent-date">{item.date?.slice(5) || ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
