// 实现Promise.allSettled方法：等所有请求都结束，返回每一个请求的结果
Promise.myAllSettled = function (promises) {
    if (typeof promises[Symbol.iterator] !== 'function') {
        return Promise.reject(new TypeError('传入的参数必须是可迭代对象'));
    }
    return new Promise((resolve) => {
        const promiseArr = Array.from(promises);//兼容一下map set(属于可迭代对象范围里)
        let len = promiseArr.length;
        let count = 0;
        let res = [];
        if (!len) return resolve([]);
        promiseArr.forEach((item, index) => {
            Promise.resolve(item)
                .then((value) => {
                    res[index] = { status: 'fulfilled', value };
                    check();
                })
                .catch((reason) => {
                    res[index] = { status: 'rejected', reason };
                    check();
                })
        });
        function check(){
            count++;
            if(len === count){
                return resolve(res);
            }
        }
    })
}