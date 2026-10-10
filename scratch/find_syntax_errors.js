import fs from 'fs';

const content = fs.readFileSync('./client/src/utils/formatters.js', 'utf8');
const lines = content.split('\n');

console.log('Total lines in formatters.js:', lines.length);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // check for suspicious tokens like }; placed in middle of string or object
  if (line.includes('};') && !line.trim().startsWith('}') && !line.trim().startsWith('const') && !line.trim().startsWith('export')) {
    console.log(`Line ${i + 1}: ${line}`);
  }
  if (line.includes('')) {
    console.log(`Replacement character at line ${i + 1}: ${line.slice(0, 80)}`);
  }
}
