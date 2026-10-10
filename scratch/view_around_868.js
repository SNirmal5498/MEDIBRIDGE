import fs from 'fs';

const content = fs.readFileSync('./client/src/utils/formatters.js', 'utf8');
const lines = content.split('\n');

for (let i = 845; i < 880 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
