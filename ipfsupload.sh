#!/bin/bash

# IPFS API endpoint
IPFS_API="http://localhost:5001"  # Change this if your IPFS API is hosted elsewhere

# File to upload
FILE_PATH="$1"

if [[ -z "$FILE_PATH" ]]; then
  echo "Usage: $0 <path_to_file>"
  exit 1
fi

# Checking if the file exists
if [[ ! -f "$FILE_PATH" ]]; then
  echo "Error: File does not exist."
  exit 1
fi

# Using the IPFS HTTP API to add a file
RESPONSE=$(curl -s -X POST -F file=@"$FILE_PATH" "$IPFS_API/api/v0/add")

# Extracting the IPFS hash from the response
IPFS_HASH=$(echo $RESPONSE | jq -r .Hash)

if [[ -n "$IPFS_HASH" ]]; then
  echo "File successfully uploaded to IPFS"
  echo "IPFS Hash: $IPFS_HASH"
else
  echo "Failed to upload the file to IPFS"
fi
