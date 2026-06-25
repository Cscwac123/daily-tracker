import { useState } from 'react';
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
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home key={refreshKey} />;
      case 'expense':
        return <Expense key={refreshKey} onSaved={triggerRefresh} />;
      case 'notes':
        return <Notes key={refreshKey} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <main className="app-main">
        {renderTab()}
      </main>
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
