import fs from 'fs';

const filePath = './client/src/utils/formatters.js';
let content = fs.readFileSync(filePath, 'utf8');

const badString = '    "Cetrizine-D": "செட்ரிசின்-டி",\r\n    "Cconst GENERIC_NAME_MAPS = {';
const badStringUnix = '    "Cetrizine-D": "செட்ரிசின்-டி",\n    "Cconst GENERIC_NAME_MAPS = {';

if (content.includes('Cconst GENERIC_NAME_MAPS')) {
  content = content.replace(/\"Cconst GENERIC_NAME_MAPS = \{/g, '  }\n};\n\nconst GENERIC_NAME_MAPS = {');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully fixed formatters.js syntax!');
} else {
  console.log('Cconst not found in formatters.js');
}
