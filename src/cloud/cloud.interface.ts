/**
 * Cloud Sync Service Interface
 *
 * This module defines the interface for cloud synchronization services.
 * Implementations should follow this interface to ensure compatibility.
 */

import type { RunRecord, AppConfig, HistoryFilter } from '@/shared/types';

/**
 * Cloud authentication and sync state
 */
export interface CloudState {
    /** Whether user is logged in */
    isLoggedIn: boolean;
    /** User information from cloud provider */
    userInfo: CloudUserInfo | null;
    /** QR code data URL for login */
    qrCodeUrl: string;
    /** Whether login flow is in progress */
    isLoading: boolean;
    /** Whether sync operation is in progress */
    isSyncing: boolean;
}

/**
 * User information from cloud provider
 */
export interface CloudUserInfo {
    /** User's unique identifier */
    uid: string;
    /** User's open ID (for cloud functions) */
    openid: string;
    /** User's display name */
    nickName: string;
    /** User's avatar URL */
    avatarUrl?: string;
}

/**
 * Result of a sync operation
 */
export interface SyncResult {
    /** Whether sync completed successfully */
    success: boolean;
    /** Human-readable message */
    message: string;
    /** Number of records uploaded */
    uploadedCount?: number;
    /** Number of records downloaded */
    downloadedCount?: number;
}

/**
 * Cloud service interface that all implementations must follow
 */
export interface ICloudService {
    /**
     * Check if cloud sync is available
     * @returns true if cloud service is properly configured
     */
    isEnabled(): boolean;

    /**
     * Get initial cloud state
     * @returns Default CloudState object
     */
    initState(): CloudState;

    /**
     * Start the login flow (e.g., generate QR code)
     * @param onSuccess Callback with user info when login succeeds
     * @param onError Callback with error when login fails
     * @returns QR code data URL for scanning
     */
    startLogin(
        onSuccess: (userInfo: CloudUserInfo) => void,
        onError: (err: Error) => void
    ): Promise<string>;

    /**
     * Log out from cloud service
     */
    logout(): Promise<void>;

    /**
     * Sync local data with cloud
     * @param localRuns Local run records to upload
     * @param config App configuration (for sync timestamp)
     * @param openid User's openid for cloud operations
     * @returns Sync result with status and counts
     */
    syncData(
        localRuns: RunRecord[],
        config: AppConfig,
        openid: string
    ): Promise<SyncResult>;

    /**
     * Get cached cloud records
     * @param filter Optional filter for records
     * @returns Array of cloud run records
     */
    getCloudRecords(filter?: HistoryFilter): Promise<RunRecord[]>;

    /**
     * Save cloud records to local cache
     * @param records Records to cache
     */
    saveCloudCache(records: RunRecord[]): Promise<void>;

    /**
     * Stop any ongoing polling (e.g., for login)
     */
    stopPolling(): void;

    /**
     * Check current login status from persisted state
     * @param config App config containing saved user info
     * @returns Whether user is logged in
     */
    checkLoginStatus(config: AppConfig | null): boolean;

    /**
     * Get persisted user info from config
     * @param config App config
     * @returns User info or null
     */
    getPersistedUserInfo(config: AppConfig | null): CloudUserInfo | null;

    /**
     * Sanitize user info for storage/transfer
     * @param userInfo Raw user info
     */
    sanitizeUserInfo(userInfo: any): any;

    /**
     * Restore user info from sanitized format
     * @param userInfo Sanitized user info
     */
    desanitizeUserInfo(userInfo: any): any;
}
