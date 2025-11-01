export interface StoredRequest {
  id: string
  method: string
  url: string
  params: Record<string, string>
  headers: Record<string, string>
  body?: string
  name?: string
  collectionId?: string
  timestamp: string
}

export interface RequestCollection {
  id: string
  name: string
  description?: string
  created: string
  requests: string[] // request IDs
}

const REQUESTS_KEY = "aj-studioz-requests"
const COLLECTIONS_KEY = "aj-studioz-collections"
const HISTORY_KEY = "aj-studioz-history"

// Request History (most recent 50 requests)
export function addToHistory(request: Omit<StoredRequest, "id" | "timestamp">): StoredRequest {
  try {
    const history = getHistory()
    const newRequest: StoredRequest = {
      ...request,
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
    }
    history.unshift(newRequest)
    if (history.length > 50) {
      history.pop()
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return newRequest
  } catch (error) {
    console.error("Failed to add to history:", error)
    return {} as StoredRequest
  }
}

export function getHistory(): StoredRequest[] {
  try {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to get history:", error)
    return []
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error("Failed to clear history:", error)
  }
}

// Collections
export function createCollection(name: string, description?: string): RequestCollection {
  try {
    const collections = getCollections()
    const newCollection: RequestCollection = {
      id: Math.random().toString(),
      name,
      description,
      created: new Date().toISOString(),
      requests: [],
    }
    collections.push(newCollection)
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
    return newCollection
  } catch (error) {
    console.error("Failed to create collection:", error)
    return {} as RequestCollection
  }
}

export function getCollections(): RequestCollection[] {
  try {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(COLLECTIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to get collections:", error)
    return []
  }
}

export function addRequestToCollection(collectionId: string, requestId: string): void {
  try {
    const collections = getCollections()
    const collection = collections.find((c) => c.id === collectionId)
    if (collection && !collection.requests.includes(requestId)) {
      collection.requests.push(requestId)
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
    }
  } catch (error) {
    console.error("Failed to add request to collection:", error)
  }
}

export function deleteCollection(id: string): void {
  try {
    const collections = getCollections().filter((c) => c.id !== id)
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
  } catch (error) {
    console.error("Failed to delete collection:", error)
  }
}

// Saved Requests
export function saveRequest(request: Omit<StoredRequest, "id" | "timestamp">): StoredRequest {
  try {
    const requests = getSavedRequests()
    const newRequest: StoredRequest = {
      ...request,
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
    }
    requests.push(newRequest)
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
    return newRequest
  } catch (error) {
    console.error("Failed to save request:", error)
    return {} as StoredRequest
  }
}

export function getSavedRequests(): StoredRequest[] {
  try {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(REQUESTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to get saved requests:", error)
    return []
  }
}

export function deleteRequest(id: string): void {
  try {
    const requests = getSavedRequests().filter((r) => r.id !== id)
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  } catch (error) {
    console.error("Failed to delete request:", error)
  }
}
