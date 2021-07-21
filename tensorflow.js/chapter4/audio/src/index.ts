import Sori from './data';

const $ = document.querySelector.bind(document) as typeof document.querySelector;
const epo = $<HTMLDivElement>('#epo');
const acc = $<HTMLDivElement>('#acc');


(async()=>{

//     const stream = await navigator.mediaDevices.getUserMedia({
//         audio:true
//     });
//     recordRt
//     const chuck:Blob[] = [];
//     const media = new MediaRecorder(stream);
//     media.addEventListener('dataavailable', e => {
//         chuck.push(e.data);
//     });
//     media.addEventListener('stop', e => {
//         const blob = new Blob(chuck, {
//             'type': 
//         })
//     })
    await Sori.ready();

    try{
        await Sori.load();
        Sori.predict();
    } catch(err){
        await Sori.train({acc, epo});
    }

    
})();