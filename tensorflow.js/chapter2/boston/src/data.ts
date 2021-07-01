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
    static trainFeatures:tf.Tensor2D = null;
    static testFeatures:tf.Tensor2D = null;
    static model:tf.Sequential = null;
    static LEARNING_RATE = 0.001 as const;
    static BATCH_SIZE = 128 as const;
    static NUM_EPOCHS = 1000 as const;
    static dataMean:tf.Tensor1D = null;
    static dataStd:tf.Tensor1D = null;
    constructor(){}
    static async ready(){
        await tf.ready();
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

        const { dataMean, dataStd } = this.determineMeanAndStddev(this.trainData);

        this.dataMean = dataMean;
        this.dataStd = dataStd;
        this.trainFeatures = this.normalizeTensor(this.trainData, dataMean, dataStd);
        this.testFeatures = this.normalizeTensor(this.testData, dataMean, dataStd);

        this.trainFeatures.print();

        const model = tf.sequential();
        model.add(tf.layers.dense({ 
            inputShape:[this.trainFeatures.shape[1]],
            activation: 'sigmoid',
            // kernelInitializer: 'leCunNormal',
            units:64
        }));
        model.add(tf.layers.dense({
            units:32,
            activation: 'sigmoid',
            // kernelInitializer: 'leCunNormal'
        }));
        model.add(tf.layers.dense({units:1}));
        model.compile({
            optimizer: tf.train.adam(this.LEARNING_RATE),
            loss: 'meanSquaredError'
        });
        this.model = model;
    }
    static determineMeanAndStddev(data:tf.Tensor2D) {
        const dataMean = data.mean<tf.Tensor1D>(0);
        const diffFromMean = data.sub(dataMean);
        const squaredDiffFromMean = diffFromMean.square();
        const variance = squaredDiffFromMean.mean<tf.Tensor1D>(0);
        const dataStd = variance.sqrt();
        return {dataMean, dataStd};
    }
    static normalizeTensor(data:tf.Tensor2D, dataMean:tf.Tensor1D, dataStd:tf.Tensor1D) {
        return data.sub<tf.Tensor2D>(dataMean).div<tf.Tensor2D>(dataStd);
    }
    static async test(obj:number[]){
        const data = tf.tensor2d([obj])
        const norm = this.normalizeTensor(data, this.dataMean, this.dataStd);
        (this.model.predict(norm) as tf.Tensor2D).print();
    }
    static async load(url:string){
        const model = (await tf.loadLayersModel(url)) as tf.Sequential;
        model.compile({
            optimizer: tf.train.adam(Boston.LEARNING_RATE),
            loss: 'meanSquaredError'
        });
        Boston.model = model;
    }
    static async train(){
        const model = this.model;
        await model.fit(this.trainFeatures, this.trainTarget, {
            batchSize: this.BATCH_SIZE,
            epochs: this.NUM_EPOCHS,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    console.log(logs.loss);
                }
            }
        });
    }
}