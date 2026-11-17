"""Bundle the dependency-free app as one offline HTML file."""
from pathlib import Path

root = Path(__file__).resolve().parent
source = root / 'src'
html = (source / 'index.template.html').read_text()
for marker, filename in [('STYLES', 'style.css'), ('ENGINE', 'engine.js'), ('SCENE', 'scene.js'), ('PRESENTATION', 'presentation.js'), ('APP', 'app.js')]:
    text = (source / filename).read_text()
    if filename.endswith('.js') and '</script' in text.lower():
        raise ValueError('Unsafe closing script tag in ' + filename)
    html = html.replace('/* ' + marker + ' */', text)
for target in [root / 'index.html', root / 'dist' / 'index.html']:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html)
print(f'Built standalone index.html: {len(html.encode()):,} bytes')
