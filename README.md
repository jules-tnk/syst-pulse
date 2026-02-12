# SystPulse

A modern system monitor built with Tauri and React.

## Features

- Real-time CPU usage monitoring
- Memory usage tracking with total/used display
- Disk space monitoring
- Beautiful, responsive UI with progress bars
- Updates every second
- Cross-platform (Windows, macOS, Linux)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Rust + Tauri
- **System Info**: sysinfo crate
- **Styling**: Modern CSS with gradients and animations

## Development

### Prerequisites

- Rust (latest stable)
- Node.js (v16+)
- Cargo

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/jules-tnk/syst-pulse.git
   cd syst-pulse
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run tauri dev
   ```

### Building

```bash
npm run tauri build
```

The built executables will be in `src-tauri/target/release/bundle/`.

## Usage

1. Launch SystPulse
2. Monitor your system's vital statistics:
   - CPU usage percentage
   - Memory usage with total/used amounts
   - Disk space usage
3. Stats update automatically every second

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Tauri + React by Kibalo Jules Tinaka