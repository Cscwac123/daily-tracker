import { useState, useMemo } from 'react';
import { getExpenses } from '../utils/storage';
import { getCategoryByKey, EXPENSE_CATEGORIES } from '../utils/categories';
import './Home.css';

export default function Home() {
  const [monthOffset, setMonthOffset] = useState(0);

  const targetDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;

  const monthStr = `${year}-${String(month).padStart(2, '0')}`;

  const { expenses, incomeTotal, expenseTotal, categoryStats } = useMemo(() => {
    const all = getExpenses();
    const filtered = all.filter(e => e.date && e.date.startsWith(monthStr));
    let inc = 0, exp = 0;
    const catMap = {};
    filtered.forEach(e => {
      if (e.type === 'income') {
        inc += e.amount;
      } else {
        exp += e.amount;
        catMap[e.category] = (catMap[e.category] || 0) + e.amount;
      }
    });
    const stats = Object.entries(catMap)
      .map(([key, amount]) => ({ ...getCategoryByKey(key, 'expense'), key, amount }))
      .sort((a, b) => b.amount - a.amount);
    return { expenses: filtered, incomeTotal: inc, expenseTotal: exp, categoryStats: stats };
  }, [monthStr]);

  const recentList = expenses.slice(0, 10);

  const monthLabel = `${year}年${month}月`;

  const formatMoney = (v) => {
    if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
    return v.toFixed(2);
  };

  const maxCatAmount = categoryStats.length > 0 ? categoryStats[0].amount : 1;

  return (
    <div className="page">
      {/* Month header */}
      <div className="home-header">
        <button className="month-nav" onClick={() => setMonthOffset(o => o - 1)}>
          ‹
        </button>
        <h2 className="month-title">{monthLabel}</h2>
        <button
          className="month-nav"
          onClick={() => { if (monthOffset < 0) setMonthOffset(o => o + 1); }}
          disabled={monthOffset >= 0}
        >
          ›
        </button>
      </div>

      <div className="page-scroll">
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
                    <div
                      className="cat-bar-fill"
                      style={{
                        width: `${Math.max((cat.amount / maxCatAmount) * 100, 3)}%`,
                        background: cat.color,
                      }}
                    />
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
                    <span className="recent-icon" style={{ background: cat.color + '22' }}>
                      {cat.icon}
                    </span>
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
