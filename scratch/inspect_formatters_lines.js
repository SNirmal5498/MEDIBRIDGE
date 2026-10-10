import fs from 'fs';

const content = fs.readFileSync('./client/src/utils/formatters.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('};') && !line.trim().startsWith('}') && !line.trim().startsWith('const') && !line.trim().startsWith('export') && !line.trim().startsWith('module')) {
    console.log(`Syntax anomaly line ${i + 1}: ${line}`);
  }
}
