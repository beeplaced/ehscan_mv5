#!/bin/bash

# Determine the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the application root directory
APP_DIR="$(dirname "$SCRIPT_DIR")"

# Function to log messages with timestamps
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1" >> /tmp/log
}

# Log the directory to /tmp/log
log "Script directory: $SCRIPT_DIR"
log "Application directory: $APP_DIR"

# Change to the application root directory
pushd $APP_DIR > /dev/null

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
    log "node_modules directory not found. Installing npm packages..."
    pnpm install >> /tmp/log 2>&1

    # Check if pnpm install was successful
    if [ $? -ne 0 ]; then
        log "pnpm install failed"
        popd > /dev/null
        exit 1
    fi
else
    log "node_modules directory found. Skipping pnpm install."
fi

# Run the Vite application and log output and errors to /tmp/log
log "Starting the Vite application..."
pnpm vite >> /tmp/log 2>&1

# Check if the Vite application started successfully
if [ $? -ne 0 ]; then
    log "Vite application failed to start"
    popd > /dev/null
    exit 1
fi

# Return to the previous directory
popd > /dev/null
