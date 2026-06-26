const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src', 'pages', 'admin'),
  path.join(__dirname, 'src', 'components', 'admin')
];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      content = content.replace(/text-cozy-deep/g, 'text-black-forest');
      content = content.replace(/text-cozy-text/g, 'text-black-forest');
      content = content.replace(/bg-cozy-card/g, 'bg-surface border border-border-light shadow-sm');
      content = content.replace(/border-cozy-soft/g, 'border-border-light');
      content = content.replace(/text-cozy-accent/g, 'text-copperwood');
      content = content.replace(/bg-cozy-deep/g, 'bg-black-forest');
      content = content.replace(/bg-cozy-accent/g, 'bg-copperwood');
      content = content.replace(/bg-cozy-bg/g, 'bg-surface-elevated');
      content = content.replace(/border-cozy-accent/g, 'border-copperwood');
      content = content.replace(/bg-cozy-soft/g, 'bg-surface-elevated');
      
      content = content.replace(/font-serif/g, 'font-display');
      
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
}

directories.forEach(processDirectory);
