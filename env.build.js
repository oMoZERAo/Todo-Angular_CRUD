import fs from 'fs';
import path from 'path';
const environmentFile = path.join(__dirname, 'src', 'environments', 'environment.ts');

let content = fs.readFileSync(environmentFile, 'utf8');
content = content.replace('${PROJECT_ID}', process.env.PROJECT_ID);
content = content.replace('${APP_ID}', process.env.APP_ID);
content = content.replace('${STORAGE_BUCKET}', process.env.STORAGE_BUCKET);
content = content.replace('${API_KEY}', process.env.API_KEY);
content = content.replace('${AUTH_DOMAIN}', process.env.AUTH_DOMAIN);
content = content.replace('${MESSAGINGSENDER_ID}', process.env.MESSAGINGSENDER_ID);
content = content.replace('${MEASUREMENT_ID}', process.env.MEASUREMENT_ID);

fs.writeFileSync(environmentFile, content);
