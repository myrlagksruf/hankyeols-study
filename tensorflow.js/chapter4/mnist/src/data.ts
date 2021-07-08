import * as tf from '@tensorflow/tfjs';

export default class Mnist{
    static H = 28 as const;
    static W = 28 as const;
    static SIZE = Mnist.H * Mnist.W;
    static NUM_CLASSES = 10 as const;
    static NUM_DATASET_ELEMENTS = 65000 as const;

    static NUM_TRAIN_ELEMENTS = 55000 as const;

    static MNIST_IMAGES_SPRITE_PATH = '../data/mnist_images.png' as const;
    static MNIST_LABELS_PATH = '../data/mnist_labels_uint8' as const;

    static tensorImage:tf.Tensor4D = null;
    static tensorLabel:tf.Tensor2D = null;
    static model:tf.Sequential = null;
    constructor(){}
    static async ready(){
        await tf.ready();
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let datasetImage:Float32Array = null;
        const imgReq = new Promise((res:(value:boolean) => void, rej) => {
            img.crossOrigin = '';
            img.addEventListener('load', e =>{
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;

                const buffer = new ArrayBuffer(this.NUM_DATASET_ELEMENTS * this.SIZE * 4);
                datasetImage = new Float32Array(buffer);
                const chunkSize = 5000;

                canvas.width = img.width;
                canvas.height = chunkSize;

                // console.log(img.width, img.height);

                for(let i = 0; i < this.NUM_DATASET_ELEMENTS / canvas.height; i++){
                    const byte = new Float32Array(buffer, i * this.SIZE * canvas.height * 4, this.SIZE * canvas.height);
                    ctx.drawImage(img, 0, i * canvas.height, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    for(let i = 0; i < data.data.length / 4; i++){
                        byte[i] = data.data[i * 4] / 255;
                    }
                }

                res(true);
            });
            img.src = this.MNIST_IMAGES_SPRITE_PATH;
        });

        const labelReq = fetch(this.MNIST_LABELS_PATH);
        const [_, label] = await Promise.all([imgReq, labelReq]);

        const datasetLabel = new Uint8Array(await label.arrayBuffer());

        this.tensorImage = tf.tensor4d(datasetImage, [datasetImage.length / this.SIZE, this.H, this.W, 1]);
        this.tensorLabel = tf.tensor2d(datasetLabel, [datasetLabel.length / this.NUM_CLASSES, this.NUM_CLASSES]);
        
        const model = tf.sequential();
        model.add(tf.layers.conv2d({
            inputShape:[Mnist.H, Mnist.W, 1],
            kernelSize:3,
            filters:16,
            activation:'relu'
        }));
        model.add(tf.layers.maxPooling2d({poolSize:2, strides:2}));
        model.add(tf.layers.conv2d({kernelSize:3, filters: 32, activation:'relu'}));
        model.add(tf.layers.maxPooling2d({poolSize:2, strides:2}));
        model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
        model.add(tf.layers.flatten({}));
        model.add(tf.layers.dense({units: 64, activation: 'relu'}));
        model.add(tf.layers.dense({units: 10, activation: 'softmax'}));
        model.compile({
            optimizer:'rmsprop',
            loss:'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        this.model = model;
        console.log(await Mnist.tensorImage.slice(0, 1).array());
    }
    static async train(acc:HTMLDivElement, epo:HTMLDivElement){
        await this.model.fit(Mnist.tensorImage, Mnist.tensorLabel, {
            batchSize:320,
            validationSplit:0.15,
            epochs:5,
            callbacks:{
                async onBatchEnd(batch, logs){
                    acc.innerHTML = `batch : ${batch}, accuracy : ${logs.acc}`;
                    await tf.nextFrame();
                },
                async onEpochEnd(epoch, logs){
                    epo.innerHTML = `epoch : ${epoch}, loss : ${logs.loss}`;
                    await tf.nextFrame();
                }
            }
        });
    }
    static async load(url:string){
        const model = (await tf.loadLayersModel(url)) as tf.Sequential;
        model.compile({
            optimizer:'rmsprop',
            loss:'categoricalCrossentropy',
            metrics: ['accuracy']
        });
        this.model = model;
    }
}

