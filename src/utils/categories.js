// Expense categories with icons and colors
export const EXPENSE_CATEGORIES = [
  { key: 'food', label: '餐饮', icon: '🍔', color: '#FF6B6B' },
  { key: 'transport', label: '交通', icon: '🚌', color: '#FFA94D' },
  { key: 'shopping', label: '购物', icon: '🛒', color: '#F06595' },
  { key: 'entertainment', label: '娱乐', icon: '🎮', color: '#9775FA' },
  { key: 'housing', label: '居住', icon: '🏠', color: '#748FFC' },
  { key: 'medical', label: '医疗', icon: '💊', color: '#20C997' },
  { key: 'study', label: '学习', icon: '📚', color: '#339AF0' },
  { key: 'communication', label: '通讯', icon: '📱', color: '#F783AC' },
  { key: 'beauty', label: '美容', icon: '💄', color: '#DA77F2' },
  { key: 'social', label: '社交', icon: '🎉', color: '#FF8787' },
  { key: 'pets', label: '宠物', icon: '🐱', color: '#63E6BE' },
  { key: 'travel', label: '旅行', icon: '✈️', color: '#4DABF7' },
  { key: 'digital', label: '数码', icon: '💻', color: '#495057' },
  { key: 'other', label: '其他', icon: '💡', color: '#868E96' },
];

export const INCOME_CATEGORIES = [
  { key: 'salary', label: '工资', icon: '💰', color: '#51CF66' },
  { key: 'bonus', label: '奖金', icon: '🧧', color: '#FF922B' },
  { key: 'parttime', label: '兼职', icon: '💼', color: '#339AF0' },
  { key: 'investment', label: '理财', icon: '📈', color: '#F06595' },
  { key: 'refund', label: '退款', icon: '↩️', color: '#20C997' },
  { key: 'gift', label: '礼金', icon: '🎁', color: '#DA77F2' },
  { key: 'other_income', label: '其他', icon: '💡', color: '#868E96' },
];

export const NOTE_CATEGORIES = [
  { key: 'reading', label: '读书笔记', icon: '📖', color: '#748FFC' },
  { key: 'coding', label: '编程学习', icon: '💻', color: '#FF6B6B' },
  { key: 'language', label: '语言学习', icon: '🌐', color: '#51CF66' },
  { key: 'course', label: '课程笔记', icon: '📝', color: '#FFA94D' },
  { key: 'thinking', label: '思考随笔', icon: '🧠', color: '#DA77F2' },
  { key: 'work', label: '工作笔记', icon: '📋', color: '#339AF0' },
  { key: 'life', label: '生活感悟', icon: '✨', color: '#F06595' },
  { key: 'other_note', label: '其他', icon: '💡', color: '#868E96' },
];

export function getCategoryByKey(key, type = 'expense') {
  const pool = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return pool.find(c => c.key === key) || pool[pool.length - 1];
}
