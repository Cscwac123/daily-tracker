import { useState, useCallback, useEffect, useRef } from 'react';
import Home from './pages/Home';
import Expense from './pages/Expense';
import Notes from './pages/Notes';
import TabBar from './components/TabBar';
import './App.css';

const TABS = [
  { key: 'home', label: '概览', icon: '📊' },
  { key: 'expense', label: '记账', icon: '💳' },
  { key: 'notes', label: '笔记', icon: '📝' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [homeKey, setHomeKey] = useState(0);
  const [expenseKey, setExpenseKey] = useState(0);
  const [notesKey, setNotesKey] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);

  const lastScrollY = useRef(0);
  const hideTimer = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      const st = e.target.scrollTop;
      if (st <= 5) {
        setTabVisible(true);
      } else if (st > lastScrollY.current && st > 60) {
        setTabVisible(false);
      } else if (st < lastScrollY.current - 8) {
        setTabVisible(true);
      }
      lastScrollY.current = st;

      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setTabVisible(true), 3000);
    };

    /* ── numpad open/close events ── */
    const hideTab = () => { setTabVisible(false); clearTimeout(hideTimer.current); };
    const showTab = () => setTabVisible(true);

    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    window.addEventListener('hide-tabbar', hideTab);
    window.addEventListener('show-tabbar', showTab);

    return () => {
      document.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('hide-tabbar', hideTab);
      window.removeEventListener('show-tabbar', showTab);
      clearTimeout(hideTimer.current);
    };
  }, []);

  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
    setTabVisible(true);
    lastScrollY.current = 0;
    if (tab === 'home') setHomeKey(k => k + 1);
    if (tab === 'expense') setExpenseKey(k => k + 1);
    if (tab === 'notes') setNotesKey(k => k + 1);
  }, []);

  const handleSaved = useCallback(() => {
    setHomeKey(k => k + 1);
  }, []);

  return (
    <div className="app-shell">
      <main className="app-main">
        {activeTab === 'home' && <Home key={homeKey} />}
        {activeTab === 'expense' && <Expense key={expenseKey} onSaved={handleSaved} />}
        {activeTab === 'notes' && <Notes key={notesKey} />}
      </main>
      <TabBar tabs={TABS} active={activeTab} onChange={switchTab} visible={tabVisible} />
    </div>
  );
}
