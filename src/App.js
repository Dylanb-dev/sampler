/* eslint-disable */

import React, { Component } from 'react'
import { getTokenSpotify } from './spotify'
import { Motion, spring } from 'react-motion'
import './App.css'

const AlbumArtIcon = ({ imgUrl, onStart, onEnd }) => (
  <div
    role="presentation"
    style={{
      height: '128px',
      width: '128px',
      margin: '32px',
      borderRadius: '100%',
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: 'cover'
    }}
    onMouseDown={onStart}
    onMouseUp={onEnd}
  />
)

const SongText = ({ song }) => (
  <div style={{ color: 'white', margin: '8px', fontSize: '32px' }}>{song}</div>
)

const ArtistText = ({ artist }) => (
  <div style={{ color: 'white', margin: '8px', fontSize: '24px' }}>
    {artist}
  </div>
)

const springSetting1 = { stiffness: 180, damping: 10 }
const [count, width, height] = [11, 70, 90]
// eslint-disable-next-line
class App extends Component {
  // eslint-disable-next-line
  constructor() {
    // eslint-disable-next-line
    super()
    // eslint-disable-next-line
    this.state = { mouseXY: [0, 0], isPressed: false, mouseCircleDelta: [0, 0] }
  }

  componentDidMount() {
    // eslint-disable-next-line
    window.addEventListener('touchmove', this.handleTouchMove)
    // eslint-disable-next-line
    window.addEventListener('touchend', this.handleMouseUp)
    // eslint-disable-next-line
    window.addEventListener('mousemove', this.handleMouseMove)
    // eslint-disable-next-line
    window.addEventListener('mouseup', this.handleMouseUp)
    // return getTokenSpotify().fork(console.log, console.error)
  }

  handleTouchStart = (pressLocation, e) =>
    this.handleMouseDown(pressLocation, e.touches[0])

  handleTouchMove = e => {
    e.preventDefault()
    this.handleMouseMove(e.touches[0])
  }

  handleMouseMove = ({ pageX, pageY }) => {
    const { isPressed, mouseCircleDelta: [dx, dy] } = this.state

    if (isPressed) {
      const mouseXY = [pageX - dx, pageY - dy]
      this.setState({ mouseXY })
    }
  }

  handleMouseDown = ([pressX, pressY], { pageX, pageY }) => {
    this.setState({
      isPressed: true,
      mouseCircleDelta: [pageX - pressX, pageY - pressY],
      mouseXY: [pressX, pressY]
    })
  }

  handleMouseUp = () => {
    this.setState({ isPressed: false, mouseCircleDelta: [0, 0] })
  }

  render() {
    const { mouseXY, isPressed } = this.state
    const [x, y] = mouseXY
    const style = isPressed
      ? {
          translateX: x,
          translateY: y,
          scale: spring(1.2, springSetting1),
          boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
        }
      : {
          translateX: x,
          translateY: y,
          scale: spring(1.2, springSetting1),
          boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
        }
    return (
      <AppContainer>
        <SongText song={'test song'} />
        <ArtistText artist={'test artist'} />
        <Motion style={style}>
          {({ translateX, translateY, scale, boxShadow }) => (
            <div
              onMouseDown={this.handleMouseDown.bind(null, [x, y])}
              onTouchStart={this.handleTouchStart.bind(null, [x, y])}
              className="demo2-ball"
              style={{
                WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`
              }}
            >
              <AlbumArtIcon
                imgUrl={
                  'https://i.scdn.co/image/f2798ddab0c7b76dc2d270b65c4f67ddef7f6718'
                }
              />
            </div>
          )}
        </Motion>
      </AppContainer>
    )
  }
}

const AppContainer = ({ children }) => (
  <div
    style={{
      background: 'linear-gradient(#146E14,#181818)',
      height: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    }}
  >
    {children}
  </div>
)

const FlexCenter = ({ children }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center'
    }}
  >
    {children}
  </div>
)

const FlexVerticalCenter = ({ children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}
  >
    {children}
  </div>
)

export default App
