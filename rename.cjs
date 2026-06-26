const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'ROTERO ANTIGRAVITY') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(fullPath);
      if (['.html', '.json', '.js', '.jsx', '.css', '.md', '.toml'].includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content
          .replace(/MARKETERO/g, 'MARKKETERO')
          .replace(/Marketero/g, 'Markketero')
          .replace(/marketero/g, 'markketero');
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log('Updated: ' + fullPath);
        }
      }
    }
  }
};

walk(__dirname);
console.log('¡Reemplazo completado!');
