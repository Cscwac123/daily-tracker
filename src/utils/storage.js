const STORAGE_KEYS = {
  EXPENSES: 'app_expenses',
  NOTES: 'app_notes',
  SETTINGS: 'app_settings',
};

function read(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Expenses ---
export function getExpenses() {
  return read(STORAGE_KEYS.EXPENSES, []);
}

export function saveExpense(expense) {
  const list = getExpenses();
  list.unshift(expense);
  write(STORAGE_KEYS.EXPENSES, list);
}

export function deleteExpense(id) {
  const list = getExpenses().filter(e => e.id !== id);
  write(STORAGE_KEYS.EXPENSES, list);
}

export function updateExpense(id, data) {
  const list = getExpenses().map(e => e.id === id ? { ...e, ...data } : e);
  write(STORAGE_KEYS.EXPENSES, list);
}

// --- Notes ---
export function getNotes() {
  return read(STORAGE_KEYS.NOTES, []);
}

export function saveNote(note) {
  const list = getNotes();
  const idx = list.findIndex(n => n.id === note.id);
  if (idx >= 0) {
    list[idx] = note;
  } else {
    list.unshift(note);
  }
  write(STORAGE_KEYS.NOTES, list);
}

export function deleteNote(id) {
  const list = getNotes().filter(n => n.id !== id);
  write(STORAGE_KEYS.NOTES, list);
}

export function getNoteById(id) {
  return getNotes().find(n => n.id === id) || null;
}

// --- Export data (backup) ---
export function exportAllData() {
  return {
    expenses: getExpenses(),
    notes: getNotes(),
    exportedAt: new Date().toISOString(),
  };
}

export function importAllData(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (data.expenses) write(STORAGE_KEYS.EXPENSES, data.expenses);
    if (data.notes) write(STORAGE_KEYS.NOTES, data.notes);
    return true;
  } catch {
    return false;
  }
}
