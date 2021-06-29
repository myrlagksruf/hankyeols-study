import * as tf from '@tensorflow/tfjs';

const keyBoston = {
    '0':'testData',
    '1':'testTarget',
    '2':'trainData',
    '3':'trainTarget'
} as const;
type strBoston = typeof keyBoston[keyof typeof keyBoston];
export class Boston{
    private static T:Array<strBoston> = ['testData', 'testTarget', 'trainData', 'trainTarget'];
    static testData:tf.Tensor2D = null;
    static testTarget:tf.Tensor2D = null;
    static trainData:tf.Tensor2D = null;
    static trainTarget:tf.Tensor2D = null;
    constructor(){}
    static async load(){
        const arr:Promise<[strBoston ,tf.Tensor2D]>[] = [];

        const loadFun = async (str:strBoston):Promise<[strBoston ,tf.Tensor2D]> => {
            try{
                const res = await fetch(`../data/${str}.csv`);
                const dat = await res.text();
                const sp = dat.split('\n').map(v => v.split(',').map(v => Number(v))).slice(1);
                return [str, tf.tensor2d(sp)];
            } catch(err){
                console.error(err);
                return [str, tf.tensor2d([[]])];
            }
        }

        for(let i of this.T){
            arr.push(loadFun(i));
        }

        const brr = await Promise.all(arr);
        for(let i of brr){
            this[i[0]] = i[1];
        }
    }
}