import {
  WordSet,
  Word,
  TrainingResult,
  CreateWordSetInput,
  UpdateWordSetInput,
  CreateWordInput,
  UpdateWordInput,
  TrainingMode,
} from "../types/quiz";

const STORAGE_KEY = "quiz-trainer-db-v1";
const LATENCY = 220;

interface Database {
  wordSets: WordSet[];
  words: Word[];
  trainingResults: TrainingResult[];
}

const defaultWordSets: WordSet[] = [
  {
    id: "set-travel",
    name: "Подорожі",
    description: "Слова, які стануть у пригоді під час туристичної поїздки",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "set-business",
    name: "Бізнес",
    description: "Лексика для ділового спілкування",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultWords: Word[] = [
  {
    id: "word-1",
    setId: "set-travel",
    term: "boarding pass",
    translation: "посадковий талон",
    example: "Please keep your boarding pass ready.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "word-2",
    setId: "set-travel",
    term: "to book",
    translation: "бронювати",
    example: "We need to book a hotel room.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "word-3",
    setId: "set-business",
    term: "deadline",
    translation: "кінцевий термін",
    example: "The project deadline is next Monday.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultDb: Database = {
  wordSets: defaultWordSets,
  words: defaultWords,
  trainingResults: [],
};

let memoryDb: Database = loadDb();

function loadDb(): Database {
  if (typeof window === "undefined") {
    return structuredClone(defaultDb);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaultDb);
    }
    const parsed = JSON.parse(raw) as Database;
    return {
      ...parsed,
      wordSets: parsed.wordSets ?? [],
      words: parsed.words ?? [],
      trainingResults: parsed.trainingResults ?? [],
    };
  } catch (error) {
    console.warn("Failed to load local DB, fallback to defaults", error);
    return structuredClone(defaultDb);
  }
}

function persistDb() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDb));
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function delay(ms: number = LATENCY) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getWordSets(): Promise<WordSet[]> {
  await delay();
  return clone(memoryDb.wordSets);
}

export async function getWordSetById(id: string): Promise<WordSet | undefined> {
  await delay();
  return clone(memoryDb.wordSets.find((set) => set.id === id));
}

export async function createWordSet(input: CreateWordSetInput): Promise<WordSet> {
  await delay();
  const now = new Date().toISOString();
  const newSet: WordSet = {
    id: generateId("set"),
    name: input.name.trim(),
    description: input.description?.trim(),
    createdAt: now,
    updatedAt: now,
  };
  memoryDb.wordSets.push(newSet);
  persistDb();
  return clone(newSet);
}

export async function updateWordSet(
  id: string,
  updates: UpdateWordSetInput,
): Promise<WordSet> {
  await delay();
  const target = memoryDb.wordSets.find((set) => set.id === id);
  if (!target) {
    throw new Error("Набір не знайдено");
  }
  target.name = updates.name?.trim() ?? target.name;
  target.description =
    updates.description !== undefined ? updates.description.trim() : target.description;
  target.updatedAt = new Date().toISOString();
  persistDb();
  return clone(target);
}

export async function deleteWordSet(id: string): Promise<void> {
  await delay();
  memoryDb.wordSets = memoryDb.wordSets.filter((set) => set.id !== id);
  memoryDb.words = memoryDb.words.filter((word) => word.setId !== id);
  persistDb();
}

export async function getWordsBySetId(setId: string | "all"): Promise<Word[]> {
  await delay();
  if (setId === "all") {
    return clone(memoryDb.words);
  }
  return clone(memoryDb.words.filter((word) => word.setId === setId));
}

export async function createWord(input: CreateWordInput): Promise<Word> {
  await delay();
  const setExists = memoryDb.wordSets.some((set) => set.id === input.setId);
  if (!setExists) {
    throw new Error("Набір не існує");
  }
  const now = new Date().toISOString();
  const newWord: Word = {
    id: generateId("word"),
    setId: input.setId,
    term: input.term.trim(),
    translation: input.translation.trim(),
    example: input.example?.trim(),
    createdAt: now,
    updatedAt: now,
  };
  memoryDb.words.push(newWord);
  persistDb();
  return clone(newWord);
}

export async function updateWord(id: string, updates: UpdateWordInput): Promise<Word> {
  await delay();
  const target = memoryDb.words.find((word) => word.id === id);
  if (!target) {
    throw new Error("Слово не знайдено");
  }
  target.term = updates.term?.trim() ?? target.term;
  target.translation = updates.translation?.trim() ?? target.translation;
  target.example = updates.example !== undefined ? updates.example.trim() : target.example;
  target.updatedAt = new Date().toISOString();
  persistDb();
  return clone(target);
}

export async function deleteWord(id: string): Promise<void> {
  await delay();
  memoryDb.words = memoryDb.words.filter((word) => word.id !== id);
  persistDb();
}

export async function recordTrainingResult(
  result: Omit<TrainingResult, "id" | "startedAt" | "finishedAt"> & {
    startedAt?: string;
    finishedAt?: string;
  },
): Promise<TrainingResult> {
  await delay();
  const completed: TrainingResult = {
    id: generateId("result"),
    startedAt: result.startedAt ?? new Date().toISOString(),
    finishedAt: result.finishedAt ?? new Date().toISOString(),
    ...result,
  };
  memoryDb.trainingResults.unshift(completed);
  memoryDb.trainingResults = memoryDb.trainingResults.slice(0, 100);
  persistDb();
  return clone(completed);
}

export async function getRecentTrainingResults(limit = 10): Promise<TrainingResult[]> {
  await delay();
  return clone(memoryDb.trainingResults.slice(0, limit));
}

export async function resetDatabase() {
  memoryDb = structuredClone(defaultDb);
  persistDb();
}

export async function seedDemoData() {
  memoryDb = structuredClone(defaultDb);
  persistDb();
}

export function isSetIdValid(id: string | undefined): id is string {
  if (!id) return false;
  return memoryDb.wordSets.some((set) => set.id === id);
}

export function getModeLabel(mode: TrainingMode): string {
  switch (mode) {
    case "education":
      return "Навчання";
    case "accuracy":
      return "Точність";
    case "speed":
      return "Швидкість";
    case "flashcards":
      return "Флеш-картки";
    default:
      return mode;
  }
}


