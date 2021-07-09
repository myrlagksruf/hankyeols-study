const container = document.querySelector<HTMLDivElement>('#container');

const 이름 = document.querySelector<HTMLInputElement>('#name');
const 나이 = document.querySelector<HTMLInputElement>('#age');
const 성별 = document.querySelector<HTMLSelectElement>('#sex');

container.addEventListener('input', e => {
    const tar = e.target as HTMLInputElement|HTMLSelectElement;
    if(!tar.validity.valid) e.stopPropagation();   
}, { capture:true });

이름.addEventListener('input', e => {
    const next = 이름.nextElementSibling;
    next.innerHTML = String(이름.value.length);
});

나이.addEventListener('input', e => {
    const next = 나이.nextElementSibling;
    next.innerHTML = 나이.value;
});

성별.addEventListener('input', e => {
    const next = 성별.nextElementSibling;
    next.innerHTML = `sex is ${성별.value}`;
});