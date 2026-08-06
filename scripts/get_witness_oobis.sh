#!/usr/bin/env bash
set -euo pipefail

while read -u 3 -r oobi && read -u 4 -r oobi_dir; do
  mkdir -p "$oobi_dir"
  curl -fsSL --retry 3 --retry-delay 1 -o "$oobi_dir/index.json" "$oobi"
done 3<witness-urls-from-witness-version-tracker 4< <(sed 's?.*/\(.*\)/controller?\1?' witness-urls-from-witness-version-tracker)
