const fs = require('fs');
const path = require('path');
const { ALL_SENTENCE_MAPS } = require('./sentence_data');

const formattersPath = path.join(__dirname, '../client/src/utils/formatters.js');
let content = fs.readFileSync(formattersPath, 'utf8');

// Replace SENTENCE_MAPS block in formatters.js
const startMarker = 'const SENTENCE_MAPS = {';
const startIdx = content.indexOf(startMarker);
if (startIdx !== -1) {
  const endMarker = '};\n\nexport function formatDate';
  const endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx !== -1) {
    const newSentenceMapsDef = 'const SENTENCE_MAPS = ' + JSON.stringify(ALL_SENTENCE_MAPS, null, 2) + ';\n\n';
    content = content.slice(0, startIdx) + newSentenceMapsDef + content.slice(endIdx + 3);
  }
}

fs.writeFileSync(formattersPath, content, 'utf8');
console.log('Successfully updated SENTENCE_MAPS in formatters.js');
