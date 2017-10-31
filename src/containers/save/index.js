import React from 'react'
import Modal from 'react-modal'
import MDSpinner from 'react-md-spinner'

import { AppContainer, FlexVerticalCenter } from 'components/style'
import Text from 'components/text'

const SavePure = ({ saving }) => (
  <AppContainer>
    <Modal
      isOpen={saving}
      onAfterOpen={() => true}
      onRequestClose={() => true}
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
        <Text size="large" text={'Saving your playlist...'} isBlur={false} />
      </FlexVerticalCenter>
    </Modal>
  </AppContainer>
)

export default SavePure
