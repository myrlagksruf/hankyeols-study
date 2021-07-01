import Mnist from './data';
const acc = document.querySelector<HTMLDivElement>('#acc');
const epo = document.querySelector<HTMLDivElement>('#epo');
const butCon = document.querySelector<HTMLDivElement>('#but-con');
const load = document.querySelector<HTMLButtonElement>('#load');
const save = document.querySelector<HTMLButtonElement>('#save');
const train = document.querySelector<HTMLButtonElement>('#train');

(async()=>{
    await Mnist.ready();
    butCon.classList.add('load');
})();


butCon.addEventListener('click', e => {
    const tar = e.target as HTMLButtonElement|HTMLDivElement;
    if(tar === butCon || !butCon.classList.contains('load') || tar.classList.contains('loading')){
        e.stopPropagation();
    } else {
        tar.classList.add('loading');
    }
}, {capture:true});

train.addEventListener('click', async e => {
    await Mnist.train(acc, epo);
    train.classList.remove('loading');
}, {capture:true});

load.addEventListener('click', async e => {
    await Mnist.load('../sample/mnist.json');
    load.classList.remove('loading');
}, {capture:true});

save.addEventListener('click', async e => {
    await Mnist.model.save('downloads://mnist');
    save.classList.remove('loading');
}, {capture:true});