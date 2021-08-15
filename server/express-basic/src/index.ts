import express from 'express';
import path from 'path';
import fs from 'fs/promises';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.raw({
    limit:'100mb'
}));

const product = (...a:number[]) => a.reduce((acc, cur) => acc * cur, 1);

// /data/lake.jpg -> __dirname, '..', 'data', /././
app.use('/data', (req, res, next) => {
    const pos = path.resolve(__dirname, '..', 'data', `.${req.path}`);
    res.sendFile(pos);
});

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('꺼져');
});

app.post('/cal', (req, res) => {
    const arr:number[] = req.body;
    res.json({status:'successful', data:product(...arr)});
});

app.post('/input', async (req, res) => {
    const q = req.query as {name:string;type:string};
    const folder = path.resolve(__dirname, '..', 'data', q.type.split('/')[0]);
    const name = q.name;
    try{
        await fs.access(folder);
    } catch(err){
        await fs.mkdir(folder);
    }
    await fs.writeFile(path.resolve(folder, name), req.body);
    res.end('success');
})

app.post('/file', async (req, res) => {
    const url:{type:string; name:string} = req.body;
    try{
        const P = path.resolve(__dirname, '..', 'data', url.type, url.name);
        await fs.access(P);
        res.json({status:'successful', url:`/data/${url.type}/${url.name}`});
    } catch(err){
        res.status(404);
        res.json({status:'failed', url:''});
    }
});


// app.get('/other', (req, res) => {
//     const arr = {
//         up: [1,2,3,6],
//         down: [30, 40, 20]
//     };
//     // res.setHeader('Content-Type', 'application/json; charset=utf-8')
//     // res.end(JSON.stringify(arr));
//     res.json(arr);
// });

// app.get('/html', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '..', 'data', 'test.html'));
// });

app.listen(PORT, () => {
    console.log('server 개동중');
});