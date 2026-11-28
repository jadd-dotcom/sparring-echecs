// Stockage persistant : demande au navigateur de ne pas effacer les données de l'appli (IndexedDB) quand l'espace manque.

/** Demande la persistance (au démarrage). Renvoie l'état obtenu ; false si l'API est absente. */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted?.()) return true;
    return await navigator.storage.persist();
  } catch { return false; }
}

/** Le stockage est-il protégé ? false si l'API est absente. */
export async function isStoragePersisted(): Promise<boolean> {
  try { return !!(await navigator.storage?.persisted?.()); } catch { return false; }
}
