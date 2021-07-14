import * as tf from '@tensorflow/tfjs';
class Sori{
    static H = 1800;
    static HEADER = 44;
    static LEARNING_RATE = 0.001 as const;
    static SIZE = 80;
    static RESULT_SIZE = 8;
    static model:tf.Sequential;
    static ten:tf.Tensor2D;
    static sor:tf.Tensor2D;
    constructor(){}
    static async ready(){
        const label = await (await fetch('../data/label')).json();
        const result = new Uint8Array(this.H * this.SIZE);
        const getFile = async (url:string, j:number) => {
            const res = await fetch(url);
            const data = new Uint8Array(await res.arrayBuffer()).slice(this.HEADER);
            
            for(let i = 0; i < this.H; i++){
                result[i + j * this.H] = data[i];
            }
        };

        const proArr = [];
        for(let i = 0; i < this.SIZE; i++){
            proArr.push(getFile(`../data/audio/${i}.wav`, i));
        }
        await Promise.all(proArr);

        this.ten = tf.tensor2d(result, [this.SIZE, this.H]);
        this.sor = tf.tensor2d(label, [this.SIZE, this.RESULT_SIZE]);


        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape:[this.H], units: 512, activation:'relu'}));
        model.add(tf.layers.dense({units: 256, activation: 'relu'}));
        model.add(tf.layers.dense({units: 128, activation: 'relu'}));
        model.add(tf.layers.dense({units: 64, activation: 'relu'}));
        model.add(tf.layers.dense({units: this.RESULT_SIZE, activation: 'softmax'}));
        model.compile({
            optimizer: tf.train.adam(this.LEARNING_RATE),
            loss: 'meanSquaredError'
        });
        this.model = model;
    }
    static async train(obj:{acc:HTMLDivElement, epo:HTMLDivElement}){
        await this.model.fit(this.ten, this.sor, {
            batchSize:10,
            validationSplit:0.15,
            epochs:100,
            callbacks:{
                async onBatchEnd(batch, logs){
                    obj.acc.innerHTML = `batch : ${batch}, accuracy : ${logs.loss}`;
                    await tf.nextFrame();
                },
                async onEpochEnd(epoch, logs){
                    obj.epo.innerHTML = `epoch : ${epoch}, loss : ${logs.loss}`;
                    await tf.nextFrame();
                }
            }
        });
    }
}

export default Sori;