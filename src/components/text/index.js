/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import PropTypes from 'prop-types'
import { pure, compose } from 'recompose'

export const TextSizes = {
  small: '12px',
  medium: '18px',
  large: '24px'
}

const TextPure = ({ size, text, isBlur }) => (
  <div
    style={{
      color: `${isBlur ? 'transparent' : 'white'}`,
      margin: '8px',
      fontSize: TextSizes[size],
      textShadow: `0 0 ${isBlur ? '8px' : '0'} rgba(255,255,255,0.5)`,
      transition: '400ms ease 50ms'
    }}
  >
    {text}
  </div>
)

// eslint-disable-next-line
TextPure.propTypes = {
  size: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isBlur: PropTypes.bool
}

// eslint-disable-next-line
TextPure.defaultProps = { isBlur: false }

const Text = compose(pure)(TextPure)

export default Text
