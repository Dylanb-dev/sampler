import React from 'react'
import PropTypes from 'prop-types'
import {
  lifecycle,
  compose,
  pure,
  withStateHandlers,
  defaultProps
} from 'recompose'

import { getMeInformation, queryParams } from 'api'
import { FlexVerticalCenter, AppContainer } from 'components/style'
import { storeItem } from 'helpers/localStorage'
import Button from 'components/button'
import TextInput from 'components/textInput'
import Text from 'components/text'

const splithash = hash => hash.split('=')

// eslint-disable-next-line
const searchTrack = searchText =>
  // eslint-disable-next-line
  (window.location = `/player?${queryParams({ play: searchText })}`)

const SearchPure = ({ id, searchText, changeSearchText, onSearch }) => (
  <AppContainer>
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <FlexVerticalCenter>
        <Text size="large" text={`Hello, ${id}`} />
        <Text size="medium" text={'Please enter a song to get started'} />
        <TextInput onChange={changeSearchText} value={searchText} />
        <Button onClick={() => onSearch(searchText)} text={'Search'} />
      </FlexVerticalCenter>
    </div>
  </AppContainer>
)

// eslint-disable-next-line
SearchPure.propTypes = {
  id: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  changeSearchText: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired
}

const Search = compose(
  defaultProps({
    id: '-----------',
    searchText: 'muse',
    onSearch: searchTrack
  }),
  withStateHandlers(
    ({ searchText }) => ({
      searchText
    }),
    {
      changeSearchText: () => event => {
        // eslint-disable-next-line
        event.preventDefault()
        return { searchText: event.target.value }
      }
    }
  ),
  lifecycle({
    // eslint-disable-next-line
    componentDidMount() {
      // eslint-disable-next-line
      const hash = window.location.hash
      // eslint-disable-next-line
      const token = splithash(hash)[1]
      // eslint-disable-next-line
      storeItem({ key: 'token', item: token })
      // eslint-disable-next-line
      getMeInformation(token).fork(console.error, res => {
        // eslint-disable-next-line
        if (res.error) {
          // eslint-disable-next-line
          return (window.location = '/')
        }
        // eslint-disable-next-line
        storeItem({ key: 'id', item: res.id })
        // eslint-disable-next-line
        this.setState({ id: res.id })
      })
    }
  }),
  pure
)(SearchPure)

export default Search
