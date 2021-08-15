function dataBank<T>(data:T[], value:T):void{
    data.push(value);
}

type N3 = [number, number, number];

type FN3 = (a:number, b?:number, c?:number) => number;

type Person = {
    name:string;
    age?:number;
    sex:'F'|'M';
}

const obj:Person = {
    name:'abc',
    age:30,
    sex:'F'
};


const add3:FN3 = (a, b?, c?) => {
    if(typeof c !== 'undefined'){
        return a + b + c;
    } else if(typeof b !== 'undefined'){
        return a + b;
    } else {
        return a;
    }
};

add3(10, 20)

const arr:N3[] = [[1,2,3], [4,5,6], [7,8,9]];

// const arr:number[][]

add3(...arr[0]);

// const arr:number[] = [];