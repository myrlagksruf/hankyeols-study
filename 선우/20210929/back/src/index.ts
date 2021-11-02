import express from 'express';
import path from 'path';

const app = express();
const frontPath = path.resolve(__dirname, '..', '..', 'front');

app.get('/', (req, res) => res.redirect('/front/html/index.html'));

app.use('/front', express.static(frontPath, {index:false}));

app.listen(3000);