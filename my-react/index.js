/*
 * @Author: guohao043
 * @Date: 2022-05-04 14:23:50
 * @LastEditors: guohao043
 * @LastEditTime: 2022-05-04 22:50:19
 * @Description: desc
 */

import React from './react'
import ReactDOM from "./react-dom";
// const app = <div className='active' title='123'>
//   <span>个人的手写DOM</span>
// </div>

// function Home() {
//   return (
//     <div className='active' title='456'>
//       我是Home
//       <span>123</span>
//     </div>
//   )
// }
//
// class Shop extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       count: 0
//     }
//   }
//
//   componentWillMount() {
//     console.log('will mount')
//   }
//
//   componentWillReceiveProps(props) {
//     console.log('wiil receive props', props)
//   }
//
//   componentWillUpdate() {
//     console.log('will update')
//   }
//
//   componentDidUpdate() {
//     console.log('did mount')
//   }
//
//   componentDidMount() {
//     console.log('did mount')
//   }
//
//   onClickBtn() {
//     this.setState({
//       count: this.state.count + 1
//     })
//   }
//
//   render() {
//     return (
//       <div>
//         <span>{this.state.count}</span>
//         <button onClick={this.onClickBtn.bind(this)}>123</button>
//       </div>
//     )
//   }
// }

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  componentWillMount() {
    console.log('组件将要加载')
  }
  componentWillReceiveProps() {
    console.log('组件将要接受数据')
  }
  componentWillUpdate() {
    console.log('组件将要更新')
  }
  componentDidUpdate() {
    console.log('组件更新完成')
  }
  componentDidMount() {
    console.log('组件加载完成')
  }
  handleClick() {
    console.log('xx')
    // <button onClick={this.handleClick.bind(this)}>touch me</button>
    // 网页版不支持这样写
    // 先同步写，后续异步
    this.setState({
      count: this.state.count + 1
    })
  }
  render() {
    return (
      <div className="active" title="123">
        Hello,
        <span>React {this.state.count}</span>
        <button onClick={this.handleClick.bind(this)}>touch me</button>
      </div>
    )
  }
}


// JSX
// ReactDOM.render(app, document.getElementById('root'))
// 函数组件
ReactDOM.render(<Home title='123'/>, document.getElementById('root'))
// 类组件
// ReactDOM.render(<Shop title='123'/>, document.getElementById('root'))
