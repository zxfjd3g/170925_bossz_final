/*
提示找不到页面的UI路由组件
 */
import React from "react"
import {Button} from "antd-mobile"

/*
请求路径找不到的提示组件
 */
class NotFound extends React.Component {
  render() {
    return (
      <div>
        <div className="center">
          <h2>抱歉，找不到该页面!</h2>
          <Button
            type="primary"
            size="small"
            onClick={() => this.props.history.push("/")}
          >
            回到首页
          </Button>
        </div>
      </div>
    )
  }
}

export default NotFound