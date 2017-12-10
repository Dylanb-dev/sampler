/* eslint-disable fp/no-class, fp/no-mutation, fp/no-nil, fp/no-this, fp/no-unused-expression, better/no-ifs, better/explicit-return,  */

import PropTypes from 'prop-types'
import React, { Component } from 'react'

class MouseEvent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPressed: false,
      mouseCircleDelta: [0, 0],
      mouseXY: []
    }
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.handleMouseMove)
    window.addEventListener('touchend', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnMount() {
    window.removeEventListener('touchmove', this.handleMouseMove)
    window.removeEventListener('touchend', this.handleMouseUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleTouchStart = (pressLocation, e) =>
    this.handleMouseDown(pressLocation, e.touches[0])

  handleTouchMove = e => {
    this.handleMouseMove(e.touches[0])
  }

  handleMouseMove = ({ pageX, pageY }) => {
    const { mouseCircleDelta: [dx, dy] } = this.state
    const mouseXY = [pageX - dx, pageY - dy]
    this.setState({ mouseXY })
  }

  handleMouseDown = ([pressX, pressY], { pageX, pageY }) => {
    this.setState({
      isPressed: true,
      mouseCircleDelta: [pageX - pressX, pageY - pressY],
      mouseXY: [pressX, pressY]
    })
  }

  render() {
    const { children, render, component } = this.props
    const { isPressed, mouseCircleDelta, mouseXY } = this.state
    const renderProp = children || render || component

    return renderProp({ isPressed, mouseCircleDelta, mouseXY })
  }
}

MouseEvent.propTypes = {
  render: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
}

const withMouseEvent = Inner => ({ ...parentProps }) => (
  <MouseEvent render={props => <Inner {...props} {...parentProps} />} />
)

export { MouseEvent, withMouseEvent }
