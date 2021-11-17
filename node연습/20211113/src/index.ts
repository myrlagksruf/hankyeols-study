import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const home = path.dirname(fileURLToPath(import.meta.url));

const dirs = process.argv.slice(1).filter(v => !v.includes(path.resolve(home, '..')));

let count = 0;

const result = path.resolve('.', 'result');

console.log(result);

try{
    await fs.access(result);
    await fs.rm(result, {recursive:true, force:true});

} catch(err){
} finally{
    await fs.mkdir(result);
}

for(let i of dirs){
    const stat = await fs.stat(i);
    if(stat.isDirectory()){
        const dir = await fs.readdir(i);
        for(let j of dir){
            const num = parseInt(j);
            const ext = path.extname(j);
            if(!isNaN(num)){
                await fs.copyFile(path.resolve(i, j), path.resolve(result, `${String(count++).padStart(4, '0')}${ext}`))
            }
        }
    }
}