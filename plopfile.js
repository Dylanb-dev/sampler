/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-commonjs */

const R = require('ramda')
const fs = require('fs')
const fp = require('lodash/fp')

const relativeImportPattern = /import .+? from '\.\/.+?';/
const fileOptions = { encoding: 'utf8' }
const namePrompt = {
  type: 'input',
  name: 'name',
  message: 'Name'
}

module.exports = plop => {
  plop.addHelper('camelCase', fp.camelCase)
  plop.addHelper('upperCamelCase', fp.compose(fp.upperFirst, fp.camelCase))

  plop.setGenerator('component', {
    description: 'Reusable Component',
    prompts: [namePrompt],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{ camelCase name }}/index.js',
        templateFile: '.plop/component.txt',
        abortOnFail: true
      },
      {
        type: 'add',
        path: 'src/components/{{ camelCase name }}/index.test.js',
        templateFile: '.plop/component.test.txt',
        abortOnFail: true
      },
      {
        type: 'add',
        path: 'src/components/{{ camelCase name }}/index.css',
        templateFile: '.plop/style.txt',
        abortOnFail: true
      }
    ]
  })

  plop.setGenerator('container', {
    description: 'Container Component',
    prompts: [namePrompt],
    actions: [
      {
        type: 'add',
        path: 'src/containers/{{ camelCase name }}/index.js',
        templateFile: '.plop/container.txt',
        abortOnFail: true
      }
    ]
  })
  return true
}
