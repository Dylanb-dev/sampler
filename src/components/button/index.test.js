/* eslint-disable */

import React from 'react'
import renderer from 'react-test-renderer'

import Button from './'

test('Button renders correctly', () => {
  const props = { text: 'test', onClick: () => {} }

  const tree = renderer.create(<Button {...props} />).toJSON()

  expect(tree).toMatchSnapshot()
})
