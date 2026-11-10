//eventBus事件总线
//一个公共的、全局的消息中转站：往中转站发消息(触发事件)；在中转站监听监听消息(订阅事件)
//适用于父子组件、非父子组件等之间的通信。只要能拿到同一个bus对象，就能通信。
class EventBus {
    constructor() {
        // 用来存所有事件
        this.events = {}
    }
    // 1.订阅事件
    on(eventName, callback) {
        // 如果事件不存在，创建空数组
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback)// 把回调 push 进去
    }
    // 2.触发事件
    emit(eventName, ...args) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => {
            callback(...args)// 遍历执行所有回调
        })
    }
    // 3.取消订阅事件
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        // 过滤掉要取消的回调
        this.events[eventName] = this.events[eventName].filter(
            cb => cb !== callback
        )
    }
    // 4.只触发一次事件
    once(eventName, callback) {
        //西安定义一个临时函数，执行完自动取消自己
        const tempCb = (...args) => {
            callback(...args)
            this.off(eventName, tempCb)
        }
        this.on(eventName, tempCb)
    }
}