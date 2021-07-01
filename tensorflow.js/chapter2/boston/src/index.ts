import * as tf from '@tensorflow/tfjs';
import { Boston } from './data';

(async()=>{
    await tf.ready();
    await Boston.load();
    button.classList.add('load');
})();

const button = document.querySelector('button');
button.addEventListener('click', async e => {
    if(button.classList.contains('load') && !button.classList.contains('loading')){
        button.classList.add('loading');
        await Boston.train();
        button.classList.remove('loading');
    }
});