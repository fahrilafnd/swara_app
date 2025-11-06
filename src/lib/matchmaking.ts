// lib/matchmaking.ts
// Service untuk handle matchmaking logic

export type Player = {
  id: string;
  name: string;
  avatar: string;
  level: number;
  winRate: number;
  avgScore: number;
};

export type BattleRoom = {
  roomId: string;
  topic: string;
  topicImage: string;
  topicDescription: string;
  player1: Player;
  player2: Player;
  currentTurn: "player1" | "player2";
  player1TimeRemaining: number;
  player2TimeRemaining: number;
  status: "waiting" | "active" | "finished";
  createdAt: number;
  lastActivity: number;
};

export type QueueEntry = {
  playerId: string;
  player: Player;
  timestamp: number;
  level: number;
};

// Simulate current user
export const getCurrentUser = (): Player => {
  // Di production, ambil dari auth/session
  const userId = getOrCreateUserId();
  
  return {
    id: userId,
    name: "Kimberly",
    avatar:
      "https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg",
    level: 2,
    winRate: 53,
    avgScore: 280,
  };
};

// Generate or get existing user ID
const getOrCreateUserId = (): string => {
  if (typeof window === "undefined") return "user-temp";
  
  let userId = localStorage.getItem("swara_user_id");
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("swara_user_id", userId);
  }
  return userId;
};

// Mock topics database
const TOPICS = [
  {
    title: "Merancang Masa Depan: Membangun Karier di Era Digital",
    image:
      "https://images.unsplash.com/photo-1601084195907-44baaa49dabd?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=900",
    description:
      "Gunakan 30–60 detik untuk menjelaskan: peluang, tantangan, dan contoh konkret.",
  },
  {
    title: "Teknologi AI dan Dampaknya Terhadap Pekerjaan Masa Depan",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=900",
    description:
      "Jelaskan bagaimana AI mengubah dunia kerja dan cara adaptasinya.",
  },
  {
    title: "Pentingnya Kesehatan Mental di Lingkungan Kerja",
    image:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=900",
    description:
      "Diskusikan mengapa kesehatan mental penting dan cara menjaganya.",
  },
  {
    title: "Keberlanjutan Lingkungan: Tanggung Jawab Bersama",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=900",
    description: "Jelaskan peran individu dalam menjaga kelestarian lingkungan.",
  },
];

// Get random topic
export const getRandomTopic = () => {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
};

// MATCHMAKING QUEUE SYSTEM
const QUEUE_KEY = "matchmaking_queue";
const QUEUE_TIMEOUT = 60000; // 60 seconds

// Add player to matchmaking queue
export const joinQueue = (player: Player): void => {
  if (typeof window === "undefined") return;

  const queue = getQueue();
  
  // Remove if already in queue
  const filtered = queue.filter((entry) => entry.playerId !== player.id);
  
  // Add to queue
  const entry: QueueEntry = {
    playerId: player.id,
    player,
    timestamp: Date.now(),
    level: player.level,
  };
  
  filtered.push(entry);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  
  console.log("Joined queue:", entry);
};

// Remove player from queue
export const leaveQueue = (playerId: string): void => {
  if (typeof window === "undefined") return;

  const queue = getQueue();
  const filtered = queue.filter((entry) => entry.playerId !== playerId);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  
  console.log("Left queue:", playerId);
};

// Get matchmaking queue
export const getQueue = (): QueueEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const queueData = localStorage.getItem(QUEUE_KEY);
    if (!queueData) return [];

    const queue: QueueEntry[] = JSON.parse(queueData);
    
    // Filter out expired entries (older than 60 seconds)
    const now = Date.now();
    const validQueue = queue.filter(
      (entry) => now - entry.timestamp < QUEUE_TIMEOUT
    );
    
    // Update queue if filtered
    if (validQueue.length !== queue.length) {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(validQueue));
    }
    
    return validQueue;
  } catch (error) {
    console.error("Error getting queue:", error);
    return [];
  }
};

// Find match in queue
export const findMatch = (currentPlayer: Player): Player | null => {
  const queue = getQueue();
  
  // Find opponent with same level, excluding self
  const opponent = queue.find(
    (entry) =>
      entry.playerId !== currentPlayer.id &&
      entry.level === currentPlayer.level
  );
  
  if (opponent) {
    // Remove both players from queue
    leaveQueue(currentPlayer.id);
    leaveQueue(opponent.playerId);
    return opponent.player;
  }
  
  // Find any opponent, excluding self
  const anyOpponent = queue.find(
    (entry) => entry.playerId !== currentPlayer.id
  );
  
  if (anyOpponent) {
    // Remove both players from queue
    leaveQueue(currentPlayer.id);
    leaveQueue(anyOpponent.playerId);
    return anyOpponent.player;
  }
  
  return null;
};

// Get queue count (excluding self)
export const getQueueCount = (currentPlayerId: string): number => {
  const queue = getQueue();
  return queue.filter((entry) => entry.playerId !== currentPlayerId).length;
};

// Create battle room
export const createBattleRoom = (player1: Player, player2: Player): BattleRoom => {
  const topic = getRandomTopic();
  const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const room: BattleRoom = {
    roomId,
    topic: topic.title,
    topicImage: topic.image,
    topicDescription: topic.description,
    player1,
    player2,
    currentTurn: Math.random() > 0.5 ? "player1" : "player2",
    player1TimeRemaining: 60, // 60 seconds per player
    player2TimeRemaining: 60, // 60 seconds per player
    status: "active",
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };

  // Save to localStorage (simulate server)
  if (typeof window !== "undefined") {
    localStorage.setItem(`battle_room_${roomId}`, JSON.stringify(room));
    localStorage.setItem("current_battle_room", roomId);
  }

  return room;
};

// Get battle room
export const getBattleRoom = (roomId: string): BattleRoom | null => {
  if (typeof window === "undefined") return null;

  const roomData = localStorage.getItem(`battle_room_${roomId}`);
  if (!roomData) return null;

  return JSON.parse(roomData);
};

// Get current battle room
export const getCurrentBattleRoom = (): BattleRoom | null => {
  if (typeof window === "undefined") return null;

  const roomId = localStorage.getItem("current_battle_room");
  if (!roomId) return null;

  return getBattleRoom(roomId);
};

// Update battle room
export const updateBattleRoom = (room: BattleRoom): void => {
  if (typeof window === "undefined") return;

  room.lastActivity = Date.now();
  localStorage.setItem(`battle_room_${room.roomId}`, JSON.stringify(room));
};

// Switch turn
export const switchTurn = (roomId: string): void => {
  const room = getBattleRoom(roomId);
  if (!room) return;

  room.currentTurn = room.currentTurn === "player1" ? "player2" : "player1";
  updateBattleRoom(room);
};

// Update player time
export const updatePlayerTime = (
  roomId: string,
  player: "player1" | "player2",
  timeRemaining: number
): void => {
  const room = getBattleRoom(roomId);
  if (!room) return;

  if (player === "player1") {
    room.player1TimeRemaining = timeRemaining;
  } else {
    room.player2TimeRemaining = timeRemaining;
  }

  updateBattleRoom(room);
};

// Check if battle is finished
export const isBattleFinished = (roomId: string): boolean => {
  const room = getBattleRoom(roomId);
  if (!room) return true;

  return (
    room.status === "finished" ||
    room.player1TimeRemaining <= 0 ||
    room.player2TimeRemaining <= 0
  );
};

// Finish battle
export const finishBattle = (roomId: string): void => {
  const room = getBattleRoom(roomId);
  if (!room) return;

  room.status = "finished";
  updateBattleRoom(room);

  // Clear current room
  if (typeof window !== "undefined") {
    localStorage.removeItem("current_battle_room");
  }
};

// Clear all battle rooms (for cleanup)
export const clearBattleRooms = (): void => {
  if (typeof window === "undefined") return;

  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("battle_room_")) {
      localStorage.removeItem(key);
    }
  });
  localStorage.removeItem("current_battle_room");
};

// Clear matchmaking queue
export const clearQueue = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QUEUE_KEY);
};
