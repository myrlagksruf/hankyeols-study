const fs = require('fs/promises');
const path = require('path');

fs.rmdir(path.resolve(__dirname, 'data', '4'))
.then(v => console.log(v));

// const findPath = async (p, find) => {
//     const dir = await fs.opendir(p);
//     const arr = [];
//     const work = [];
//     for await(let i of dir){
//         const cur = path.resolve(p, i.name);
//         if(i.isDirectory()){
//             work.push(findPath(cur, find));
//         } else if(find.exec(i.name)){
//             arr.push(cur);
//         }
//     };
//     return arr.concat((await Promise.all(work)).flat());
// };
// findPath('/home', /\d/)
// .then(v => console.log(v));