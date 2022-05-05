/*
 * @Author: guohao043
 * @Date: 2022-05-04 10:17:07
 * @LastEditors: guohao043
 * @LastEditTime: 2022-05-04 22:30:59
 * @Description: desc
 */
import Component from './component'

const React = {
  createElement, Component
}

function createElement(tag, attrs, ...children) {
  attrs = attrs || {}
  return {
    tag,
    attrs,
    children,
    key: attrs.key || null  // 标记子节点用于更新
  }
}

export default React
