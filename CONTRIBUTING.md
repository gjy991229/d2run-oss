# Contributing to D2Run Lite

Thank you for your interest in contributing to D2Run Lite! We welcome contributions from the community to help make this the best speedrun timer for Diablo II.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/d2run.git
   cd d2run
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

### Frontend (Vue 3 + TypeScript)
- Run the development server: `npm run dev`
- The code is located in `src/`.

### Backend (Tauri + Rust)
- Ensure you have Rust installed.
- Run the Tauri development app: `npm run tauri dev`
- The code is located in `src-tauri/`.

## Code Style

- **TypeScript/Vue**: We use ESLint and Prettier. Please run `npm run lint` before committing.
- **Rust**: Use `cargo fmt` to format your Rust code.

## Submitting a Pull Request

1. Create a new branch for your feature or fix: `git checkout -b feature/my-new-feature`
2. Commit your changes: `git commit -am 'Add some feature'`
3. Push to the branch: `git push origin feature/my-new-feature`
4. Submit a Pull Request on GitHub.

## Reporting Issues

If you find a bug or have a suggestion, please open an issue on GitHub.
