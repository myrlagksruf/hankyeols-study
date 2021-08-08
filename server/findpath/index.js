const fs = require('fs/promises');

const 파일다보기 = async (path, name) => {
    const opens = await fs.opendir(path);
    for await(let i of opens){
        if(i.isDirectory())
            await 파일다보기(`${path}/${i.name}`, name);
        if(true){
            console.log(`${path}/${i.name}`);
        }
    }
};

파일다보기('./data', 'hi');