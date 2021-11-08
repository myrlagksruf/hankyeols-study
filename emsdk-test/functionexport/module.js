const Module = require('./main.js');

const fibojs = (a) => {
    if(a === 1 || a === 2){
        return 1;
    } else {
        return fibojs(a - 1) + fibojs(a - 2);
    }
}

Module['onRuntimeInitialized'] = () => {
    const fibo = Module.cwrap('fibofuck', 'number', ['number']);
    console.time('C');
    fibo(42)
    console.timeEnd('C');
    console.time('JS');
    fibojs(42);
    console.timeEnd('JS');
};