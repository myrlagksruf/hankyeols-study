import * as tf from '@tensorflow/tfjs';
import { Boston } from './data';
(async()=>{
    await tf.ready();
    await Boston.load();
})();
