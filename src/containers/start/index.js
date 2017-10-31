import React from 'react'

import { getSpotifyUrl } from 'api'

import { FlexVerticalCenter, AppContainer } from 'components/style'

import { getItemFromStorage, clearStorage } from 'helpers/localStorage'
import MDSpinner from 'react-md-spinner'
import { lifecycle, compose, pure } from 'recompose'

import Text from '../../components/text'

const StartPure = () => (
  <AppContainer>
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <FlexVerticalCenter>
        <Text size="large" text={'Sampler App'} />
        <MDSpinner singleColor="green" />
      </FlexVerticalCenter>
    </div>
  </AppContainer>
)

const Start = compose(
  lifecycle({
    componentDidMount() {
      clearStorage()
      window.location = getSpotifyUrl()
    }
  }),
  pure
)(StartPure)

export default Start
