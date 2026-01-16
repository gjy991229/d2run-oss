# Cloud Sync Module

This directory contains the cloud synchronization functionality for D2Run.

## Architecture

```
src/cloud/
├── cloud.interface.ts   # Interface definitions (required)
├── cloud.stub.ts        # No-op implementation (open-source default)
├── index.ts             # Module entry point
├── README.md            # This file
└── impl/                # Full implementation (closed-source, gitignored)
    ├── auth.service.ts  # Authentication service
    ├── cloud.service.ts # Cloud sync service
    ├── converter.ts     # Data format converter
    └── cloud.impl.ts    # Implementation export
```

## How It Works

The module uses a **plugin architecture**:

1. **At runtime**, `index.ts` tries to load `impl/cloud.impl.ts`
2. **If successful**, the full cloud sync features are enabled
3. **If not found**, it falls back to `cloud.stub.ts` (no-op)

This ensures:
- Open-source builds compile and run without errors
- Cloud functionality is optional and modular
- Sensitive configurations are not exposed

## Implementing Your Own Cloud Service

To create your own cloud sync implementation:

1. Create the `impl/` directory
2. Implement `ICloudService` interface from `cloud.interface.ts`
3. Export as `CloudServiceImpl` from `impl/cloud.impl.ts`

Example:

```typescript
// impl/cloud.impl.ts
import { ICloudService, CloudState, SyncResult } from '../cloud.interface';

export class CloudServiceImpl implements ICloudService {
  isEnabled() { return true; }
  // ... implement all methods
}
```

## Security Notes

- The `impl/` directory is gitignored
- Never commit sensitive API keys or environment IDs
- Use environment variables or separate config files for secrets
