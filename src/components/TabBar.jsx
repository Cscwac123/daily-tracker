import './TabBar.css';

export default function TabBar({ tabs, active, onChange, visible = true }) {
  return (
    <nav className={`tab-bar ${visible ? '' : 'hidden'}`}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`tab-btn ${active === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
