/**
 * Cloud Sync Module Entry Point
 *
 * This module exports the cloud sync service.
 * Uses dynamic import to support both open-source (stub) and closed-source (impl) builds.
 */

import type { ICloudService } from './cloud.interface';
import { CloudServiceStub } from './cloud.stub';

// Start with stub, will be replaced if impl is available
let cloudService: ICloudService = new CloudServiceStub();
let initialized = false;

/**
 * Initialize cloud service - attempts to load impl, falls back to stub
 */
export async function initCloudService(): Promise<void> {
    if (initialized) return;
    initialized = true;

    try {
        // Dynamic import - will fail silently in open-source builds where impl/ is missing
        // @ts-ignore - This module may not exist in open-source builds
        const { CloudServiceImpl } = await import('./impl/cloud.impl');
        cloudService = new CloudServiceImpl();
        console.debug('[Cloud] Using full implementation');
    } catch {
        // Expected for open-source builds - stub is already set
        console.debug('[Cloud] Using stub implementation (open-source build)');
    }
}

/**
 * Get the cloud service instance
 */
export function getCloudService(): ICloudService {
    return cloudService;
}

// Export the service instance for direct access
export { cloudService };

// Re-export types
export * from './cloud.interface';

