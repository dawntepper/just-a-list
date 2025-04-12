import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = join(__dirname, 'dist');
const oldName = join(distDir, '_next');
const newName = join(distDir, 'next');

if (fs.existsSync(oldName)) {
  fs.renameSync(oldName, newName);
  console.log('Successfully renamed _next to next');

  // Update references in HTML files
  const htmlFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => {
    const filePath = join(distDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\/_next\//g, '/next/');
    fs.writeFileSync(filePath, content);
    console.log(`Updated references in ${file}`);
  });
} else {
  console.log('_next directory not found');
}