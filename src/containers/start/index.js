import React from 'react'
import MDSpinner from 'react-md-spinner'
import { lifecycle, compose, pure } from 'recompose'

import { getSpotifyUrl } from 'api'
import { FlexVerticalCenter, AppContainer } from 'components/style'
import { clearStorage } from 'helpers/localStorage'
import Text from 'components/text'

const StartPure = () => (
  <AppContainer>
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <FlexVerticalCenter>
        <MDSpinner singleColor="white" />
        <Text size="medium" text={'Getting ready...'} />
      </FlexVerticalCenter>
    </div>
  </AppContainer>
)

const Start = compose(
  lifecycle({
    componentDidMount() {
      // eslint-disable-next-line
      clearStorage()
      // eslint-disable-next-line
      return (window.location = getSpotifyUrl())
    }
  }),
  pure
)(StartPure)

export default Start
