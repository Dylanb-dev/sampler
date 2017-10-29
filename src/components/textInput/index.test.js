/* eslint-disable */

import React from 'react'
import renderer from 'react-test-renderer'

import TextInput from './'

test('TextInput renders correctly', () => {
  const props = { value: '', onChange: () => {} }

  const tree = renderer.create(<TextInput {...props} />).toJSON()

  expect(tree).toMatchSnapshot()
})
