/* eslint-disable */

import React from 'react'
import renderer from 'react-test-renderer'

import {
  FlexBetween,
  FlexVerticalCenter,
  Flex,
  ColumnSection,
  AppContainer
} from './'

test('FlexBetween renders correctly', () => {
  const tree = renderer
    .create(
      <FlexBetween>
        <div />
        <div />
      </FlexBetween>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

test('FlexVerticalCenter renders correctly', () => {
  const tree = renderer
    .create(
      <FlexVerticalCenter>
        <div />
        <div />
      </FlexVerticalCenter>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

test('Flex renders correctly', () => {
  const tree = renderer
    .create(
      <Flex>
        <div />
        <div />
      </Flex>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

test('ColumnSection renders correctly', () => {
  const tree = renderer
    .create(
      <ColumnSection>
        <div />
        <div />
      </ColumnSection>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

test('AppContainer renders correctly', () => {
  const tree = renderer
    .create(
      <AppContainer>
        <div />
        <div />
      </AppContainer>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
