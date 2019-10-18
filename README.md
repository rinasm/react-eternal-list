# react-eternal-list

> This package can render infinite list items without memory issues as it is using binary tree algorithm to remove and display elements while scrolling. check the demo and see how it works!

[![NPM](https://img.shields.io/npm/v/react-eternal-list.svg)](https://www.npmjs.com/package/react-eternal-list) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## [Demo](http://react-eternal-list.rinas.in)

## Install

```bash
npm install --save react-eternal-list
```

## Usage

```jsx
import React, { Component } from 'react'

import ReactEternalList from 'react-eternal-list'

class Example extends Component {
  render () {
    return (
      <div className='YourApp'>
        <div className='YourList'>
          <ReactEternalList  
            list={} /* data ( Array of objects ) */
            updateRate={} /* Update rate ( Integer ) */ 
            onUpdate={} /* A Callback function which will get called when list visibility update ( Function ) */
            component={} /* A Function that should return Componet which you want to render as a list item ( Function ) */
          />
        </div>
      </div>
    )
  }
}
```

## License

MIT © [rinasm](https://github.com/rinasm)
