/*
底部导航的UI组件
 */
import React from 'react'
import PropTypes from 'prop-types'
import {TabBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

const Item = TabBar.Item

class NavFooter extends React.Component {

  static propTypes = {
    navList: PropTypes.array.isRequired,
    unread: PropTypes.number.isRequired
  }

  render() {

    const navList = this.props.navList.filter(v => !v.hide)
    const {pathname} = this.props.location
    return (
      <TabBar>
        {navList.map(v => (
          <Item
            badge={v.path === '/msg' ? this.props.unread : 0}
            key={v.path}
            title={v.text}
            icon={{uri: require(`./img/${v.icon}.png`)}}
            selectedIcon={{uri: require(`./img/${v.icon}-active.png`)}}
            selected={pathname === v.path}
            onPress={() => {
              this.props.history.replace(v.path)
            }}
          >
          </Item>
        ))}
      </TabBar>
    )
  }
}

export default withRouter(NavFooter)