import { Boston } from './data';

(async()=>{
    await Boston.ready();
    butCon.classList.add('load');
})();

const butCon = document.querySelector<HTMLDivElement>('#but-con');
const load = document.querySelector<HTMLButtonElement>('#load');
const save = document.querySelector<HTMLButtonElement>('#save');
const train = document.querySelector<HTMLButtonElement>('#train');
const input = document.querySelector('input');

butCon.addEventListener('click', e => {
    const tar = e.target as HTMLButtonElement|HTMLDivElement;
    if(tar === butCon || !butCon.classList.contains('load') || tar.classList.contains('loading')){
        e.stopPropagation();
    } else {
        tar.classList.add('loading');
    }
}, {capture:true});

train.addEventListener('click', async e => {
    await Boston.train();
    train.classList.remove('loading');
}, {capture:true});

load.addEventListener('click', async e => {
    await Boston.load('../sample/boston-red-sox.json');
    load.classList.remove('loading');
}, {capture:true});

save.addEventListener('click', async e => {
    await Boston.model.save('downloads://boston-red-sox');
    save.classList.remove('loading');
}, {capture:true});

input.addEventListener('keydown', e => {
    if(e.key === 'Enter' && input.validity.valid){
        Boston.test(input.value.split(',').map(v => Number(v)))
    }
})