/* eslint-disable */

import React, { Component } from 'react'

import { getSpotifyUrl, getMeInformation, search, getRelatedArtist } from 'api'

import {
  FlexBetween,
  FlexVerticalCenter,
  Flex,
  ColumnSection,
  AppContainer
} from 'components/style'

import Button from 'components/button'
import TextInput from 'components/textInput'

import {
  clearStorage,
  getItemFromStorage,
  storeItem,
  removeItemFromStorage
} from 'helpers/localStorage'

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
      playAudio: false
    }
    const hash = window.location.hash
    const splithash = hash => hash.split('=')

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

  componentDidMount() {
    const { type, token } = this.state

    getMeInformation({ type, token }).fork(console.error, res => {
      if (res.error) {
        return (window.location = this.state.spotifyUrl)
      }
      storeItem({ key: 'id', item: res.id })
      this.setState({ id: res.id })
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
                  <p>{`${o.name}`}</p>
                  <p style={{ fontSize: '12px' }}>{`${o.artists.map(
                    o => o.name
                  )}`}</p>
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

export default App
