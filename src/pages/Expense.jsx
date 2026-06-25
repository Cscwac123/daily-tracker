import { useState } from 'react';
import { saveExpense } from '../utils/storage';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';
import './Expense.css';

export default function Expense({ onSaved }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [showToast, setShowToast] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleNum = (num) => {
    if (num === '.') {
      if (amount.includes('.')) return;
      if (amount === '') return;
    }
    const next = amount + num;
    const parts = next.split('.');
    if (parts[1] && parts[1].length > 2) return;
    if (parts[0].length > 9) return;
    setAmount(next);
  };

  const handleDelete = () => setAmount(prev => prev.slice(0, -1));
  const handleClear = () => setAmount('');

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    saveExpense({
      id: Date.now().toString(),
      type,
      amount: num,
      category,
      date,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
    setAmount('');
    setNote('');
    if (onSaved) onSaved();
  };

  const displayAmount = amount || '0';

  return (
    <div className="page expense-page">
      {/* scrollable upper area */}
      <div className="expense-scroll">
        {/* Type toggle */}
        <div className="expense-type-toggle">
          <button
            className={`type-btn expense-type ${type === 'expense' ? 'active' : ''}`}
            onClick={() => { setType('expense'); setCategory('food'); }}
          >支出</button>
          <button
            className={`type-btn income-type ${type === 'income' ? 'active' : ''}`}
            onClick={() => { setType('income'); setCategory('salary'); }}
          >收入</button>
        </div>

        {/* Amount display */}
        <div className={`amount-display ${type === 'income' ? 'income-color' : ''}`}>
          <span className="currency">¥</span>
          <span className="amount-value">{displayAmount}</span>
        </div>

        {/* Category picker */}
        <div className="category-grid">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`cat-item ${category === cat.key ? 'selected' : ''}`}
              style={category === cat.key ? { background: cat.color + '18', borderColor: cat.color } : {}}
              onClick={() => setCategory(cat.key)}
            >
              <span className="cat-item-icon">{cat.icon}</span>
              <span className="cat-item-label" style={category === cat.key ? { color: cat.color } : {}}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Date & Note */}
        <div className="extra-fields">
          <div className="field-row">
            <span className="field-icon">📅</span>
            <input type="date" className="field-input date-input" value={date}
              onChange={e => setDate(e.target.value)} />
          </div>
          <div className="field-row">
            <span className="field-icon">📝</span>
            <input type="text" className="field-input" placeholder="添加备注..." value={note}
              onChange={e => setNote(e.target.value)} maxLength={30} />
          </div>
        </div>
      </div>

      {/* fixed bottom: numpad + actions */}
      <div className="expense-bottom">
        <div className="numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map(key => (
            <button
              key={key}
              className={`numpad-btn ${key === '⌫' ? 'num-delete' : ''} ${key === '.' ? 'num-dot' : ''}`}
              onClick={() => key === '⌫' ? handleDelete() : handleNum(String(key))}
            >{key}</button>
          ))}
        </div>
        <div className="numpad-actions">
          <button className="btn-clear" onClick={handleClear}>清空</button>
          <button
            className={`btn-submit ${type === 'income' ? 'submit-income' : ''}`}
            onClick={handleSubmit}
            disabled={!amount}
          >记一笔</button>
        </div>
      </div>

      {showToast && <div className="toast anim-pop-in">✅ 已记录</div>}
    </div>
  );
}
