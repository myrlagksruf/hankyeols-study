const fenToArray = (str:string) => str.replace(/\d/g, v => ' '.repeat(Number(v))).split('/').map(v => v.split(''));
const arraytoFen = (arr:string[][]) => arr.map(v => v.join('')).join('/').replace(/\s+/g, v => String(v.length));
const arr = fenToArray('rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R');
console.log(arr);
console.log(arraytoFen(arr));