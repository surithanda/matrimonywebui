import { useCallback } from "react";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";

export const useURLFormatter = () => {
    const toAbsoluteUrl = useCallback((u?: string | null) => {
        return envToAbsoluteUrl(u);
    }, []);

    return { toAbsoluteUrl };
}