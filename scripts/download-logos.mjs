import https from 'https';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/logos');
mkdirSync(OUT_DIR, { recursive: true });

// Sources: 'si' = Simple Icons SVG (colored), 'i8' = Icons8 PNG (color)
const ICONS = [
  // Simple Icons (have confirmed SVGs)
  { src: 'si', slug: 'confluence',    file: 'confluence',    color: '0052CC' },
  { src: 'si', slug: 'github',        file: 'github',        color: '24292E' },
  { src: 'si', slug: 'googledrive',   file: 'google-drive',  color: null },
  { src: 'si', slug: 'jira',          file: 'jira',          color: '0052CC' },
  { src: 'si', slug: 'asana',         file: 'asana',         color: 'E8634C' },
  { src: 'si', slug: 'miro',          file: 'miro',          color: 'FFD02F' },
  { src: 'si', slug: 'trello',        file: 'trello',        color: '0052CC' },
  { src: 'si', slug: 'zoom',          file: 'zoom',          color: '2D8CFF' },
  { src: 'si', slug: 'stackoverflow', file: 'stackoverflow', color: 'F48024' },
  { src: 'si', slug: 'wordpress',     file: 'wordpress',     color: '21759B' },
  { src: 'si', slug: 'postgresql',    file: 'postgresql',    color: '4169E1' },
  { src: 'si', slug: 'sap',           file: 'sap',           color: '0FAAFF' },
  { src: 'si', slug: 'box',           file: 'box',           color: '0061D5' },
  { src: 'si', slug: 'dropbox',       file: 'dropbox',       color: '0061FF' },
  { src: 'si', slug: 'egnyte',        file: 'egnyte',        color: '00B2A9' },
  { src: 'si', slug: 'gitlab',        file: 'gitlab',        color: 'FC6D26' },
  { src: 'si', slug: 'pagerduty',     file: 'pagerduty',     color: '06AC38' },
  { src: 'si', slug: 'zendesk',       file: 'zendesk',       color: '03363D' },

  // Icons8 color PNGs (not in Simple Icons)
  { src: 'i8', slug: 'slack',                    file: 'slack'               },
  { src: 'i8', slug: 'visual-studio',            file: 'azure-devops'        },
  { src: 'i8', slug: 'monday',                   file: 'monday'              },
  { src: 'i8', slug: 'microsoft-sharepoint-2019',file: 'sharepoint'          },
  { src: 'i8', slug: 'oracle-logo',              file: 'oracle'              },
  { src: 'i8', slug: 'salesforce',               file: 'salesforce'          },
  { src: 'i8', slug: 'tableau-software',         file: 'tableau'             },
  { src: 'i8', slug: 'azure-1',                  file: 'azure'               },
  { src: 'i8', slug: 'microsoft-sql-server',     file: 'sql-server'          },
  { src: 'i8', slug: 'workday',                  file: 'workday'             },
  { src: 'i8', slug: 'globe',                    file: 'enterprise-websites' },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetch(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ body: Buffer.concat(chunks), type: res.headers['content-type'] || '' }));
    }).on('error', reject);
  });
}

function hexToRgb(hex) {
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

async function processSI({ slug, file, color }) {
  const url = `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${slug}.svg`;
  const { body, type } = await fetch(url);
  let svg = body.toString();
  if (!svg.includes('<svg')) throw new Error('not SVG');

  if (color) {
    svg = svg.replace(/fill="[^"]*"/g, `fill="#${color}"`);
    svg = svg.replace(/fill:currentColor/g, `fill:#${color}`);
    svg = svg.replace(/fill:([^;}"]+)/g, `fill:#${color}`);
  }

  // Add padding
  const inner = svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
  const padded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 32 32" width="96" height="96">${inner}</svg>`;

  await sharp(Buffer.from(padded)).resize(96, 96).png().toFile(join(OUT_DIR, `${file}.png`));
  console.log(`  ✓ ${file}.png (SI)`);
}

async function processI8({ slug, file }) {
  const url = `https://img.icons8.com/color/96/${slug}.png`;
  const { body, type } = await fetch(url);
  if (!type.includes('image')) throw new Error(`unexpected type: ${type}`);

  // Resize to consistent 96x96
  await sharp(body).resize(96, 96).png().toFile(join(OUT_DIR, `${file}.png`));
  console.log(`  ✓ ${file}.png (I8)`);
}

console.log('Downloading and converting icons...');
for (const icon of ICONS) {
  try {
    if (icon.src === 'si') await processSI(icon);
    else await processI8(icon);
  } catch (e) {
    console.log(`  ✗ ${icon.file}: ${e.message}`);
  }
}
console.log('\nDone.');
