/**
 * Cloud Sync Stub Implementation
 *
 * This is the default implementation used when the full cloud sync
 * module is not available (e.g., open-source builds).
 *
 * All methods return no-op or empty results to ensure the application
 * works correctly without cloud functionality.
 */

import type {
    ICloudService,
    CloudState,
    CloudUserInfo,
    SyncResult
} from './cloud.interface';
import type { RunRecord, AppConfig, HistoryFilter } from '@/shared/types';

/**
 * Stub implementation of cloud service - provides no actual cloud functionality
 */
export class CloudServiceStub implements ICloudService {
    /**
     * Cloud sync is not available in this build
     */
    isEnabled(): boolean {
        return false;
    }

    /**
     * Returns default disabled state
     */
    initState(): CloudState {
        return {
            isLoggedIn: false,
            userInfo: null,
            qrCodeUrl: '',
            isLoading: false,
            isSyncing: false
        };
    }

    /**
     * Login is not available - throws error
     */
    async startLogin(
        _onSuccess: (userInfo: CloudUserInfo) => void,
        onError: (err: Error) => void
    ): Promise<string> {
        const error = new Error('Cloud sync is not available in this build');
        onError(error);
        throw error;
    }

    /**
     * No-op logout
     */
    async logout(): Promise<void> {
        // No-op
    }

    /**
     * Sync is not available - returns failure
     */
    async syncData(
        _localRuns: RunRecord[],
        _config: AppConfig,
        _openid: string
    ): Promise<SyncResult> {
        return {
            success: false,
            message: 'Cloud sync is not available in this build'
        };
    }

    /**
     * Returns empty array - no cloud records
     */
    async getCloudRecords(_filter?: HistoryFilter): Promise<RunRecord[]> {
        return [];
    }

    /**
     * No-op save
     */
    async saveCloudCache(_records: RunRecord[]): Promise<void> {
        // No-op
    }

    /**
     * No-op stop polling
     */
    stopPolling(): void {
        // No-op
    }

    /**
     * Always returns false - not logged in
     */
    checkLoginStatus(_config: AppConfig | null): boolean {
        return false;
    }

    /**
     * Always returns null - no user info
     */
    getPersistedUserInfo(_config: AppConfig | null): CloudUserInfo | null {
        return null;
    }

    sanitizeUserInfo(userInfo: any): any {
        return userInfo;
    }

    desanitizeUserInfo(userInfo: any): any {
        return userInfo;
    }
}
