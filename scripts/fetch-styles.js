import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { DOMParser } from '@xmldom/xmldom';
import extract from 'extract-zip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchStyles() {
  const STYLES_DIR = path.join(process.cwd(), 'data/styles');
  const TEMP_ZIP = path.join(process.cwd(), 'styles.zip');
  
  console.log('Creating directories...');
  if (!fs.existsSync(STYLES_DIR)) {
    fs.mkdirSync(STYLES_DIR, { recursive: true });
  }
  
  console.log('Downloading styles from CSL repository...');
  const response = await axios({
    method: 'get',
    url: 'https://github.com/citation-style-language/styles/archive/refs/heads/master.zip',
    responseType: 'stream'
  });
  
  const writer = fs.createWriteStream(TEMP_ZIP);
  response.data.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on('finish', () => resolve());
    writer.on('error', reject);
  });
  
  console.log('Extracting styles...');
  await extract(TEMP_ZIP, { dir: process.cwd() });
  
  console.log('Processing styles...');
  const extractedDir = path.join(process.cwd(), 'styles-master');
  const files = fs.readdirSync(extractedDir).filter(file => file.endsWith('.csl'));
  
  let stylesData = {};
  
  for (const file of files.slice(0, 250)) { 
    try {
      const content = fs.readFileSync(path.join(extractedDir, file), 'utf-8');
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');
      
      const styleId = file.replace('.csl', '');
      const titleElement = doc.getElementsByTagName('title')[0];
      const title = titleElement ? titleElement.textContent : styleId;
      
      // Extract other metadata
      const infoElement = doc.getElementsByTagName('info')[0];
      const descriptionElement = infoElement?.getElementsByTagName('summary')[0];
      const description = descriptionElement ? descriptionElement.textContent : '';
      
      // Save to styles data
      stylesData[styleId] = {
        id: styleId,
        title: title || styleId,
        description: description || '',
        tags: inferTags(content),
        disciplines: inferDisciplines(content),
        categories: inferCategories(content),
        version: '1.0'
      };
      
      // Save CSL file
      fs.writeFileSync(path.join(STYLES_DIR, file), content);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  // Save styles metadata
  fs.writeFileSync(
    path.join(process.cwd(), 'data/style-metadata.json'), 
    JSON.stringify(stylesData, null, 2)
  );
  
  console.log('Cleaning up...');
  fs.rmSync(TEMP_ZIP);
  fs.rmSync(extractedDir, { recursive: true, force: true });
  
  console.log(`Done! Processed ${Object.keys(stylesData).length} styles.`);
}

function inferTags(content) {
  const tags = [];
  
  if (content.includes('citation-format="author-date"')) tags.push('author-date');
  if (content.includes('citation-format="numeric"')) tags.push('numeric');
  if (content.includes('citation-format="note"')) tags.push('note');
  if (content.includes('<text variable="DOI"')) tags.push('doi-support');
  if (content.includes('<text variable="URL"')) tags.push('url-required');
  
  return tags;
}

function inferDisciplines(content) {
  const disciplines = [];
  
  if (content.includes('psychology') || content.includes('behavioral')) {
    disciplines.push('psychology');
  }
  if (content.includes('humanities') || content.includes('literature')) {
    disciplines.push('humanities');
  }
  if (content.includes('science') || content.includes('scientific')) {
    disciplines.push('sciences');
  }
  if (content.includes('engineering') || content.includes('technical')) {
    disciplines.push('engineering');
  }
  if (content.includes('medicine') || content.includes('health')) {
    disciplines.push('medicine');
  }
  
  return disciplines;
}

function inferCategories(content) {
  const categories = [];
  
  if (content.includes('journal')) categories.push('journal');
  if (content.includes('university')) categories.push('university');
  if (content.includes('book')) categories.push('book');
  
  return categories;
}

fetchStyles().catch(console.error); 