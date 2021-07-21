import * as tf from '@tensorflow/tfjs';
class Sori{
    static H = 1800;
    static HEADER = 44;
    static LEARNING_RATE = 0.001 as const;
    static SIZE = 80;
    static RESULT_SIZE = 8;
    static GAP = 2  ;
    static model:tf.Sequential;
    static ten:tf.Tensor2D;
    static sor:tf.Tensor2D;
    
    constructor(){}
    static async ready(){
        const rawLabel = await (await fetch('../data/label')).json() as number[];
        let len = 0;
        const getFile = async (url:string):Promise<[Uint8Array, number]> => {
            const res = await fetch(url);
            const data = new Uint8Array(await res.arrayBuffer()).slice(this.HEADER);
            len += Math.floor((this.H - data.length) / this.GAP) + 1;
            return [data, Math.floor((this.H - data.length) / this.GAP) + 1];
        };

        const proArr = [];
        for(let i = 0; i < this.SIZE; i++){
            proArr.push(getFile(`../data/audio/${i}.wav`));
        }
        const middle = await Promise.all(proArr);

        const result = new Uint8Array(this.H * len);
        const label = new Uint8Array(this.RESULT_SIZE * len);

        let k = 0;
        for(let i = 0; i < middle.length; i++){
            for(let j = 0; j < middle[i][1]; j++){
                for(let t = 0; t < this.RESULT_SIZE; t++){
                    label[k * this.RESULT_SIZE + t] = rawLabel[i * this.RESULT_SIZE + t];
                }
                for(let t = 0; t < j * this.GAP; t++){
                    result[k * this.H + t] = 0;
                }
                for(let t = 0; t < middle[i][0].length; t++){
                    result[k * this.H + j * this.GAP + t] = middle[i][0][t];
                }
                for(let t = j * this.GAP + middle[i][0].length; t < this.H; t++){
                    result[k * this.H + t] = 0;
                }
                k++;
            }
        }
        if(len !== k){
            alert(`잘못된 연산 ${len} ${k}`)
            return;
        }

        this.ten = tf.tensor2d(result, [len, this.H]);
        this.sor = tf.tensor2d(label, [len, this.RESULT_SIZE]);


        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape:[this.H], units: 512}));
        model.add(tf.layers.dense({units: 256}));
        model.add(tf.layers.dense({units: 128}));
        model.add(tf.layers.dense({units: 64}));
        model.add(tf.layers.dense({units: this.RESULT_SIZE}));
        model.compile({
            optimizer:'rmsprop',
            loss:'categoricalCrossentropy',
            metrics: ['accuracy']
        });
        this.model = model;
    }
    static async train(obj:{acc:HTMLDivElement, epo:HTMLDivElement}){
        await this.model.fit(this.ten, this.sor, {
            batchSize:32,
            validationSplit:0.15,
            epochs:100,
            callbacks:{
                async onBatchEnd(batch, logs){
                    console.log(logs);
                    obj.acc.innerHTML = `batch : ${batch}, accuracy : ${logs.acc}`;
                    await tf.nextFrame();
                },
                async onEpochEnd(epoch, logs){
                    obj.epo.innerHTML = `epoch : ${epoch}, loss : ${logs.loss}`;
                    await tf.nextFrame();
                }
            }
        });
        await this.model.save('indexeddb://my-model');
    }

    static async load(){
        this.model = (await tf.loadLayersModel('indexeddb://my-model')) as tf.Sequential;
        this.model.compile({
            optimizer:'rmsprop',
            loss:'categoricalCrossentropy',
            metrics: ['accuracy']
        });
    }

    static async predict(){
        (this.model.predict(this.ten.slice(300, 1)) as tf.Tensor2D).print();
    }
}

export default Sori;