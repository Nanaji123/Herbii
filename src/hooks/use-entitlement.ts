import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { isHerbFree } from '@/lib/plans';
import { api } from '../../convex/_generated/api';

const MAX_TIMEOUT = 2 ** 31 - 1;

/** What the signed-in user is allowed to do. `loading` is true until the first answer arrives. */
export function useEntitlement() {
  const status = useQuery(api.subscription.status);
  const [now, setNow] = useState(() => Date.now());
  const expiresAt = status?.expiresAt ?? null;

  // The server only re-sends status when data changes, so re-check locally the moment a plan runs out.
  useEffect(() => {
    if (!expiresAt) return;
    const wait = expiresAt - Date.now();
    if (wait <= 0) return;
    const t = setTimeout(() => setNow(Date.now()), Math.min(wait + 500, MAX_TIMEOUT));
    return () => clearTimeout(t);
  }, [expiresAt, now]);

  const active = !!status?.isPro && (expiresAt === null || expiresAt > now);
  return {
    loading: status === undefined,
    isPro: active,
    plan: active ? (status?.plan ?? null) : null,
    trialing: active && !!status?.trialing,
    scansLeft: status?.scansLeft ?? 0,
    scansLimit: status?.scansLimit ?? 5,
    expiresAt,
  };
}

/** Opens a herb, or the paywall if it is locked for this user. */
export function useOpenHerb() {
  const { isPro, loading } = useEntitlement();
  return useCallback(
    (slug: string) => {
      if (isPro || loading || isHerbFree(slug)) router.push({ pathname: '/herb/[slug]', params: { slug } });
      else router.push('/paywall');
    },
    [isPro, loading],
  );
}
