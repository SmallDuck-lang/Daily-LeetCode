//nextTick: 等待 DOM 更新完成后执行回调
//Vue2 nextTick实现
Vue.prototype.$myNextTick = function (){
    return new Promise((resolve) => {
        //1. 浏览器支持 MutationObserver → 用它（微任务）
        if(typeof MutationObserver !== 'undefined'){
            let observer = new MutationObserver(resolve);
            let textNode = document.createTextNode("1");
            observer.observe(textNode, {
                characterData: true//监听「文本节点内容的变化」
            })
            textNode.textContent = 2;
        }else{
            //2. 不支持 → 降级 setTimeout（宏任务兜底）
            setTimeout(resolve, 0)
        }
    })
}
 
//Vue3 nextTick 只使用 Promise，抛弃所有降级
function nextTick(fn) {
  return Promise.resolve().then(fn)
}