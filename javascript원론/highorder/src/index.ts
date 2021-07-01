const isMouse = [false, false, false, false, false];

const fun = (bool:boolean) => (e:MouseEvent) => {
    const btn = e.button as 0|1|2|3|4;
    isMouse[btn] = bool;
};

document.addEventListener('mousedown', fun(true));
document.addEventListener('mouseup', fun(false));
document.addEventListener('contextmenu', (e) => e.preventDefault());
window.setInterval(() => console.log(isMouse), 1000);