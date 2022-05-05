/*
 * @Author: guohao043
 * @Date: 2022-05-03 23:55:22
 * @LastEditors: guohao043
 * @LastEditTime: 2022-05-04 23:44:12
 * @Description: desc
 */
import Component from "../react/component";
import { diff, diffNode } from './diff'

const ReactDOM = {
  render
}


function render(vnode, container, dom) {
  // 这种情况下，默认都会重新挂载新DOM，因此需要引入DIFF算法
  return diff(dom, vnode, container)
  // return container.appendChild(_render(vnode))
}

/*
* 虚拟DOM转换为DOM
* */
function _render(vnode) {
  const { tag, attrs, children } = vnode
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return ''
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode)
  }
  // 函数式组件
  if (typeof tag === 'function') {
    // 1. 创建组件
    const comp = createComponent(tag, attrs)  // tags为组件（Babelzhuanyi）
    // 2. 设置组件属性
    setComponentProps(comp, attrs)
    // 3. 渲染成vnode形式
    return comp.base
  }

  const dom = document.createElement(tag)
  // 给dom附加属性
  if (attrs) {
    Object.keys(attrs).forEach(key => {
      const value = attrs[key]
      setAttribute(dom, key, value)
    })
  }
  // 递归遍历自元素
  children.forEach(child => render(child, dom))
  return dom
}

/*
* 函数组件和类组件差异的打平处理
* */
export function createComponent(comp, props) {
  let res
  // 将类组件和函数组件差异大瓶
  if (comp.prototype && comp.prototype.render) {
    // 类组件
    res = new comp(props)
  } else {
    // 函数组件
    res = new Component(props)
    res.constructor = comp  // 改变其constructor，让其指向原有comp
    // 返回值为
    res.render = function () {
      return this.constructor(props)  // this.constructor指向comp，实际执行comp()
    }
  }
  return res
}
/*
* 执行相应的生命周期
* 并将组件的attr属性与组件合并
* */
export function setComponentProps(comp, props) {
  // 节点comp.base为渲染出来
  if (!comp.base) {
    comp.componentWillMount && comp.componentWillMount()
  } else if (comp.componentWillReceiveProps())
  // 设置属性
  comp.props = props;
  // 渲染组件
  renderComponent(comp)
}

/*
* 将组件comp转换成JSX对象，将JSX转换成真实DOM并挂载到comp上
* */
export function renderComponent(comp) {
  const compToJsx = comp.render()
  let base = diffNode(comp.base, compToJsx)
  // 组件已经渲染则执行componentWillUpdate
  comp.base && comp.componentWillUpdate && comp.componentWillUpdate()
  if (comp.base) {
    // 更新流程
    comp.componentDidUpdate && comp.componentDidUpdate()
  } else {
    comp.componentDidMount && comp.componentDidMount()
  }
  comp.base = base
}


/*
* 处理相应属性（class和事件处理）
* */
export function setAttribute(dom, key, value) {
  // 将className转换为class
  if (key === 'className') {
    // 类名处理
    key = 'class'
    dom.setAttribute(key, value)
  } else if (/on\w+/.test(key)) {
    // 事件处理
    key = key.toLowerCase()
    dom[key] = value || ''
  } else if (key === 'style') {
    // 样式处理
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object') {
      // css样式
      // { width: 20 }
      Object.keys(value).forEach(k => {
        if (typeof value[k] === 'number') {
          dom.style[k] = value[k] + 'px'
        } else {
          dom.style[k] = value[k]
        }
      })
    }
  } else {
    // 其他属性
    if (key in dom) {
      dom[key] = value || ''
    }
    if (value) {
      dom.setAttribute(key, value)
    } else {
      dom.removeAttribute(key)
    }
  }
}

export default ReactDOM
