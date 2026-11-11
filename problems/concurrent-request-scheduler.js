//带并发限制的请求调度器
// 控制同时最多发 N 个请求，一个结束，立刻补一个，永远不超并发数。
class Scheduler {
    constructor(limit){
        this.limit = limit;//最大并发数
        this.queue = [];//请求队列
        this.running = 0;//当前正在运行的数量
    }
    // 添加请求
    add(task){
        return new Promise(resolve => {
            this.queue.push(() => task().then(resolve));
            this.run();
        });
    }
    // 执行请求
    run(){
        //没满额且队列中有请求，则执行请求
        while(this.running < this.limit && this.queue.length){
            const task = this.queue.shift();//执行请求
            this.running++;
            //执行请求
            task().finally(() => {
                this.running--;
                this.run();//执行完一个，立即补下一个
            })
        }
    }
}