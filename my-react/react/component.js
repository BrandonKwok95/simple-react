/*
 * @Author: guohao043
 * @Date: 2022-05-04 10:17:07
 * @LastEditors: guohao043
 * @LastEditTime: 2022-05-04 22:22:32
 * @Description: desc
 */
import { renderComponent } from "../react-dom";

export default class Component {
  constructor(props = {}) {
    this.props = props
    this.state = {}
  }
  setState(stateChange) {
    // 合并对象
    Object.assign(this.state, stateChange)  // this为类实例
    // 渲染组件
    renderComponent(this) // this为类实例
  }
}
