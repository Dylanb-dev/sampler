/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

const TextInput = ({ value, onChange }) => (
  <input
    style={{
      margin: '16px',
      padding: '16px',
      fontSize: '16px',
      borderRadius: '32px',
      border: 'none',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease 0s',
      width: 'calc(100% - 64px)'
    }}
    value={value}
    onChange={onChange}
  />
)

// eslint-disable-next-line
TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

// eslint-disable-next-line
TextInput.defaultProps = {}

export default pure(TextInput)
