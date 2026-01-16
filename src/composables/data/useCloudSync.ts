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

import { reactive, ref, shallowRef } from 'vue';
import type { AppConfig, HistoryFilter, RunRecord } from '../../shared/types';
import type { CloudState } from '../../cloud/cloud.interface';
import { initCloudService, cloudService } from '../../cloud';

// Define the return type interface
type CloudSyncReturn = ReturnType<typeof createFallbackInternal>;
export type UseCloudSyncReturn = CloudSyncReturn;

// 1. SHARED STATE (Single Source of Truth)
// Created once and shared between Fallback, Impl, and UI
const sharedCloudState = reactive<CloudState>({
    isLoggedIn: false,
    isLoading: false,
    isSyncing: false,
    userInfo: null,
    qrCodeUrl: ''
});
const sharedCloudRecords = ref<RunRecord[]>([]);
const sharedSyncCooldownRemaining = ref(0);

// Package state for passing to implementations
const sharedStateBundle = {
    cloudState: sharedCloudState,
    cloudRecords: sharedCloudRecords,
    syncCooldownRemaining: sharedSyncCooldownRemaining
};

// 2. ACTIVE IMPLEMENTATION
// Holds the object that contains the actual method logic
// Initialize with null activeImplementation, will be set to fallback in createFallbackInternal
const activeImplementation = shallowRef<any>(null);

let initPromise: Promise<void> | null = null;
let initialized = false;

/**
 * Initialize cloud service lazily (called on first use)
 */
async function ensureInitialized(): Promise<void> {
    if (initialized) return;
    if (initPromise) return initPromise;

    // Set initial fallback if not set
    if (!activeImplementation.value) {
        activeImplementation.value = createFallbackInternal();
    }

    initPromise = (async () => {
        try {
            // Initialize cloud service first (loads impl or falls back to stub)
            await initCloudService();
            // @ts-ignore - dynamic import for optional module
            const module = await import('../../cloud/impl/useCloudSync');

            // Load and instantiate the implementation, PASSING SHARED STATE
            // This is the critical fix: Impl will use our existing reactive objects
            const implInstance = module.useCloudSyncImpl(sharedStateBundle);

            // Switch active implementation
            console.log('[Cloud Facade] Swapping to implementation instance with shared state');
            activeImplementation.value = implInstance;

            console.debug('[Cloud] Implementation loaded successfully.');
        } catch (e) {
            // Impl module missing - expected for offline builds
            console.debug('[Cloud] Private implementation not found, staying with fallback.', e);
        }
        initialized = true;
    })();

    return initPromise;
}

/**
 * Create fallback implementation for open-source builds (internal)
 */
function createFallbackInternal() {
    return {
        // State (not used directly via methods, but kept for structural compatibility)
        cloudState: sharedCloudState,
        cloudRecords: sharedCloudRecords,
        syncCooldownRemaining: sharedSyncCooldownRemaining,

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
        // Delegate to cloudService to correctly detect after async init
        isCloudEnabled: () => cloudService.isEnabled(),
        getCloudRecords: async (_filter: HistoryFilter) => [] as RunRecord[]
    };
}

// Trigger initialization early
if (!activeImplementation.value) {
    activeImplementation.value = createFallbackInternal();
}
ensureInitialized();

/**
 * Main Composable - Returns shared state + proxied methods
 */
export function useCloudSync(): CloudSyncReturn {
    // Return a stable object
    // State properties -> Return the SHARED reactive objects directly (stable references)
    // Methods -> Proxy to activeImplementation.value (dynamic execution)
    return {
        // State is STABLE and SHARED = Reactivity works guaranteed
        cloudState: sharedCloudState,
        cloudRecords: sharedCloudRecords,
        syncCooldownRemaining: sharedSyncCooldownRemaining,

        // Methods forward to the current implementation
        calcCooldown: (...args) => activeImplementation.value!.calcCooldown(...args),
        clearAuthFlow: (...args) => activeImplementation.value!.clearAuthFlow(...args),
        checkCloudLogin: (...args) => activeImplementation.value!.checkCloudLogin(...args),
        startCloudLogin: (...args) => activeImplementation.value!.startCloudLogin(...args),
        logoutCloud: (...args) => activeImplementation.value!.logoutCloud(...args),
        syncData: (...args) => activeImplementation.value!.syncData(...args),
        isCloudEnabled: () => activeImplementation.value!.isCloudEnabled(),
        getCloudRecords: (...args) => activeImplementation.value!.getCloudRecords(...args)
    };
}

/**
 * Ensure cloud is initialized before use (for critical operations)
 * Call this before getCloudRecords if you need to guarantee impl is loaded
 */
export async function ensureCloudReady(): Promise<void> {
    await ensureInitialized();
}
