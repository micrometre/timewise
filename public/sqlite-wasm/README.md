# SQLite WASM Files

## Setup Instructions

To enable persistent client-side storage using SQLite WASM with OPFS, you need to copy the SQLite WASM files to this directory.

### Option 1: Copy from your cashier project

```bash
cp -r ~/repos/cashier/public/sqlite-wasm/jswasm ./public/sqlite-wasm/
```

### Option 2: Download from SQLite.org

1. Download the latest SQLite WASM build from https://sqlite.org/download.html
2. Extract the files
3. Copy the `jswasm` directory contents to `./public/sqlite-wasm/jswasm/`

### Required Files

The following files should be in `./public/sqlite-wasm/jswasm/`:

- `sqlite3-worker1-promiser.js` - Main worker promiser API
- `sqlite3-worker1.js` - Worker implementation  
- `sqlite3-opfs-async-proxy.js` - OPFS async proxy
- `sqlite3.js` - Core SQLite library
- `sqlite3.wasm` - WebAssembly binary

### Verification

After copying the files, your directory structure should look like:

```
public/
└── sqlite-wasm/
    └── jswasm/
        ├── sqlite3-worker1-promiser.js
        ├── sqlite3-worker1.js
        ├── sqlite3-opfs-async-proxy.js
        ├── sqlite3.js
        └── sqlite3.wasm
```

## Browser Requirements

- Chrome 86+
- Edge 86+
- Firefox 111+
- Safari 15.2+

All modern browsers support OPFS (Origin Private File System) for persistent storage.

## How it Works

TimeWise uses SQLite WASM with OPFS to provide:

- **Persistent Storage**: Data survives browser restarts
- **Full SQL**: Complete SQLite functionality in the browser
- **No Server**: All data stays on your device
- **High Performance**: Near-native database performance
- **Large Capacity**: Much more storage than localStorage

Your timesheet data is stored in `timewise.sqlite3` within the browser's origin-private file system.
