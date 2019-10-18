import React, { Component } from 'react'
import EternalList from 'react-eternal-list';

let descArr = 'once up on a time in china, there was a lion lived. his name is something we cant really say because this is what it is'.split(' ')

let getDesc =()=> {
  let desc = '';
  let count = 8 + (Math.random() * 10);
  for(let idx=0; idx < count; idx++) {
    desc += ' ' + descArr[Math.floor(Math.random() * descArr.length)]
  }
  return desc;
}

let getItemArray = function(count=1000){
  let arr = [];
  let names = ['Blah', 'Jah', 'Snitch', 'Muew', 'Glaj', 'Flee', 'Rock', 'Helm', 'Craz', 'Stapple', 'Wings', 'Tan', 'Silva'];
  for(let idx=0; idx<count; idx++) {
    arr.push({
      name: names[Math.floor(Math.random() * names.length)] + ' ' + names[Math.floor(Math.random() * names.length)],
      desc: getDesc(),
    })
  }
  return arr;
};


const componentArray = [
  (item, index)=> {
    return (
      <div className='item' key={index}>{item.name}</div>
    )
  },
  (item, index)=> {
    return (
      <div className='card' key={index}>
        <div className='c-image'></div>
        <div className='c-name'>{item.name}</div>
        <div className='c-desc'>{item.desc}</div>
      </div>
    )
  },
]

let listCount = 10000;
let listRef = React.createRef();
let updateRateRef = React.createRef();
let maxArrayLength = 100000;
let updateRate = 100;

export default class App extends Component {

  state = {
    renderedComponentCount: 0,
    renderedContainerCount: 0,
    renderedDivCount: 0,
    getComponent: componentArray[0],
    componentIndex: 0,
    updateRate,
    listCount,
    itemArray: getItemArray(listCount),
  }

  onListUpdate =data=> {
    this.setState({
      renderedComponentCount: data.renderedComponentCount,
      renderedContainerCount: data.renderedContainerCount,
      renderedDivCount: data.renderedDivCount,
      visibilityCheckTime: data.visibilityCheckTime.toFixed(4),
    })
  }

  updateListCount =()=> {
    clearTimeout(this.listUpdationTimeout);
    this.listUpdationTimeout = setTimeout(()=> {
      listCount = parseInt(listRef.current.value, 10);
      if(listCount > maxArrayLength) {
        listCount = maxArrayLength;
        listRef.current.value = listCount;
      }
      this.setState({
        listCount,
        itemArray: getItemArray(listCount)
      })
    }, 100)
  }

  updateUpdateRate =()=> {
    clearTimeout(this.updateRateUpdationTimeout);
    this.updateRateUpdationTimeout = setTimeout(()=> {
      updateRate = parseInt(updateRateRef.current.value, 10); 
      this.setState({ updateRate })
    }, 100)
  }

  toggleComponent =()=> {
    let componentIndex = (this.state.componentIndex+1) % componentArray.length;
    this.setState({
      componentIndex,
      getComponent: componentArray[componentIndex]
    });
  }

  render () {
    return (
      <div className='app'>
        <div className='name'>Eternal List</div>
        <div className='desc'>This list use binary tree to hide/show list items. spliting the list by half till it reaches a minimum stack size 
        (configurable)</div>

        <div className='settings'>
          <div className='s-block'>
            <input ref={listRef} type='number' max={maxArrayLength} onChange={this.updateListCount} defaultValue={this.state.listCount}/>
            <div className='sb-name -lite'>Click to change the list count</div>
          </div>
          <div className='s-block'>
            <input ref={updateRateRef} type='number' onChange={this.updateUpdateRate} defaultValue={this.state.updateRate}/>
            <div className='sb-name -lite'>Click to change the Update Rate (ms)</div>
          </div>
          <div className='s-block'>
            <div className='sb-toggle-button' onClick={this.toggleComponent}>TOGGLE LIST ITEM</div>
            <div className='sb-name -lite'>Click to toggle List Item Type</div>
          </div>
        </div>
        <div className='stats'>
          <div className='s-block'>
            <div className='sb-value'>{this.state.renderedComponentCount}</div>
            <div className='sb-name'>Rendered Components</div>
          </div>
          <div className='s-block'>
            <div className='sb-value'>{this.state.renderedContainerCount}</div>
            <div className='sb-name'>Rendered Container</div>
          </div>
          <div className='s-block'>
            <div className='sb-value'>{this.state.renderedDivCount}</div>
            <div className='sb-name'>Rendered Divs</div>
          </div>
          <div className='s-block'>
            <div className='sb-value'>{this.state.visibilityCheckTime}</div>
            <div className='sb-name'>Processing Time (ms)</div>
          </div>
        </div>
        <div className='item-container'>
          <EternalList list={this.state.itemArray} updateRate={this.state.updateRate} onUpdate={this.onListUpdate} component={this.state.getComponent}/>
        </div>
      </div>
    )
  }
}
