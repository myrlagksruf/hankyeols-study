const container = document.querySelector<HTMLDivElement>('#container');
const con = document.querySelectorAll<HTMLDivElement>('.con');
const button = document.querySelectorAll<HTMLButtonElement>('button');
const input = document.querySelector('input');

const bubble = (e:MouseEvent) => {
    console.log('bubble', e.currentTarget);
};

const capture = (e:MouseEvent) => {
    if(!input.validity.valid){
        e.stopPropagation();
    }
    console.log('capture', e.currentTarget);
};

con[0].addEventListener('click', bubble);
container.addEventListener('click', bubble);
con[0].addEventListener('click', capture, {capture:true});
container.addEventListener('click', capture, {capture:true});