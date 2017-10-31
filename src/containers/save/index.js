/* eslint-disable */

import React, { Component } from 'react'
import { ScrollView } from 'react-native-web'
import {
  getSpotifyUrl,
  getMeInformation,
  createPlaylist,
  search,
  getRelatedArtist,
  addTracksToPlaylist
} from 'api'
import { Motion, spring } from 'react-motion'
import { isEmpty, isEqual } from 'lodash/fp'
import Modal from 'react-modal'
import MDSpinner from 'react-md-spinner'
import format from 'date-fns/format'

import { AppContainer } from 'components/style'

import Button from 'components/button'
import TextInput from 'components/textInput'

const springSetting1 = { stiffness: 180, damping: 10 }
const [count, width, height] = [11, 70, 90]

const randomNumber = maxLen => Math.floor(Math.random() * (maxLen + 1))

// eslint-disable-next-line
class App extends Component {
  // eslint-disable-next-line
  constructor() {
    // eslint-disable-next-line
    super()
    // eslint-disable-next-line
    this.state = {
      id: '-----------',
      mouseXY: [0, 0],
      savePlaylist: false,
      isPressed: false,
      mouseCircleDelta: [0, 0],
      appWidth: Math.min(420, window.innerWidth),
      spotifyUrl: getSpotifyUrl(),
      songArray: [],
      currentSong: {},
      songSearchText: 'muse',
      songSearchSuggestions: [],
      playlistName: `Sampler ${format(new Date(), 'MM/DD/YYYY')}`,
      playAudio: false
    }
    const hash = window.location.hash
    const splithash = hash => hash.split('=')

    if (window.location.pathname.includes('callback')) {
      window.localStorage.setItem('token', splithash(hash)[1])
      this.state = Object.assign({}, this.state, {
        token: splithash(hash)[1],
        type: splithash(hash)[2].split('&')[0]
      })
    } else if (window.location.pathname.includes('save')) {
      this.state.saving = true

      const id = window.localStorage.getItem('id')
      const token = window.localStorage.getItem('token')

      const songArray = JSON.parse(window.localStorage.getItem('songArray'))
      const songUris = songArray.map(o => o.uri)
      const playlistName = window.localStorage.getItem('playlistName')

      createPlaylist({ type: 'Bearer', token })({
        id,
        playlist: playlistName
      })
        .chain(res =>
          addTracksToPlaylist({ type: 'Bearer', token })({
            id,
            playlistId: res.id,
            tracksUriArray: songUris
          })
        )
        .fork(console.error, () => (window.location = '/'))
    } else {
      const token = window.localStorage.getItem('token')
      if (token && token.length > 0) {
        this.state = Object.assign({}, this.state, {
          token: token,
          type: 'Bearer'
        })
      } else {
        window.location = this.state.spotifyUrl
      }
    }
  }

  componentDidMount() {
    const { type, token } = this.state
    // eslint-disable-next-line
    window.addEventListener('touchmove', this.handleTouchMove)
    // eslint-disable-next-line
    window.addEventListener('touchend', this.handleMouseUp)
    // eslint-disable-next-line
    window.addEventListener('mousemove', this.handleMouseMove)
    // eslint-disable-next-line
    window.addEventListener('mouseup', this.handleMouseUp)

    if (window.location.pathname.includes('save')) {
      // window.location = '/'
    } else {
      getMeInformation({ type, token }).fork(console.error, res => {
        if (res.error) {
          return (window.location = this.state.spotifyUrl)
        }
        window.localStorage.setItem('id', res.id)
        this.setState({ id: res.id })
      })
    }
  }

  handleTouchStart = (pressLocation, e) =>
    this.handleMouseDown(pressLocation, e.touches[0])

  handleTouchMove = e => {
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

  searchTrack = () => {
    const { type, token, songSearchText } = this.state
    if (songSearchText.length > 0) {
      search({ type, token })(songSearchText).fork(console.error, res =>
        this.setState({
          currentSong: res.tracks.items
            .filter(o => o.preview_url)
            .sort((a, b) => a.popularity - b.popularity)[0],
          playAudio: true
        })
      )
    }
  }

  playNextSong = () => {
    const { type, token, currentSong, songArray } = this.state

    let index = songArray.length - 1
    this.setState({ playAudio: false })

    return getRelatedArtist({ type, token })(currentSong.artists[0].id)
      .chain(artistRes =>
        search({ type, token })(
          artistRes.artists.length > 1
            ? artistRes.artists[randomNumber(artistRes.artists.length - 1)].name
            : currentSong.name
        )
      )
      .fork(console.error, res =>
        this.setState({
          currentSong: res.tracks.items
            .filter(o => o.preview_url)
            .filter(o => !isEqual(o, songArray[index]))
            .sort((a, b) => a.popularity - b.popularity)[0],
          playAudio: true
        })
      )
  }

  resetAlbumPostion = () =>
    this.setState({
      isPressed: false,
      mouseCircleDelta: [0, 0],
      mouseXY: [0, 0]
    })

  handleMouseUp = () => {
    const { appWidth, mouseXY, songArray, currentSong } = this.state
    const [x, y] = mouseXY

    if (this.isAccept({ x, appWidth })) {
      this.setState({ songArray: [...songArray, currentSong] })
      this.resetAlbumPostion()
      return this.playNextSong()
    }
    if (this.isDecline({ x, appWidth })) {
      this.resetAlbumPostion()
      return this.playNextSong()
    }
    return this.resetAlbumPostion()
  }

  isAccept = ({ x, appWidth }) => x > (appWidth - 128 * 1.2) / 2 - 10
  isDecline = ({ x, appWidth }) => x < -((appWidth - 128 * 1.2) / 2 - 10)

  handleSongTextChange = e => {
    e.preventDefault()
    this.setState({ songSearchText: e.target.value })
  }

  handlePlaylistTextChange = e => {
    e.preventDefault()
    this.setState({ playlistName: e.target.value })
  }

  savePlaylist = () => {
    const { type, token, id, songArray, playlistName } = this.state
    if (playlistName.length > 0) {
      this.setState({ saving: true })
      window.localStorage.setItem('playlistName', playlistName)
      window.localStorage.setItem('songArray', JSON.stringify(songArray))
      window.location = '/save'
    }
  }

  render() {
    const {
      appWidth,
      mouseXY,
      isPressed,
      spotifyUrl,
      id,
      playAudio,
      songSearchText,
      currentSong,
      songArray,
      saving,
      savePlaylist,
      playlistName
    } = this.state
    const [x, y] = mouseXY

    const maxX = (appWidth - 134 * 1.2) / 2
    const minX = -((appWidth - 128 * 1.2) / 2)

    const maxY = 150
    const minY = -150

    const hasCallback = window.location.hash.length > 0

    const style = isPressed
      ? {
          translateX: Math.max(minX, Math.min(maxX, x)),
          translateY: Math.max(minY, Math.min(maxY, y)),
          scale: spring(1.2, springSetting1),
          boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
        }
      : {
          translateX: 0,
          translateY: 0,
          scale: spring(1.0, springSetting1),
          boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
        }
    return (
      <AppContainer>
        <Modal
          isOpen={saving}
          onAfterOpen={() => {}}
          onRequestClose={() => {}}
          contentLabel="SavingModal"
          style={{
            content: {
              background: 'rgb(57, 57, 57)',
              borderRadius: '32px',
              top: '8px',
              left: '8px',
              right: '8px',
              bottom: '8px'
            }
          }}
        >
          <FlexVerticalCenter>
            <MDSpinner singleColor="green" />
            <LargeText text={'Saving your playlist...'} isBlur={false} />
          </FlexVerticalCenter>
        </Modal>
      </AppContainer>
    )
  }
}

const AlbumArtIcon = ({ imgUrl, onStart, onEnd }) => (
  <div
    role="presentation"
    style={{
      height: '128px',
      width: '128px',
      margin: '32px',
      borderRadius: '100%'
    }}
    onMouseDown={onStart}
    onMouseUp={onEnd}
  />
)

const SongText = ({ song, isBlur }) => (
  <div
    style={{
      color: `${isBlur ? 'transparent' : 'white'}`,
      margin: '8px',
      fontSize: '24px',
      textShadow: `0 0 ${isBlur ? '8px' : '0'} rgba(255,255,255,0.5)`,
      transition: '400ms ease 50ms'
    }}
  >
    {song}
  </div>
)

const LargeText = ({ artist, isBlur }) => (
  <div
    style={{
      color: `${isBlur ? 'transparent' : 'white'}`,
      margin: '8px',
      fontSize: '18px',
      textShadow: `0 0 ${isBlur ? '8px' : '0'} rgba(255,255,255,0.5)`,
      transition: '400ms ease 50ms'
    }}
  >
    {artist}
  </div>
)

export default App
