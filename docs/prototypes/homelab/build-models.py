"""Extract accepted device geometry into isolated, reproducible scene modules."""
import json
import re
from pathlib import Path

here = Path(__file__).resolve().parent
for name in ('imini', 'ups', 'glinet'):
    source = (here.parent / name / 'index.html').read_text(encoding='utf-8-sig')
    css = re.search(r'<style>(.*?)</style>', source, re.S).group(1)
    tail = source.split('<div class="model" id="model">', 1)[1]
    depth = 1
    for match in re.finditer(r'</?div\b[^>]*>', tail):
        depth += -1 if match.group().startswith('</') else 1
        if depth == 0:
            markup = tail[:match.end()]
            break
    assert depth == 0, f'{name}: model closing tag missing'
    script = re.search(r'<script>(.*?)</script>', source, re.S).group(1)
    assert 'let pitch=' in script, f'{name}: geometry boundary missing'
    geometry = script.split('let pitch=', 1)[0]
    if name == 'glinet':
        geometry += "\nfor(const[id,x,twist]of[['antenna-left',-167,-90],['antenna-right',167,90]]){const g=document.getElementById(id);g.style.transformOrigin='0 94px 0';g.style.transform=`translate3d(${x}px,-94px,-95px) rotateY(${twist}deg)`;}"
    html = '<style>' + css + '\n:host{position:absolute;width:0;height:0;transform-style:preserve-3d}.model{position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d}</style><div class="model" id="model">' + markup
    out = 'export function mount(root){\nroot.innerHTML=' + json.dumps(html, ensure_ascii=False) + ';\nconst document={querySelector:s=>root.querySelector(s),getElementById:id=>root.getElementById(id),createElement:tag=>globalThis.document.createElement(tag)};\n' + geometry + '\n}\n'
    (here / f'{name}.js').write_text(out, encoding='utf-8')
    print(f'Generated {name}.js')
