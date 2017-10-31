/* eslint-disable */

import React, { Component } from 'react'

import { getSpotifyUrl, getMeInformation, search, getRelatedArtist } from 'api'

import { FlexVerticalCenter, AppContainer } from 'components/style'

import { getItemFromStorage, storeItem } from 'helpers/localStorage'

import Button from 'components/button'
import TextInput from 'components/textInput'
import Text from 'components/text'

// eslint-disable-next-line
class Search extends Component {
  // eslint-disable-next-line
  constructor() {
    // eslint-disable-next-line
    super()
    // eslint-disable-next-line
    this.state = {
      id: '-----------',
      spotifyUrl: getSpotifyUrl(),
      songSearchText: 'muse'
    }

    const hash = window.location.hash
    const splithash = hash => hash.split('=')

    if (window.location.pathname.includes('callback')) {
      storeItem({ key: 'token', item: splithash(hash)[1] })
      this.state = Object.assign({}, this.state, {
        token: splithash(hash)[1],
        type: splithash(hash)[2].split('&')[0]
      })
    } else {
      const token = getItemFromStorage('token')
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

  handleSongTextChange = e => {
    e.preventDefault()
    this.setState({ songSearchText: e.target.value })
  }

  render() {
    const { id, songSearchText } = this.state

    return (
      <AppContainer>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <FlexVerticalCenter>
            <Text size="large" text={`Hello, ${id}`} />
            <Text size="medium" text={'Please enter a song to get started'} />
            <TextInput
              onChange={this.handleSongTextChange}
              value={songSearchText}
            />
            <Button onClick={this.searchTrack} text={'Search'} />
          </FlexVerticalCenter>
        </div>
      </AppContainer>
    )
  }
}

export default Search
