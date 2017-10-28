/* eslint-disable */

import React, { Component } from 'react'
import { ScrollView } from 'react-native-web'
import {
  getSpotifyUrl,
  getMeInformation,
  createPlaylist,
  search,
  getPubPermissionsUrl,
  getRelatedArtist,
  addTracksToPlaylist
} from './spotify'
import { Motion, spring } from 'react-motion'
import { isEmpty, isEqual } from 'lodash/fp'
import Modal from 'react-modal'
import MDSpinner from 'react-md-spinner'
import format from 'date-fns/format'

import './App.css'

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
      publicUrl: getPubPermissionsUrl(),
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
      if (token.length > 0) {
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
      console.log('accept')
      this.setState({ songArray: [...songArray, currentSong] })
      this.resetAlbumPostion()
      return this.playNextSong()
    }
    if (this.isDecline({ x, appWidth })) {
      console.log('refuse')
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
    const { type, token, id, songArray, publicUrl, playlistName } = this.state
    if (playlistName.length > 0) {
      this.setState({ saving: true })
      window.localStorage.setItem('playlistName', playlistName)
      window.localStorage.setItem('songArray', JSON.stringify(songArray))
      window.location = publicUrl
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
    console.log(this.state.publicUrl)
    // console.log(currentSong)
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
          isOpen={savePlaylist}
          onAfterOpen={() => {}}
          onRequestClose={() => this.setState({ savePlaylist: false })}
          contentLabel="SavePlaylistModal"
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
            {songArray.map(console.log)}
            <ScrollView
              style={{
                height: 'calc(100vh - 136px)',
                marginBottom: '16px',
                borderRadius: '32px',
                width: '100%'
              }}
            >
              {songArray.map(o => (
                <div
                  key={o.id}
                  style={{
                    width: 'calc(100% - 36px)',
                    padding: '8px 16px',
                    margin: '4px',
                    borderRadius: '32px',
                    backgroundColor: 'green',
                    color: 'white'
                  }}
                >
                  <p>{`${o.artists.map(o => o.name)}`}</p> <p>{`${o.name}`}</p>
                  <p>{`${o.album.name}`}</p>
                </div>
              ))}
            </ScrollView>
            <TextInput
              onChange={this.handlePlaylistTextChange}
              value={playlistName}
            />
            <div style={{ width: '192px' }}>
              <Flex>
                <Button
                  onClick={() => this.setState({ savePlaylist: false })}
                  secondary
                  text={'Back'}
                />
                <Button onClick={this.savePlaylist} text={'Save'} />
              </Flex>
            </div>
          </FlexVerticalCenter>
        </Modal>
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
            <ArtistText artist={'Saving your playlist...'} isBlur={false} />
          </FlexVerticalCenter>
        </Modal>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {isEmpty(currentSong) && songArray.length === 0 ? (
            <FlexVerticalCenter>
              <SongText song={`Hello, ${id}`} isBlur={false} />
              <ArtistText
                artist={'Please enter a song to get started'}
                isBlur={false}
              />
              <TextInput
                onChange={this.handleSongTextChange}
                value={songSearchText}
              />
              <Button onClick={this.searchTrack} text={'Search'} />
            </FlexVerticalCenter>
          ) : (
            <FlexBetween>
              <ColumnSection>
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: `${isPressed &&
                    this.isDecline({ x, appWidth })
                      ? 'red'
                      : 'transparent'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      color: `${isPressed ? 'white' : 'transparent'}`,
                      fontSize: '24px',
                      marginTop: '22px',
                      transition: '400ms ease 50ms'
                    }}
                  >
                    X
                  </div>
                </div>
              </ColumnSection>

              <ColumnSection>
                {playAudio && (
                  <audio autoPlay className="player" preload="false">
                    <source src={currentSong.preview_url} />
                  </audio>
                )}
                <ArtistText artist={id} isBlur={isPressed} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '-64px',
                    marginRight: '-64px',
                    height: 'calc(100vh - 400px)'
                  }}
                >
                  <SongText song={currentSong.name} isBlur={isPressed} />
                  <ArtistText
                    artist={currentSong.artists[0].name}
                    isBlur={isPressed}
                  />
                </div>

                <Motion style={style}>
                  {({ translateX, translateY, scale, boxShadow }) => (
                    <div
                      onMouseDown={this.handleMouseDown.bind(null, [x, y])}
                      onTouchStart={this.handleTouchStart.bind(null, [x, y])}
                      style={{
                        borderRadius: '100%',
                        WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                        boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                        backgroundImage: `url(${currentSong.album.images[0]
                          .url})`,
                        height: '128px',
                        width: '128px',
                        margin: '32px',
                        backgroundSize: 'cover'
                      }}
                    />
                  )}
                </Motion>
                <ArtistText artist={'^^ Touch album ^^'} isBlur={isPressed} />
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginLeft: '-64px',
                    marginRight: '-64px',
                    height: '100px'
                  }}
                >
                  <Button
                    onClick={() =>
                      this.setState({ currentSong: {}, songArray: [] })}
                    secondary
                    text={'Back'}
                    isBlur={isPressed}
                  />

                  <Button
                    onClick={() => this.setState({ savePlaylist: true })}
                    text={'Save'}
                    isBlur={isPressed}
                  />
                </div>
              </ColumnSection>
              <ColumnSection>
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: `${isPressed &&
                    this.isAccept({ x, appWidth })
                      ? 'green'
                      : 'transparent'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      color: `${isPressed ? 'white' : 'transparent'}`,
                      fontSize: '24px',
                      marginTop: '22px',
                      transition: '400ms ease 50ms'
                    }}
                  >
                    {'\u2714'}
                  </div>
                </div>
              </ColumnSection>
            </FlexBetween>
          )}
        </div>
      </AppContainer>
    )
  }
}

const ColumnSection = ({ children }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      width: '100%'
    }}
  >
    {children}
  </div>
)

const AppContainer = ({ children }) => (
  <div
    style={{
      background: 'linear-gradient(#146E14,#181818)',
      height: '100%',
      minHeight: '100vh',
      maxHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    }}
  >
    {children}
  </div>
)

const FlexBetween = ({ children }) => (
  <div
    style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'space-between'
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
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}
  >
    {children}
  </div>
)

const Flex = ({ children }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-around'
    }}
  >
    {children}
  </div>
)
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

const ArtistText = ({ artist, isBlur }) => (
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

const TextInput = ({ value, onChange, suggestions }) => (
  <input
    style={{
      margin: '16px',
      padding: '16px',
      fontSize: '16px',
      borderRadius: '32px',
      border: 'none',
      margin: '16px',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease 0s',
      width: 'calc(100% - 64px)'
    }}
    value={value}
    onChange={onChange}
  />
)

const Button = ({ text, onClick, secondary, isBlur }) => (
  <button
    onClick={onClick}
    style={{
      fontSize: '16px',
      padding: '16px',
      textTransform: 'upperCase',
      color: isBlur ? 'transparent' : secondary ? 'black' : 'white',
      textShadow: `0 0 ${isBlur ? '8px' : '0'} ${secondary
        ? 'rgba(0,0,0,0.5)'
        : 'rgba(255,255,255,0.5)'}`,
      borderRadius: '32px',
      border: isBlur ? 'none' : '1px solid green',
      background: isBlur
        ? secondary ? 'rgba(255,255,255,0.1)' : 'rgba(0,128,0,0.1)'
        : secondary ? 'white' : 'green',
      boxShadow: isBlur ? 'none' : '0px 8px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease 0s'
    }}
    children={text}
  />
)
export default App
