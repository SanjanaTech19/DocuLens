// Local Database Persistence Service for DocuLens (User Authentication & Vault Storage)

const USERS_STORAGE_KEY = 'doculens_users_db_v1';
const SESSION_USER_KEY = 'doculens_active_user_v1';
const DOCUMENTS_STORAGE_KEY = 'doculens_documents_db_v1';
const FINDINGS_STORAGE_KEY = 'doculens_saved_findings_v1';

const DEFAULT_USER = {
  id: 'usr-default-1',
  name: 'Sanjana Raj',
  email: 'sanjana@doculens.ai',
  role: 'Lead Investigator',
  createdAt: new Date().toISOString()
};

export function initDatabase() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([
      { ...DEFAULT_USER, password: 'password123' }
    ]));
  }

  if (!localStorage.getItem(SESSION_USER_KEY)) {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(DEFAULT_USER));
  }

  if (!localStorage.getItem(DOCUMENTS_STORAGE_KEY)) {
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(FINDINGS_STORAGE_KEY)) {
    localStorage.setItem(FINDINGS_STORAGE_KEY, JSON.stringify([]));
  }
}

// ----------------- USER AUTHENTICATION DATABASE -----------------

export function getActiveUser() {
  initDatabase();
  try {
    const userStr = localStorage.getItem(SESSION_USER_KEY);
    return userStr ? JSON.parse(userStr) : DEFAULT_USER;
  } catch (e) {
    return DEFAULT_USER;
  }
}

export function loginUser(email, password) {
  initDatabase();
  const usersStr = localStorage.getItem(USERS_STORAGE_KEY) || '[]';
  const users = JSON.parse(usersStr);

  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (found) {
    const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role || 'Lead Investigator' };
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  } else {
    // Seamless register if user doesn't exist yet
    const newUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      email: email,
      role: 'Lead Investigator',
      createdAt: new Date().toISOString()
    };
    users.push({ ...newUser, password });
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }
}

export function registerUser(name, email, password) {
  initDatabase();
  const usersStr = localStorage.getItem(USERS_STORAGE_KEY) || '[]';
  const users = JSON.parse(usersStr);

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'Lead Investigator',
    email: email,
    role: 'Lead Investigator',
    createdAt: new Date().toISOString()
  };

  users.push({ ...newUser, password });
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(newUser));
  return { success: true, user: newUser };
}

export function logoutUser() {
  initDatabase();
  localStorage.removeItem(SESSION_USER_KEY);
  return true;
}

// ----------------- EVIDENCE VAULT DOCUMENTS DATABASE -----------------

export function getStoredDocuments() {
  initDatabase();
  try {
    const docsStr = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    return docsStr ? JSON.parse(docsStr) : [];
  } catch (e) {
    return [];
  }
}

export function saveDocumentToDb(newDoc) {
  initDatabase();
  const docs = getStoredDocuments();
  const filtered = docs.filter(d => d.id !== newDoc.id);
  const updated = [newDoc, ...filtered];
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteDocumentFromDb(docId) {
  initDatabase();
  const docs = getStoredDocuments();
  const updated = docs.filter(d => d.id !== docId);
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// ----------------- SAVED FINDINGS DATABASE -----------------

export function getStoredFindings() {
  initDatabase();
  try {
    const findStr = localStorage.getItem(FINDINGS_STORAGE_KEY);
    return findStr ? JSON.parse(findStr) : [];
  } catch (e) {
    return [];
  }
}

export function saveFindingToDb(finding) {
  initDatabase();
  const findings = getStoredFindings();
  const updated = [finding, ...findings];
  localStorage.setItem(FINDINGS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteFindingFromDb(findingId) {
  initDatabase();
  const findings = getStoredFindings();
  const updated = findings.filter(f => f.id !== findingId);
  localStorage.setItem(FINDINGS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
