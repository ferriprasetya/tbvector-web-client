#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Define the host and port for the database.
# We get these from environment variables set in docker-compose.yml, with defaults.
MONGO_HOST=${MONGO_HOST:-tb_mongo}
MONGO_PORT=${MONGO_PORT:-27017}

echo "Waiting for database at $MONGO_HOST:$MONGO_PORT..."

# Use netcat (nc) to check if the port is open.
# The loop will continue until 'nc -z' returns a success code (0).
while ! nc -z $MONGO_HOST $MONGO_PORT; do
  # Wait for 1 second before trying again
  sleep 1
done

echo "Database is up - executing command"

# Execute the main command passed to the script (e.g., "pnpm", "dev")
exec "$@"
