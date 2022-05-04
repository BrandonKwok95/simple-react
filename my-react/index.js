/*
 * @Author: guohao043
 * @Date: 2022-05-04 14:23:50
 * @LastEditors: guohao043
 * @LastEditTime: 2022-05-04 16:34:40
 * @Description: desc
 */

import React from './react'
import ReactDOM from "./react-dom";
// const app = <div className='active' title='123'>
//   <span>个人的手写DOM</span>
// </div>

function Home() {
  return (
    <div className='active' title='456'>
      我是Home
      <span>123</span>
    </div>
  )
}
console.log(<Home title='123'/>)

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }

  componentWillMount() {
    console.log('will mount')
  }

  componentWillReceiveProps(props) {
    console.log('wiil receive props', props)
  }

  componentWillUpdate() {
    console.log('will update')
  }

  componentDidUpdate() {
    console.log('did mount')
  }

  componentDidMount() {
    console.log('did mount')
  }

  onClickBtn() {
    const { count } = this.state
    this.setState({
      count: count + 1
    })
  }

  render() {
    const { count } = this.state
    return (
      <div>
        <span>{count}</span>
        <button onClick={this.onClickBtn.bind(this)}>123</button>
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
