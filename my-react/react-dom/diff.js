/*
 * @Author: guohao043
 * @Date: 2022-05-04 10:32:36
 * @LastEditors: guohao043
 * @LastEditTime: 2022-05-04 16:43:35
 * @Description: desc
 */


import {setAttribute, createComponent, setComponentProps } from "./index";

export function diff(dom, vnode, container) {
  // 对比节点后的变化
  const res = diffNode(dom, vnode)
  if ( container && res.parentNode !== container ) {
    container.appendChild( res );
  }
  return res
}

// 比较更新前后dom变化(相同层级进行比较)
export function diffNode(dom, vnode) {
  let res = dom
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return ''
  if (typeof vnode === 'number') vnode = String(vnode)
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.nodeType === 3) {
      if (dom.textConTent !== vnode) {
        dom.textConTent = vnode // 文本不一致更新文本
      } else {
        res = document.createTextNode(vnode)
        if (dom && dom.parentNode) {  // 已经挂载到父节点上
          dom.parentNode.replaceChild(res, dom)
        }
      }
    }
    return res
  }
  // 非文本DOM节点
  if (typeof vnode.tag === 'function') { // 当组件为
    return diffComponent(dom, vnode)
  }
  if (!dom) res = document.createElement(vnode.tag) // 节点不存在即直接挂载
  // 比较子节点（dom节点）
  if ((vnode.childrens && vnode.childrens.length > 0) || (res.childNodes && res.childNodes.length > 0)) {
    // 对比子节点
    diffChildren(out, vnode.childrens)
  }
  diffAttribute(res, vnode)
  return res
}

function diffComponent(dom, vnode) {
  let comp = dom  // 更名处理
  // 查看原型是否有变化，判断组件是否切换
  if (comp && comp.constructor === vnode.tag) {
    setComponentProps(comp, vnode.attrs)  // 重新给组件设置
    dom = comp.base  // 将渲染好的真实节点重新赋值给
  } else {
    // 组件已切换

    // 1. 移除旧组件
    if (dom) {
      unmountComponent(comp)
      comp = null
    }
    // 2. 创建新组建
    comp = createComponent(vnode.tag, vnode.attrs)
    // 3. 设置组件属性
    setComponentProps(comp, vnode.attrs)
    // 4. 重新挂载
    dom = comp.base
  }
  return dom
}

function unmountComponent(comp) {
  // 移除真实组件
  removeNode(comp.base)
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom)
  }
}

// diff children主要目的 找到对应子节点，比较并返回
function diffChildren( dom, vchildren ) {
  const domChildren = dom.childNodes;
  const children = [];  // 真实DOM节点
  const keyed = {};
  if ( domChildren.length > 0 ) {
    for ( let i = 0; i < domChildren.length; i++ ) {
      const child = domChildren[ i ];
      const key = child.key;
      if ( key ) {

        keyed[ key ] = child;
      } else {
        children.push( child );
      }
    }
  }
  if ( vchildren && vchildren.length > 0 ) {
    let min = 0;
    let childrenLen = children.length;
    for ( let i = 0; i < vchildren.length; i++ ) {
      const vchild = vchildren[ i ];
      const key = vchild.key;
      let child;
      if ( key ) {
        if ( keyed[ key ] ) {
          child = keyed[ key ];
          keyed[ key ] = undefined;
        }
      } else if ( min < childrenLen ) {
        for ( let j = min; j < childrenLen; j++ ) {
          let c = children[ j ];
          if ( c && isSameNodeType( c, vchild ) ) {
            child = c;
            children[ j ] = undefined;
            if ( j === childrenLen - 1 ) childrenLen--;
            if ( j === min ) min++;
            break;
          }
        }
      }
      child = diffNode( child, vchild );
      const f = domChildren[ i ];
      if ( child && child !== dom && child !== f ) {
        if ( !f ) {
          dom.appendChild(child);
        } else if ( child === f.nextSibling ) {
          removeNode( f );
        } else {
          dom.insertBefore( child, f );
        }
      }

    }
  }
}

function diffAttribute(dom, vnode) {
  // const domArr = dom.attributes
  const oldAttrs = {}
  const newAttrs = vnode.attrs
  const { attribute = [] } = dom;
  [...attribute].forEach(item => {
    oldAttrs[item.name] = item.value
  })

  // 属性-移除（如果老的属性，在新属性上不存在，则移除）
  for (let key in oldAttrs) {
    if (!(key in newAttrs)) {
      setAttribute(dom, key, undefined) // 移除属性
    }
  }

  // 属性更新&新增
  for (let key in newAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      setAttribute(dom, key, newAttrs[key])
    }
  }
  console.log(dom, newAttrs)
  return dom
}

function isSameNodeType(dom, vnode) {
  if ( typeof vnode === 'string' || typeof vnode === 'number' ) {
    return dom.nodeType === 3;
  }

  if ( typeof vnode.tag === 'string' ) {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }

  return dom && dom._component && dom._component.constructor === vnode.tag;
}
