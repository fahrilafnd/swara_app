// utils/videoStorage.ts
const DB_NAME = 'SkorSwaraDB';
const STORE_NAME = 'recordings';
const DB_VERSION = 1;

export type RecordingData = {
  id: string;
  blob: Blob;
  durationSeconds: number;
  createdAt: number;
  topic?: string;
  text?: string;
  mimeType: string;
};

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

// Save video recording to IndexedDB
export async function saveRecording(data: Omit<RecordingData, 'id'>): Promise<string> {
  const db = await openDB();
  const id = `recording-${Date.now()}`;
  
  const recordingData: RecordingData = {
    id,
    ...data
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(recordingData);

    request.onsuccess = () => {
      // Also save to sessionStorage for quick access
      const metadata = {
        id,
        durationSeconds: data.durationSeconds,
        createdAt: data.createdAt,
        topic: data.topic,
        text: data.text,
        mimeType: data.mimeType
      };
      sessionStorage.setItem('skor-swara:lastRecording', JSON.stringify(metadata));
      resolve(id);
    };
    request.onerror = () => reject(request.error);
  });
}

// Get video recording from IndexedDB
export async function getRecording(id: string): Promise<RecordingData | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// Get latest recording
export async function getLatestRecording(): Promise<RecordingData | null> {
  try {
    const metadata = sessionStorage.getItem('skor-swara:lastRecording');
    if (!metadata) return null;

    const { id } = JSON.parse(metadata);
    return await getRecording(id);
  } catch (error) {
    console.error('Error getting latest recording:', error);
    return null;
  }
}

// Delete recording
export async function deleteRecording(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Clear all recordings
export async function clearAllRecordings(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      sessionStorage.removeItem('skor-swara:lastRecording');
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}