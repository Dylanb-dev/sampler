/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

export const FlexBetween = pure(({ children }) => (
  <div
    style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'space-between'
    }}
  >
    {children}
  </div>
))

export const FlexVerticalCenter = pure(({ children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}
  >
    {children}
  </div>
))

export const Flex = pure(({ children }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-around',
      width: '100%'
    }}
  >
    {children}
  </div>
))

export const ColumnSection = pure(({ children }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      width: '100%'
    }}
  >
    {children}
  </div>
))

export const AppContainer = pure(({ children }) => (
  <div
    style={{
      background: 'linear-gradient(#146E14,#181818)',
      height: '100%',
      minHeight: '100vh',
      maxHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    }}
  >
    {children}
  </div>
))

// eslint-disable-next-line
FlexBetween.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired
}

// eslint-disable-next-line
FlexVerticalCenter.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired
}

// eslint-disable-next-line
Flex.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired
}

// eslint-disable-next-line
ColumnSection.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired
}

// eslint-disable-next-line
AppContainer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired
}
