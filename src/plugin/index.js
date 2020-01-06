import toast from '../plugin/Toast'
let ToastPlugin = {}
ToastPlugin.install = function (Vue, options) {


    const ToastConstructor = Vue.extend(toast)
    // 生成一个该子类的实例
    const instance = new ToastConstructor();

    // 将这个实例挂载在我创建的div上
    // 并将此div加入全局挂载点内部
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    Vue.prototype.$toast = (msg,type, duration = 2500) => {
        instance.message = msg;
        instance.type = type;
        instance.show = true;

        setTimeout(() => {
            instance.show = false;
        }, duration);
    }
}
export default ToastPlugin