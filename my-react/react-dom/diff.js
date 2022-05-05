/*
 * @Author: guohao043
 * @Date: 2022-05-04 10:32:36
 * @LastEditors: guohao043
 * @LastEditTime: 2022-05-04 23:44:12
 * @Description: desc
 */


import {setAttribute, createComponent, setComponentProps } from "./index";

export function diff(dom, vnode, container) {
  // 对比节点后的变化
  const res = diffNode(dom, vnode)
  if (container) {
    container.appendChild(res);
  }
  return res
}

// 比较更新前后dom变化(相同层级进行比较)
export function diffNode(dom, vnode) {
  let res = dom
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }
  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {  // !!! textContent大小写错误，导致DEBUG三小时
        dom.textContent = vnode // 文本不一致更新文本
      }
    } else {
      res = document.createTextNode(vnode)
      if (dom && dom.parentNode) {  // 已经挂载到父节点上
        dom.parentNode.replaceNode(res, dom)
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
  if (vnode.children && vnode.children.length > 0 || (res.childNodes && res.childNodes.length > 0)) {
    // 对比子节点
    diffChildren(res, vnode.children)
  }
  diffAttribute(res, vnode)
  return res
}

// export function diffNode(dom, vnode) {
//   let out = dom
//   if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''
//   if (typeof vnode === 'number') vnode = String(vnode)
//   if (typeof vnode === 'string') {
//     if (dom && dom.nodeType === 3) {
//       //
//       if (dom.textContent !== vnode) {
//         dom.textContent = vnode
//       }
//     } else {
//       // 其他节点替换文本节点
//       out = document.createTextNode(vnode)
//       if (dom && dom.parentNode) {
//         dom.parentNode.replaceNode(out, dom)
//       }
//     }
//     return out
//   }
//
//   //
//   if(typeof vnode.tag === 'function'){
//     return diffComponent(out,vnode)
//   }
//   // 非文本
//   // 当前不存在dom节点
//   if (!dom) {
//     out = document.createElement(vnode.tag)
//   }
//
//   // 比较子节点（dom节点和组件）
//   if(vnode.children && vnode.children.length>0 || (out.childNodes && out.childNodes.length > 0)){
//     // 对比子节点
//     diffChildren(out,vnode.children)
//   }
//
//   diffAttribute(out, vnode)
//   return out
// }

function diffComponent(dom, vnode) {
  let comp = dom  // 更名处理
  // 查看原型是否有变化，判断组件是否切换
  if (comp && comp.constructor === comp.tag) {
    setComponentProps(comp, vnode.attrs)  // 重新给组件设置
    dom = comp.base  // 将渲染好的真实节点重新赋值给
  } else {
    // 组件已切换
    // 1. 移除旧组件
    if (comp) {
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

// 对比子节点
function diffChildren(dom, vchildren) {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};
  // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开
  if (domChildren.length > 0) {
    [...domChildren].forEach(item => {
      // 获取key
      console.log(item.textContent)
      const key = item.key;
      if (key) {
        // 如果key存在,保存到对象中
        keyed[key] = item;
      } else {
        // 如果key不存在,保存到数组中
        children.push(item)
      }
    })
  }
  console.log('vchildren', vchildren)
  if (vchildren && vchildren.length > 0) {
    let min = 0;
    let childrenLen = children.length; //2
    [...vchildren].forEach((vchild, i) => {
      // 获取虚拟DOM中所有的key
      const key = vchild.key;
      let child;
      if (key) {
        // 如果有key,找到对应key值的节点
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        // alert(1);
        // 如果没有key,则优先找类型相同的节点
        for (let j = min; j < childrenLen; j++) {
          let c = children[j];
          if (c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }
      // 对比
      child = diffNode(child, vchild);
      // 更新DOM
      const f = domChildren[i];
      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child);
          // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
        } else if (child === f.nextSibling) {
          removeNode(f);
          // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
          dom.insertBefore(child, f);
        }
      }
    })
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
  return dom
}


