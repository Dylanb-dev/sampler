/* eslint-disable */

import React from 'react'
import renderer from 'react-test-renderer'

import Text from './'

test('Text renders correctly', () => {
  const props = { size: 'small', text: 'test' }

  const tree = renderer.create(<Text {...props} />).toJSON()

  expect(tree).toMatchSnapshot()
})
