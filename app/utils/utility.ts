import { useCallback } from "react";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";
import { normalizePhotoUrl } from "@/app/utils/photoUrl.util";

export const useURLFormatter = () => {
    const toAbsoluteUrl = useCallback((u?: string | null) => {
        return normalizePhotoUrl(u); // Use the new photo URL utility
    }, []);

    return { toAbsoluteUrl };
}