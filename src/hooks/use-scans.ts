import { useConvex, useQuery } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '../../convex/_generated/api';

export type ScanItem = FunctionReturnType<typeof api.scans.list>[number];

/**
 * The signed-in user's scans, newest first.
 *
 * Combines the live Convex subscription with an explicit fetch every time the screen gains focus
 * (and on demand via `refresh`), so a scan you just made is always there when you open the tab,
 * even if a live update was missed while the screen was in the background.
 */
export function useScans() {
  const client = useConvex();
  const live = useQuery(api.scans.list);
  const [scans, setScans] = useState<ScanItem[] | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Whatever arrives last wins: both sources are the server's truth at slightly different moments.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (live !== undefined) setScans(live);
  }, [live]);

  const fetchNow = useCallback(async () => {
    try {
      const fresh = await client.query(api.scans.list, {});
      if (mounted.current) setScans(fresh);
    } catch {
      // keep whatever we have; the live subscription may still deliver
    }
  }, [client]);

  useFocusEffect(
    useCallback(() => {
      fetchNow();
    }, [fetchNow]),
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNow();
    if (mounted.current) setRefreshing(false);
  }, [fetchNow]);

  return { scans, refresh, refreshing };
}
