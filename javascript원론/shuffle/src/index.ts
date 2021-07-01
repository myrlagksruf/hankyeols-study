const inp = document.querySelector('input');
const res = document.querySelector<HTMLDivElement>('#res');
const fun = () => {
    if(inp.validity.valid){
        const size = Number(inp.value);
        const arr = Array(size).fill(0).map((v, i) => i);
        for(let i = 0; i < size - 1; i++){
            const temp = arr[i];
            const pick = Math.floor(Math.random() * (size - i) + i);
            arr[i] = arr[pick];
            arr[pick] = temp;
        }
        res.innerHTML = arr.join(', ');
    }
}
inp.addEventListener('input', fun);

inp.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        fun();
    }
})