import React from 'react'
import MDSpinner from 'react-md-spinner'
import * as R from 'ramda'
import { lifecycle, compose, pure } from 'recompose'

import { getSpotifyUrl } from 'api'
import { FlexVerticalCenter, AppContainer } from 'components/style'
import { clearStorage } from 'helpers/localStorage'
import { redirect } from 'helpers/window'
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

const RedirectToSpotifyUrl = R.compose(redirect, getSpotifyUrl)

const Start = compose(
  lifecycle({
    componentDidMount() {
      return clearStorage.fork(() => redirect('/'), RedirectToSpotifyUrl)
    }
  }),
  pure
)(StartPure)

export default Start
