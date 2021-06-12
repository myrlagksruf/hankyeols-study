const $:typeof document.querySelector = document.querySelector.bind(document);
const text = $<HTMLInputElement>('#text');
const file = $<HTMLInputElement>('#file');
const rec = $<HTMLButtonElement>('#rec');
const send = $<HTMLButtonElement>('#send');
const result = $<HTMLDivElement>('#result');
const obj = new Map([['image', 'img'], ['audio', 'audio'], ['video', 'video']]);
let url = '';

const fileMes = async (value:string) => {
    const res = await fetch(value);
    if(res.status === 403) {
        result.innerHTML = await res.text();
        return
    }
    const cont = res.headers.get('content-type');
    const type = obj.get(cont.split('/')?.[0]);
    result.innerHTML = '';
    if(type){
        const node = document.createElement(type) as HTMLImageElement|HTMLMediaElement;
        URL.revokeObjectURL(url);
        url = URL.createObjectURL(await res.blob());
        node.src = url;
        result.appendChild(node);
    } else {
        result.innerHTML = await res.text();
    }
};

rec.addEventListener('click', async e => {
    await fileMes(`/file${text.value}`);
});

result.addEventListener('click', async e => {
    const tar = e.target as HTMLElement;
    if(tar.nodeName === 'LI'){
        await fileMes(tar.dataset.url);
    }
});