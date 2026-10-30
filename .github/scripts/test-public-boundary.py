#!/usr/bin/env python3
"""Negative tests: leak, legal drift and silent additions must fail closed."""
import json
import subprocess
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

guard = Path(__file__).with_name("public-boundary.py")

def run(root, lock):
    return subprocess.run([sys.executable, str(guard), str(root), "--lock", str(lock)],
                          capture_output=True, text=True)

with TemporaryDirectory() as d:
    tmp = Path(d)
    root = tmp / "public"
    root.mkdir()
    (root / "licenses").mkdir()
    readme = root / "README.md"
    notice = root / "licenses" / "THIRD-PARTY.txt"
    readme.write_text("# CooTrio released\n")
    notice.write_text("Reviewed third party notice\n")
    blob = subprocess.check_output(["git", "hash-object", str(notice)], text=True).strip()
    lock = tmp / "legal-lock.json"
    lock.write_text(json.dumps({"schema": 1, "license_files": {"licenses/THIRD-PARTY.txt": blob}}))
    m = {"version": "v1", "models": {}, "files": [
         {"path": "README.md"}, {"path": "licenses/THIRD-PARTY.txt"}]}
    manifest = root / "release-manifest.json"
    def save():
        manifest.write_text(json.dumps(m))
    def good():
        result=run(root, lock)
        assert result.returncode == 0, result.stdout + result.stderr
    def bad(message):
        result=run(root, lock)
        assert result.returncode != 0 and message in result.stdout + result.stderr, result.stdout + result.stderr
    save()
    good()
    (root / "LICENSE").write_text("Added a project-wide MIT license")
    bad("UNAPPROVED LEGAL ADDITION")
    (root / "LICENSE").unlink()
    good()
    notice.write_text("Silently edited license")
    bad("UNAPPROVED LEGAL CHANGE")
    notice.write_text("Reviewed third party notice\n")
    good()
    (root / "research-notes.txt").write_text("Private notes")
    bad("UNLISTED PUBLIC FILE")
    (root / "research-notes.txt").unlink()
    readme.write_text("https://github.com/eltnegcellist/CooTrio-Web-Dev\n")
    bad("PRIVATE REFERENCE")
    readme.write_text("CooTrio-Web-Dev is the source\\n")
    bad("PRIVATE REFERENCE")
    readme.write_text("# CooTrio released\n")
    good()
    m["source_commit"] = "private-dev-sha"
    save()
    bad("Private/internal release metadata")
    del m["source_commit"]
    save()
    good()
    notice.unlink()
    bad("REQUIRED NOTICE MISSING")
print("Release boundary negative tests passed.")
