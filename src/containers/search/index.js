import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import {
  lifecycle,
  compose,
  pure,
  withStateHandlers,
  defaultProps
} from 'recompose'

import { getMeInformation, queryParams } from 'api'
import { redirect } from 'helpers/window'
import { FlexVerticalCenter, AppContainer } from 'components/style'
import { storeItem } from 'helpers/localStorage'
import Button from 'components/button'
import TextInput from 'components/textInput'
import Text from 'components/text'

const searchTrack = searchText =>
  redirect(`/player?${queryParams({ play: searchText })}`)

const SearchPure = ({ changeSearchText, searchText, onSearch, id }) => (
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

const getTokenFromUrl = R.compose(
  R.prop(1),
  hash => hash.split('='),
  R.prop('hash')
)

// eslint-disable-next-line
SearchPure.propTypes = {
  id: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  changeSearchText: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired
}

const Search = compose(
  pure,
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
    componentDidMount() {
      // eslint-disable-next-line
      const { location } = this.props
      return (
        storeItem({ key: 'token', item: getTokenFromUrl(location) })
          .chain(res => getMeInformation(res.item))
          .chain(res => storeItem({ key: 'id', item: res.id }))
          // eslint-disable-next-line
          .fork(() => redirect('/'), res => this.setState({ id: res.item }))
      )
    }
  })
)(SearchPure)

export default Search
