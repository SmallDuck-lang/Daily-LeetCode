Promise.myRace = function(promises){
    if(typeof promises[Symbol.iterator] !== 'function'){
        return Promise.reject(new TypeError('必须是可迭代对象'))
    }
    return new Promise((resolve,reject) => {
        const promiseArr  = Array.from(promises);
        if(!promiseArr.length) return;//如果是空数组，状态一直是pending
        promiseArr.forEach((item) => {
            Promise.resolve(item)
            .then(resolve)
            .catch(reject);
        })
    })
}

const p1 = new Promise(r => setTimeout(() => r('成功1'), 1000))
const p2 = new Promise((_,r) => setTimeout(() => r('失败2'), 500))

Promise.myRace([p1, p2]).then(console.log).catch(console.log)// 失败2（因为它更快）