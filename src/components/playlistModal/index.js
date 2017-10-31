/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import PropTypes from 'prop-types'
import { pure, compose } from 'recompose'

import { ScrollView } from 'react-native-web'
import Modal from 'react-modal'
import MDSpinner from 'react-md-spinner'

import noop from 'lodash/fp/noop'

import { FlexVerticalCenter, Flex } from '../style'
import Text from '../text'
import TextInput from '../textInput'
import Button from '../button'

export const PlaylistModalPure = ({
  isOpen,
  onClose,
  onSave,
  saving,
  songArray,
  playlistName,
  onChangePlaylist
}) => (
  <Modal
    isOpen={isOpen}
    onAfterOpen={noop}
    onRequestClose={onClose}
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
    {saving ? (
      <FlexVerticalCenter>
        <MDSpinner singleColor="green" />
        <Text size="medium" text={'Saving your playlist...'} />
      </FlexVerticalCenter>
    ) : (
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
        <TextInput onChange={onChangePlaylist} value={playlistName} />
        <div style={{ width: '192px' }}>
          <Flex>
            <Button onClick={onClose} secondary text={'Back'} />
            <Button onClick={onSave} text={'Save'} />
          </Flex>
        </div>
      </FlexVerticalCenter>
    )}
  </Modal>
)

// eslint-disable-next-line
PlaylistModalPure.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  songArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  playlistName: PropTypes.string.isRequired,
  onChangePlaylist: PropTypes.func.isRequired
}

// eslint-disable-next-line
PlaylistModalPure.defaultProps = {}

const PlaylistModal = compose(pure)(PlaylistModalPure)

export default PlaylistModal
