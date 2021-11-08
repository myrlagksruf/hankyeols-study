extern "C" {
    int arr[10000] = {0, 1, 1};
    int fibo(int a){
        if(a == 1 || a == 2) return 1;
        else if(arr[a] == 0){
            arr[a] = fibo(a - 1) + fibo(a - 2);
        }
        return arr[a]; 
    }

    int add(int a, int b){
        return a + b;
    }

    long long int fibofuck(long long int a){
        if(a == 1 || a == 2) return 1;
        return fibofuck(a - 1) + fibofuck(a - 2);
    }
}