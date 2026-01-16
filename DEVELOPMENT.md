# Development Guide

## Project Architecture

### Technology Stack

- **Frontend**: Vue 3 with TypeScript, Tailwind CSS
- **State Management**: Pinia with Vue Composables
- **Desktop Framework**: Tauri 2.0
- **Backend**: Rust
- **Cloud Sync**: 微信云托管 (WeChat Cloud Run)

### Directory Structure

```
d2run/
├── src/                       # Frontend source
│   ├── App.vue               # Main application component (router)
│   ├── main.ts               # Vue application entry point
│   ├── views/                # View components
│   │   ├── HomeView.vue      # Main menu
│   │   ├── SelectionView.vue # Scene selection
│   │   ├── TimerView.vue     # Timer and drop recording
│   │   ├── HistoryView.vue   # Run history and stats
│   │   ├── SettingsView.vue  # Shortcuts and theme settings
│   │   └── AboutView.vue     # About page
│   ├── composables/          # Vue composables for logic separation
│   │   ├── useTimer.ts       # Timer state and control
│   │   ├── useWindow.ts      # Window size management
│   │   ├── useNavigation.ts  # View navigation
│   │   ├── useTheme.ts       # Theme management
│   │   └── useCloudSync.ts   # Cloud synchronization
│   ├── stores/
│   │   └── runStore.ts       # Pinia state management (core business logic)
│   ├── shared/
│   │   ├── data.ts           # Game scenes and item definitions
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── locales.ts        # i18n translations (CN/EN)
│   │   ├── themes.ts         # Theme definitions
│   │   ├── constants.ts      # App constants
│   │   ├── utils.ts          # Utility functions
│   │   └── dashboardTemplate.ts  # HTML template for statistics
│   ├── cloud/                # Cloud sync implementation
│   │   ├── index.ts          # Cloud service export
│   │   ├── cloud.interface.ts # Cloud service interface
│   │   └── impl/             # Cloud implementations
│   └── assets/
│       └── main.css          # Global styles with Tailwind
├── src-tauri/                # Rust backend
│   ├── src/
│   │   ├── main.rs           # Tauri entry and window management
│   │   ├── commands.rs       # Tauri commands
│   │   ├── models.rs         # Data models
│   │   └── utils.rs          # Utility functions
│   ├── Cargo.toml           # Rust dependencies
│   └── tauri.conf.json      # Tauri configuration
├── package.json              # Node.js dependencies
├── tsconfig.json            # TypeScript configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Key Components

### Composables Architecture

The application uses Vue 3 composables for logic separation:

| Composable | Purpose |
|------------|---------|
| `useTimer` | Timer state (isRunning, elapsedTime) and control (start, stop, startTicker) |
| `useWindow` | Window size management per view |
| `useNavigation` | View state and navigation functions |
| `useTheme` | Theme state, switching, and DOM application |
| `useCloudSync` | Cloud authentication and data sync |

### runStore.ts (Pinia Store)

Core state management integrating all composables:

**Composable Integration:**
```typescript
const { isRunning, elapsedTime, start: startTimer, stop: stopTimer } = useTimer();
const { view, goHome: navGoHome, goSelection: navGoSelection } = useNavigation();
const themeComposable = useTheme();
const cloudSyncComposable = useCloudSync();
```

**Core State:**
- `currentScene`: Selected scene for current session
- `localRecords`: All recorded runs
- `currentDrops`: Drops in current run
- `sessionDrops`: Drops in current session
- `config`: Application configuration

**Computed Properties:**
- `historyRecords`: Merged local + cloud records
- `sceneStats`: Best/average time statistics
- `detailedStats`: Extended statistics (worst time, drop count, TZ count)
- `sceneBreakdown`: Per-scene analytics

### Views

All views are in `src/views/`:

| View | Purpose |
|------|---------|
| `HomeView` | Main menu with language toggle |
| `SelectionView` | Scene selection grid |
| `TimerView` | Active run with timer, TZ toggle, drop search |
| `HistoryView` | Historical data with filtering |
| `SettingsView` | Shortcuts, theme, cloud sync settings |
| `AboutView` | Developer info, GitHub, donation |

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
npm run tauri dev

# Build for production
npm run build
npm run tauri build
```

### Code Style Guidelines

**Vue Components:**
- Use `<script setup lang="ts">` syntax
- Prefer composition over options API
- Group imports logically
- Add JSDoc comments to complex functions

**TypeScript:**
- Always type function parameters and returns
- Use interfaces from `types.ts` for domain objects
- Avoid `any` type - use proper typing
- Use computed properties for derived state

**Composables:**
- Extract reusable logic to `composables/`
- Return reactive refs and functions
- Accept config refs as parameters when needed

### Internationalization

**Adding New Strings:**
1. Add to `I18N` object in `src/shared/locales.ts`
2. Provide both CN and EN translations
3. Use `store.t('KEY')` in templates

**Example:**
```typescript
// locales.ts
export const I18N = {
  CN: { NEW_KEY: '新功能' },
  EN: { NEW_KEY: 'New Feature' }
}

// In template
{{ store.t('NEW_KEY') }}
```

## Testing Checklist

### Manual Testing
- [ ] All views render correctly
- [ ] Window resize works smoothly
- [ ] Keyboard shortcuts function
- [ ] Run timing is accurate
- [ ] Drop search works
- [ ] Data persistence works
- [ ] Statistics calculate correctly
- [ ] Both languages display properly
- [ ] Theme switching works
- [ ] Cloud sync functions

### CI Checks
```bash
npm run lint        # ESLint check
npm run build       # TypeScript + Vite build
cargo check         # Rust check (in src-tauri/)
```

## Building for Release

```bash
# Build optimized bundle
npm run build

# Create Tauri executable
npm run tauri build

# Output location: src-tauri/target/release/bundle/
```

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tauri 2.0 Documentation](https://v2.tauri.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
