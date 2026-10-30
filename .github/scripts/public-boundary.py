#!/usr/bin/env python3
"""Fail-closed Public release boundary: provenance, legal material and file manifest.

The legal lock is reviewed separately from runtime manifests. A model license
and all necessary third-party notices must remain available; arbitrary new
project licenses, copies, edits and attribution changes are rejected.
"""
import argparse
import json
import re
import subprocess
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument("directory", type=Path, help="Public repository root or export directory")
p.add_argument("--lock", type=Path, help="Reviewed legal lock; defaults to the caller's project")
args = p.parse_args()
root = args.directory.resolve()
default_lock = Path(__file__).resolve().parents[1] / "policy" / "legal-lock.json"
if not default_lock.exists():
    default_lock = Path(__file__).with_name("legal-lock.json")
lock_path = args.lock or default_lock
lock = json.loads(lock_path.read_text(encoding="utf-8"))
if lock.get("schema") != 1 or not isinstance(lock.get("license_files"), dict):
    raise SystemExit("Unreviewed or invalid legal lock")
errors = []

def is_legal(name):
    parts = Path(name).parts
    base = parts[-1]
    return (
        "licenses" in (x.lower() for x in parts)
        or bool(re.match(r"(?i)^(?:license|licence|copying|notice|attribution|model-card|third.?party.?notices)", base))
        or base.lower() == "thirdpartynotices.txt"
        or name in {"DEPENDENCY_AUDIT.md", "THIRD_PARTY_NOTICES.md", "licenses.html"}
    )

def blob_sha(path):
    return subprocess.check_output(["git", "hash-object", str(path)], text=True).strip()

files = {p.relative_to(root).as_posix(): p for p in root.rglob("*") if p.is_file() and ".git" not in p.relative_to(root).parts}
actual_legal = {name: blob_sha(file) for name, file in files.items() if is_legal(name)}
expected_legal = lock["license_files"]
if actual_legal != expected_legal:
    for name in sorted(set(actual_legal) | set(expected_legal)):
        if name not in expected_legal:
            errors.append(f"UNAPPROVED LEGAL ADDITION: {name}")
        elif name not in actual_legal:
            errors.append(f"REQUIRED NOTICE MISSING: {name}")
        elif actual_legal[name] != expected_legal[name]:
            errors.append(f"UNAPPROVED LEGAL CHANGE: {name}")
# The release manifest is the exact file allowlist, not a loose description.
manifest_path = root / "release-manifest.json"
if not manifest_path.is_file():
    errors.append("release-manifest.json missing")
else:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    allowed_top = {"version", "models", "files"}
    if set(manifest) != allowed_top:
        errors.append("Private/internal release metadata in public manifest: " + str(sorted(set(manifest) ^ allowed_top)))
    entries = manifest.get("files", [])
    if not isinstance(entries, list):
        entries = []
        errors.append("Manifest files must be a list")
    paths = [item.get("path", "") for item in entries if isinstance(item, dict)]
    if len(paths) != len(entries) or len(paths) != len(set(paths)):
        errors.append("Duplicate/broken file manifest paths")
    expected_files = set(paths)
    actual_files = {name for name in files if not name.startswith(".github/") and name != "release-manifest.json"}
    for extra in sorted(actual_files - expected_files):
        errors.append("UNLISTED PUBLIC FILE: " + extra)
    for missing in sorted(expected_files - actual_files):
        errors.append("MANIFEST FILE MISSING: " + missing)
    for name in expected_files:
        if (name.startswith("/") or ".." in Path(name).parts or name.startswith(".github/") or name == "release-manifest.json"):
            errors.append("INVALID MANIFEST PATH: " + name)
# Reject URLs to non-public repos, preview environments or internal paths;
# model cards and third-party notices may describe historical research and
# are intentionally preserved rather than blanket-matching 'development'.
private_patterns = [
    r"(?i)\bcootrio-(?:web|android)-(?:dev|legacy)\b",
    r"(?i)https?://github\.com/[^/\s]+/[^/\s]*(?:-dev|-legacy)(?:[/?#\s]|$)",
    r"(?i)https?://[^/\s]+\.pages\.dev(?:[/?#\s]|$)",
    r"(?i)https?://github\.com/[^/\s]+/Web_EmmaLocal_English_for_babies",
    r"/Users/[^/\s]+/",
    r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
    r"github_pat_[A-Za-z0-9_]{30,}",
    r"gh[pousr]_[A-Za-z0-9]{30,}",
]
for name, path in files.items():
    if name.startswith(".github/") or not name.endswith((".md", ".txt", ".json", ".js", ".html", ".css", ".webmanifest")):
        continue
    data = path.read_text(encoding="utf-8", errors="replace")
    for pat in private_patterns:
        if re.search(pat, data):
            errors.append(f"PRIVATE REFERENCE or SECRET: {name}: {pat}")
    if name == "README.md":
        for pat in [
            r"(?i)developer experiment",
            r"(?i)development (?:repository|branch|preview|workflow)",
            r"開発者向けのマイク保持実験",
            r"開発(?:版|用)リポジトリ",
        ]:
            if re.search(pat, data):
                errors.append(f"DEVELOPMENT CONTENT IN PUBLIC README: {pat}")
# Prevent a new project-wide license or implicit relicensing claim.
for name in files:
    if "/" not in name and re.match(r"(?i)^(license|licence|copying)(?:$|[._-])", name):
        errors.append("UNAPPROVED PROJECT LICENSE: " + name)
if errors:
    print("\n".join(errors))
    raise SystemExit(f"Public release boundary rejected {len(errors)} issue(s)")
print(f"Public release boundary passed: {len(files)} files; {len(expected_legal)} pinned legal files.")
