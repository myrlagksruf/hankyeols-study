const field = document.querySelector<HTMLSelectElement>('#field');
const button = document.querySelector<HTMLButtonElement>('#send-field');


field.addEventListener('input', e => {
    field.classList.value = field.value;
});

button.addEventListener('click', e => {
    const key = field.value;
    const div = document.querySelector(`#form > div.${key}`);
    const values = Array.from(div.querySelectorAll('input')).map(v => v.value);
    console.log({ [ key ] :values});
});