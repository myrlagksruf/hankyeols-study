import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const app = express();

const front = path.resolve(__dirname, '..', '..', 'front');

app.use('/front', express.static(front));

app.use('/file', async (req, res) => {
    if(req.method === 'GET'){
        try{
            const resultPath = path.resolve(__dirname, `../file${req.url}`);
            const stat = await fs.stat(resultPath);
            if(stat.isDirectory()){
                const dir = await fs.readdir(resultPath);
                const arr = ['<ul>'];
                for(let i of dir){
                    arr.push(`<li data-url="/file${req.url}/${i}">${i}</li>`);
                }
                arr.push('</ul>');
                res.setHeader('content-type', 'text/plain');
                res.end(arr.join(''));
            } else {
                res.sendFile(resultPath);
            }
        } catch(err){
            console.log(err);
            res.status(403);
            res.end('wrong url');
        }
    } else if(req.method === 'POST'){

    }
});

app.get('/', (req, res) => {
    res.redirect('/front/view/index.html');
});

app.listen(4000);