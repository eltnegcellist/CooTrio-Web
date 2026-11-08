#!/usr/bin/env python3
"""Deploy the exact approved CooTrio release on Cloudflare Pages.

Run: python3 .github/scripts/build-cloudflare-pages.py
Cloudflare Pages output directory: _site
"""
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
output = root / "_site"
if output.is_symlink():
    raise SystemExit("Refusing to follow a symlinked output directory")
if output.exists():
    shutil.rmtree(output)

# The same fail-closed release, privacy and legal gates used for GitHub Pages.
for script in (
    ".github/scripts/verify-release.py",
    ".github/scripts/public-boundary.py",
    ".github/scripts/test-public-boundary.py",
):
    subprocess.run([sys.executable, script, "."], cwd=root, check=True)

manifest = json.loads((root / "release-manifest.json").read_text(encoding="utf-8"))
output.mkdir()
count = 0
for entry in manifest["files"]:
    relative = Path(entry["path"])
    if relative.is_absolute() or ".." in relative.parts or ".github" in relative.parts:
        raise SystemExit(f"Unsafe manifest path: {relative}")
    source = root / relative
    if not source.is_file() or source.is_symlink():
        raise SystemExit(f"Release file missing or symlinked: {relative}")
    data = source.read_bytes()
    if len(data) != entry["bytes"] or hashlib.sha256(data).hexdigest() != entry["sha256"]:
        raise SystemExit(f"Release hash mismatch: {relative}")
    if len(data) > 25 * 1024 * 1024:
        raise SystemExit(f"File too large for Pages: {relative}")
    target = output / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    count += 1

shutil.copyfile(root / "release-manifest.json", output / "release-manifest.json")
if count + 1 > 20000:
    raise SystemExit(f"Too many static files for Pages: {count + 1}")
print(f"Cloudflare Pages artifact built: {count + 1} manifest-approved files in _site")
