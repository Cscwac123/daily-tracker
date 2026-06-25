import { useState, useCallback } from 'react';
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

  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
    // Force fresh mount when switching to a tab
    if (tab === 'home') setHomeKey(k => k + 1);
    if (tab === 'expense') setExpenseKey(k => k + 1);
    if (tab === 'notes') setNotesKey(k => k + 1);
  }, []);

  const handleSaved = useCallback(() => {
    // Force home to refresh next time user views it
    setHomeKey(k => k + 1);
  }, []);

  return (
    <div className="app-shell">
      <main className="app-main">
        {activeTab === 'home' && <Home key={homeKey} />}
        {activeTab === 'expense' && <Expense key={expenseKey} onSaved={handleSaved} />}
        {activeTab === 'notes' && <Notes key={notesKey} />}
      </main>
      <TabBar tabs={TABS} active={activeTab} onChange={switchTab} />
    </div>
  );
}
