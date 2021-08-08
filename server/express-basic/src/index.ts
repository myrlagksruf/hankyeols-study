import express from 'express';
import path from 'path';
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('꺼져');
});

// /data/lake.jpg -> __dirname, '..', 'data', /././
app.use('/data', (req, res, next) => {
    const pos = path.resolve(__dirname, '..', 'data', `.${req.path}`);
    res.sendFile(pos);
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