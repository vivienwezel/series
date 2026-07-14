const SHOW_CACHE_KEY = 'show-cache';
const SEASON_CACHE_KEY = 'season-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 200; // Maximum number of items to store per cache type

const showCacheMemory = new Map();
const seasonCacheMemory = new Map();

function getFromLocalStorage(key) {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

function setToLocalStorage(key, data, prefix) {
  if (typeof window === 'undefined') return;
  
  const item = JSON.stringify({
    data,
    timestamp: Date.now()
  });
  
  try {
    localStorage.setItem(key, item);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Clearing oldest items.');
      clearOldestCacheItems(prefix, 5);
      try {
        localStorage.setItem(key, item);
      } catch (retryError) {
        console.error('Failed to set item even after clearing cache:', retryError);
      }
    } else {
      console.error('Error writing to localStorage:', error);
    }
  }
}

function enforceCacheSize(prefix, maxSize) {
  if (typeof window === 'undefined') return;
  
  const items = getCacheItems(prefix);
  if (items.length > maxSize) {
    const itemsToRemove = items.length - maxSize;
    clearOldestCacheItems(prefix, itemsToRemove);
  }
}

function removeFromLocalStorage(key) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

function getCacheItems(prefix) {
  if (typeof window === 'undefined') return [];
  
  const items = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const { timestamp } = JSON.parse(value);
          items.push({ key, timestamp });
        }
      } catch (error) {
        console.error('Error parsing cache item:', error);
      }
    }
  }
  return items.sort((a, b) => a.timestamp - b.timestamp);
}

function clearOldestCacheItems(prefix, requiredSpace = 1) {
  if (typeof window === 'undefined') return;
  
  const items = getCacheItems(prefix);
  let cleared = 0;
  
  for (const item of items) {
    if (cleared >= requiredSpace) break;
    try {
      localStorage.removeItem(item.key);
      cleared++;
    } catch (error) {
      console.error('Error removing cache item:', error);
    }
  }
  
  console.log(`Cleared ${cleared} oldest items from ${prefix} cache`);
}

export function useShowCache() {
  const getShowDetails = async (showId) => {
    const idStr = String(showId);
    
    if (showCacheMemory.has(idStr)) {
      return showCacheMemory.get(idStr);
    }
    
    const localStorageKey = `${SHOW_CACHE_KEY}-${idStr}`;
    const cachedData = getFromLocalStorage(localStorageKey);
    
    if (cachedData) {
      showCacheMemory.set(idStr, cachedData);
      return cachedData;
    }
    
    const data = await $fetch('/api/fetchDetails/tvSeriesDetails', {
      method: 'GET',
      query: { id: showId }
    });
    
    showCacheMemory.set(idStr, data);
    enforceCacheSize(SHOW_CACHE_KEY, MAX_CACHE_SIZE);
    setToLocalStorage(localStorageKey, data, SHOW_CACHE_KEY);
    
    return data;
  };
  
  const getSeasonDetails = async (seriesId, seasonNumber) => {
    const key = `${seriesId}-${seasonNumber}`;
    
    if (seasonCacheMemory.has(key)) {
      return seasonCacheMemory.get(key);
    }
    
    const localStorageKey = `${SEASON_CACHE_KEY}-${key}`;
    const cachedData = getFromLocalStorage(localStorageKey);
    
    if (cachedData) {
      seasonCacheMemory.set(key, cachedData);
      return cachedData;
    }
    
    const data = await $fetch('/api/fetchDetails/tvSeasonDetails', {
      method: 'GET',
      query: {
        seriesId,
        seasonNumber
      }
    });
    
    seasonCacheMemory.set(key, data);
    enforceCacheSize(SEASON_CACHE_KEY, MAX_CACHE_SIZE);
    setToLocalStorage(localStorageKey, data, SEASON_CACHE_KEY);
    
    return data;
  };
  
  const invalidateShow = (showId) => {
    const idStr = String(showId);
    
    showCacheMemory.delete(idStr);
    removeFromLocalStorage(`${SHOW_CACHE_KEY}-${idStr}`);
    
    for (const [key] of seasonCacheMemory) {
      if (key.startsWith(`${idStr}-`)) {
        seasonCacheMemory.delete(key);
        removeFromLocalStorage(`${SEASON_CACHE_KEY}-${key}`);
      }
    }
  };
  
  const clearAllCache = () => {
    showCacheMemory.clear();
    seasonCacheMemory.clear();
    
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(SHOW_CACHE_KEY) || key.startsWith(SEASON_CACHE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    }
  };
  
  return {
    getShowDetails,
    getSeasonDetails,
    invalidateShow,
    clearAllCache
  };
}
