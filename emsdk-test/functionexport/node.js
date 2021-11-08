const fs = require('fs/promises');
const { WASI } = require('wasi');

const main = async () => {
    const wasi = new WASI();

    const importObject = { 
        wasi_snapshot_preview1: wasi.wasiImport,
        env:{
            memoryBase: 0,
            tableBase: 0,
            memory: new WebAssembly.Memory({
              initial: 1024
            }),
            table: new WebAssembly.Table({
              initial: 0,
              element: 'anyfunc'
            })
        }
    };

    const wasm = await WebAssembly.compile(await fs.readFile('./main.wasm'));

    const instance = await WebAssembly.instantiate(wasm, importObject);

    console.log(instance.b);
    // wasi.start(instance);
};

main();