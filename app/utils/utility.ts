import { useCallback } from "react";

export const useURLFormatter = () => {
    const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
    const toAbsoluteUrl = useCallback((u?: string | null) => {
        if (!u || typeof u !== 'string') return null;
        if (u.startsWith('http')) return u;
        if (apiOrigin) return `${apiOrigin}${u.startsWith('/') ? '' : '/'}${u}`;
        return u.startsWith('/') ? u : `/${u}`;
    }, [apiOrigin]);

    return { toAbsoluteUrl };
}