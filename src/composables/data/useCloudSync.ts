/**
 * Cloud synchronization composable (Facade)
 *
 * Provides the public interface for cloud synchronization features.
 * Delegates to the private implementation (impl/useCloudSync.ts) which contains
 * the actual cloud service logic.
 *
 * If the private implementation is not found (offline build), this module
 * provides a safe no-op fallback to prevent crashes.
 */

import { reactive, ref } from 'vue';
import type { AppConfig, HistoryFilter, RunRecord } from '../../shared/types';
import type { CloudState } from '../../cloud/cloud.interface';
import { initCloudService } from '../../cloud';

// Lazy-loaded implementation cache
let useCloudSyncImpl: (() => ReturnType<typeof createFallbackInternal>) | null = null;
let initPromise: Promise<void> | null = null;
let initialized = false;

// Singleton instances to ensure state is shared across all useCloudSync() calls
let cachedImplInstance: ReturnType<typeof createFallbackInternal> | null = null;
let cachedFallbackInstance: ReturnType<typeof createFallbackInternal> | null = null;

/**
 * Initialize cloud service lazily (called on first use)
 */
async function ensureInitialized(): Promise<void> {
    if (initialized) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            // Initialize cloud service first (loads impl or falls back to stub)
            await initCloudService();
            // @ts-ignore - dynamic import for optional module
            const module = await import('../../cloud/impl/useCloudSync');
            useCloudSyncImpl = module.useCloudSyncImpl;
            console.debug('[Cloud] Implementation loaded successfully.');
        } catch {
            // Impl module missing - expected for offline builds
            console.debug('[Cloud] Private implementation not found, using fallback.');
        }
        initialized = true;
    })();

    return initPromise;
}

/**
 * Create fallback implementation for open-source builds (internal)
 */
function createFallbackInternal() {
    const cloudState = reactive<CloudState>({
        isLoggedIn: false,
        isLoading: false,
        isSyncing: false,
        userInfo: null,
        qrCodeUrl: ''
    });

    const cloudRecords = ref<RunRecord[]>([]);
    const syncCooldownRemaining = ref(0);

    return {
        // State
        cloudState,
        cloudRecords,
        syncCooldownRemaining,

        // Methods (No-ops)
        calcCooldown: (_config: AppConfig | null) => { },
        clearAuthFlow: () => { },
        checkCloudLogin: (_config: AppConfig | null) => { },
        startCloudLogin: async (_config: { value: AppConfig | null }, _t: (key: string) => string) => {
            console.warn('Cloud features are not available in this build.');
        },
        logoutCloud: async (_config: { value: AppConfig | null }, _t: (key: string) => string) => { },
        syncData: async (
            _config: { value: AppConfig | null },
            _filter: { value: HistoryFilter },
            _t: (key: string) => string,
            _onSuccess: () => Promise<void>
        ) => { },
        isCloudEnabled: () => false,
        getCloudRecords: async (_filter: HistoryFilter) => [] as RunRecord[]
    };
}

/** Return type for useCloudSync composable */
export type UseCloudSyncReturn = ReturnType<typeof createFallbackInternal>;

// Trigger initialization early but don't block
ensureInitialized();

/**
 * Get or create singleton instance
 */
function getOrCreateInstance(): UseCloudSyncReturn {
    // If impl was loaded, use cached impl instance
    if (useCloudSyncImpl) {
        if (!cachedImplInstance) {
            cachedImplInstance = useCloudSyncImpl();
        }
        return cachedImplInstance;
    }

    // Return cached fallback (create if needed)
    if (!cachedFallbackInstance) {
        cachedFallbackInstance = createFallbackInternal();
    }
    return cachedFallbackInstance;
}

export function useCloudSync(): UseCloudSyncReturn {
    return getOrCreateInstance();
}

/**
 * Ensure cloud is initialized before use (for critical operations)
 * Call this before getCloudRecords if you need to guarantee impl is loaded
 */
export async function ensureCloudReady(): Promise<void> {
    await ensureInitialized();
}
