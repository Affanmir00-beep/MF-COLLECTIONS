import { useState, useEffect, useCallback } from 'react';

export function useCursorPagination(fetchFn, limit = 10) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // We need to keep track of current filters/sort to refetch properly
  const [currentOptions, setCurrentOptions] = useState({});

  const loadMore = useCallback(async (options = currentOptions, reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true);
    
    try {
      const currentCursor = reset ? null : cursor;
      const res = await fetchFn({ ...options, cursor: currentCursor, limit });
      
      setItems(prev => reset ? res.items : [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(Boolean(res.nextCursor));
      setCurrentOptions(options);
    } catch (err) {
      console.error("Failed to load more items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading, fetchFn, limit, currentOptions]);

  const resetAndLoad = useCallback((newOptions) => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    loadMore(newOptions, true);
  }, [loadMore]);

  return {
    items,
    hasMore,
    isLoading,
    loadMore,
    resetAndLoad
  };
}
