#!/usr/bin/env bash
set -euo pipefail

registry_url='https://schema.origincloud.net/registry.json'

curl -fsSL "$registry_url" \
  | jq -r 'keys[] as $k | "https://schema.origincloud.net/oobi/\($k)"' \
  | while IFS= read -r schema; do
      dir="${schema##*/}"
      mkdir -p "$dir"
      curl -fsSL "$schema" -o "$dir/index.json"
    done
