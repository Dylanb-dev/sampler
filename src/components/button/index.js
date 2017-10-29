/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

const Button = ({ text, onClick, secondary, isBlur }) => (
  <button
    onClick={onClick}
    style={{
      fontSize: '16px',
      padding: '16px',
      textTransform: 'upperCase',
      color: isBlur ? 'transparent' : secondary ? 'black' : 'white',
      textShadow: `0 0 ${isBlur ? '8px' : '0'} ${secondary
        ? 'rgba(0,0,0,0.5)'
        : 'rgba(255,255,255,0.5)'}`,
      borderRadius: '32px',
      border: isBlur ? 'none' : '1px solid green',
      background: isBlur
        ? secondary ? 'rgba(255,255,255,0.1)' : 'rgba(0,128,0,0.1)'
        : secondary ? 'white' : 'green',
      boxShadow: isBlur ? 'none' : '0px 8px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease 0s'
    }}
  >
    {text}
  </button>
)

// eslint-disable-next-line
Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  secondary: PropTypes.bool,
  isBlur: PropTypes.bool
}

// eslint-disable-next-line
Button.defaultProps = { secondary: false, isBlur: false }

export default pure(Button)
