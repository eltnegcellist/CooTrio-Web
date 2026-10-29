#!/usr/bin/env python3
"""Validate a release directory, static dependencies, model/voice integrity and leaks."""
import argparse,hashlib,json,re,subprocess,urllib.parse
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('directory',type=Path);a=p.parse_args();root=a.directory.resolve()
files={x.relative_to(root).as_posix():x for x in root.rglob('*') if x.is_file() and '.git' not in x.relative_to(root).parts}
errors=[]
for name,path in files.items():
    if path.is_symlink():errors.append('symlink:'+name)
    if path.stat().st_size>25*1024*1024:errors.append('oversized:'+name)
    if any(part in {'research','docs','work','tests','node_modules','experimental'} for part in Path(name).parts):errors.append('private/development:'+name)
    if Path(name).name in {'.env','.DS_Store','AGENTS.md'}:errors.append('private:'+name)
    if name=='.github/scripts/verify-release.py':continue
    if path.suffix in {'.js','.mjs','.html','.css','.json','.md','.yml','.webmanifest'}:
        s=path.read_text(errors='replace')
        for pattern in [r'gh[pousr]_[A-Za-z0-9]{30,}',r'github_pat_[A-Za-z0-9_]{30,}',r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',r'AKIA[A-Z0-9]{16}',r'/Users/[^/\s]+/',r'Web_EmmaLocal_English_for_babies/']:
            if re.search(pattern,s):errors.append('sensitive/legacy pattern '+pattern+':'+name)
# Static ES imports, Worker URLs and literal HTML/CSS references. Dynamic tables
# are additionally covered by manifest and real-browser request/image tests.
for name,path in files.items():
    if path.suffix not in {'.js','.mjs','.html','.css','.webmanifest'}:continue
    s=path.read_text(errors='replace')
    refs=[]
    if name=='.github/scripts/verify-release.py':continue
    if path.suffix in {'.js','.mjs'}:
        refs+=re.findall(r'''(?:from\s*|import\s*\(\s*|import\s*)['"](\.[^'"\n]+)['"]''',s)
        refs+=re.findall(r'''new URL\(\s*['"](\.[^'"\n]+)['"]\s*,\s*import\.meta\.url''',s)
        # Literal page links rendered by JS resolve from the document, not the module.
        for ref in re.findall(r'''href=["'](\./[^"'\n]+\.html(?:[?#][^"'\n]*)?)["']''',s):
            target=root/urllib.parse.unquote(ref.split('?')[0].split('#')[0])
            if not target.is_file():errors.append('missing rendered page:'+name+' -> '+ref)
    if path.suffix=='.html':refs+=re.findall(r'''(?:src|href|data-source)=["'](\.?\.?/[^"']+)["']''',s)
    if path.suffix=='.css':refs+=re.findall(r'''url\(['"]?(\.[^)'"\s]+)''',s)
    for ref in refs:
        # Deliberately nonexistent fail-closed Transformers fallback; never fetched.
        if name=='src/multilingual/worker.js' and ref=='../../multilingual-assets/unavailable/':continue
        target=(path.parent/urllib.parse.unquote(ref.split('?')[0].split('#')[0])).resolve()
        if not target.is_file() and not target.is_dir():errors.append('missing dependency:'+name+' -> '+ref)
model=json.loads((root/'src/semantic-assets-manifest.json').read_text())
assert model['assets']['model.onnx']['url'].startswith('https://raw.githubusercontent.com/eltnegcellist/ruri_int8/')
assert not any(n.endswith('/model.onnx') and n.startswith('semantic-assets/') for n in files)
for name,meta in model['assets'].items():
    if meta['url'].startswith('http'):continue
    path=(root/'src'/meta['url']).resolve()
    if hashlib.sha256(path.read_bytes()).hexdigest()!=meta['sha256']:errors.append('semantic hash:'+name)
voice=json.loads((root/'assets/voice-1202/manifest.json').read_text())
for entry in voice['entries']:
    path=root/'assets/voice-1202'/entry['file']
    if hashlib.sha256(path.read_bytes()).hexdigest()!=entry['sha256']:errors.append('voice hash:'+entry['file'])
for manifest in ['manifest.webmanifest','manifest.intl.webmanifest']:
    data=json.loads((root/manifest).read_text());assert data['scope']=='./' and data['start_url']=='./'
report={'passed':not errors,'files':len(files),'bytes':sum(p.stat().st_size for p in files.values()),'maximum_file_bytes':max(p.stat().st_size for p in files.values()),'voice_clips_sha256_verified':len(voice['entries']),'ruri_url':model['assets']['model.onnx']['url'],'errors':errors}
print(json.dumps(report,indent=2));raise SystemExit(bool(errors))
