Promise.myAll = function(promises){
    if(typeof promises[Symbol.iterator] !== 'function'){
        return Promise.reject(new TypeError('必须是可迭代对象'))
    }
    return new Promise((resolve,reject) => {
        const promiseArr = Array.from(promises);//兼容一下map set
        let len = promiseArr.length;//map set 没有length只有size
        let count = 0;
        let res = [];
        if(!len) {
            return resolve([]);
        }
        promiseArr.forEach((item,index) => {
            Promise.resolve(item)
            .then((value) => {
                count++;
                res[index] = value;
                if(len === count){
                    return resolve(res);
                }
            })
            .catch(reject);
        })        
    })
}

const p1 = Promise.resolve(1);
const p2 = 2;
const p3 = new Promise(resolve => setTimeout(() => resolve(3), 1000));
const p4 = Promise.reject('出错啦');

Promise.myAll([p1, p2, p3]).then(console.log); // [1,2,3]
Promise.myAll([p1, p4]).catch(console.log); // '出错啦'
// 先打印'出错啦'，在打印[1,2,3] 因为setTimeout是宏任务