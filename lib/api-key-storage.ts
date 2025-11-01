// This stores API keys securely in localStorage and provides utilities for managing them

interface StoredApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed?: string
}

const STORAGE_KEY = "aj-studioz-api-keys"

export function getStoredApiKeys(): StoredApiKey[] {
  try {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to get API keys:", error)
    return []
  }
}

export function saveApiKey(key: StoredApiKey): void {
  try {
    const keys = getStoredApiKeys()
    const index = keys.findIndex((k) => k.id === key.id)
    if (index >= 0) {
      keys[index] = key
    } else {
      keys.push(key)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  } catch (error) {
    console.error("Failed to save API key:", error)
  }
}

export function deleteApiKey(id: string): void {
  try {
    const keys = getStoredApiKeys().filter((k) => k.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  } catch (error) {
    console.error("Failed to delete API key:", error)
  }
}

export function updateLastUsed(id: string): void {
  try {
    const keys = getStoredApiKeys()
    const key = keys.find((k) => k.id === id)
    if (key) {
      key.lastUsed = new Date().toLocaleString()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    }
  } catch (error) {
    console.error("Failed to update last used:", error)
  }
}
