/* eslint-disable */

import React from 'react'
import renderer from 'react-test-renderer'

import Modal from './'

test('Modal renders correctly', () => {
  const props = {}

  const tree = renderer.create(<Modal {...props} />).toJSON()

  expect(tree).toMatchSnapshot()
})
