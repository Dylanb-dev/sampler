/* eslint-disable */

import React from 'react'
import renderer from 'react-test-renderer'

import PlaylistModal from './'

test('PlaylistModal renders correctly', () => {
  const props = {}

  const tree = renderer.create(<PlaylistModal {...props} />).toJSON();

  expect(tree).toMatchSnapshot()
})
