import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

let containerRef= React.createRef();
let dummyELRef= React.createRef();

export default class ReactEternalList extends Component {
  static propTypes = {
    list: PropTypes.array,
    component: PropTypes.func
  }

  state = {
    list: []
  }

  listItemHeightShouldUpdate = true;
  minimumStackSize = 10;
  scrollTop = 0;
  containerHeight = window.innerHeight;
  
  UNSAFE_componentWillReceiveProps(props) {
    this.updateeternalList(props);
  }

  updateeternalList =(props=this.props)=> {
    let shoudUpdate = this.isComponentUpdated(props);
    shoudUpdate = this.setList(props) || shoudUpdate;
    if(shoudUpdate) {
      this.updateListDimension();
      this.updateListVisibility();
    }
  }

  componentDidMount() {
    this.containerHeight = parseInt(containerRef.current.clientHeight, 10)
    this.updateListItemHeight();
    this.updateeternalList();
  }

  isComponentUpdated =props=> {
    if(!this.componentSign || this.componentSign !== props.component.sign) {
      props.component.sign = Date.now();
      this.componentSign = props.component.sign;
      this.listItemHeightShouldUpdate = true;
      return true;
    }
    return false;
  }

  updateNodeDimension =node=> {
    if(node.parent) {
      node.height = 0;
      let temp;
      for(let idx=0; idx < node.data.length; idx++) {
        temp = this.updateNodeDimension(node.data[idx]);
        node.height += temp.height;
      }
      node.top = node.data[0] ? node.data[0].top : 0;
      node.bottom = node.top + node.height;
    } else {
      node.height = (node.data || []).length * this.listItemHeight;
      node.top = this.totalTop;
      node.bottom = node.top + node.height;
      this.totalTop += node.height;
    }
    return node;
  }

  updateListDimension =()=> {
    this.totalTop = 0;
    this.updateNodeDimension(this.list);
  }

  isNodeVisible =node=> {
    return (node.top <= this.scrollTop + (this.containerHeight * 1.5) ) && (node.bottom - (this.containerHeight * -0.5) >= this.scrollTop) 
  }

  updateNodeVisibility =node=> {
    node.visible = this.isNodeVisible(node);
    if(node.visible && node.parent) {
      for(let idx=0; idx< node.data.length; idx++) { 
        this.updateNodeVisibility(node.data[idx]);
      }
    }
  }

  updateListItemHeight =()=> {
    if(this.listItemHeightShouldUpdate === true) {
      this.listItemHeight = dummyELRef.current.clientHeight;
      this.component = this.props.component;
      this.listItemHeightShouldUpdate = false;
      return true;
    }
    return false;
  }

  updateListVisibility =()=> {
    let time = window.performance.now(); 
    this.updateNodeVisibility(this.list); 
    this.visibilityCheckTime = window.performance.now() - time;
    this.setState({list: this.list || []}, ()=>{
      if(this.props.onUpdate) {
        this.props.onUpdate({
          renderedComponentCount: this.renderedComponentCount,
          renderedContainerCount: this.renderedContainerCount,
          renderedDivCount: this.renderedContainerCount + this.renderedComponentCount,
          visibilityCheckTime: this.visibilityCheckTime
        });
      }
      if(this.updateListItemHeight()) {
        this.updateListDimension();
        this.updateListVisibility();
      }
    });    
  }

  setList =(props=this.props)=> {
    if(!this.list || this.list.sign !== props.list.sign) {
      this.list = props.list || [];
      this.list = this.recursiveSplit(this.list);
      this.list.sign = props.list.sign = Date.now();
      containerRef.current.scrollTop = 0;
      return true;
    }
    return false;
  }

  recursiveSplit =(data)=> {
    if(data.length / 2 > this.minimumStackSize) {
      let mid = Math.floor(data.length/2, 10);
      let node = { 
        parent: true,
        getParent: ()=> data,
        data: [this.recursiveSplit(data.slice(0, mid)), this.recursiveSplit(data.slice(mid, data.length+1))]
      }
      return node;
    }
    return {
      parent: false,
      data
    }
  }

  getList =()=> this.state.list || {};

  renderList =(node=this.getList())=> {
    if(node.parent) {
      this.renderedContainerCount += (node.data||[]).length;
      return (node.data || []).map((item, index)=> {
        return (
          <div className={styles.ilParent} key={index} style={{height: item.height}}>
            { item.visible ? this.renderList(item) : '' }
          </div>
        )
      });
    } else {
      this.renderedComponentCount += (node.data||[]).length;
      return (node.data||[]).map((item, index)=> {
        return this.component(item, index)
      });
    }
  }

  handleScroll =e=> {
    this.scrollTop = e.target.scrollTop;
    clearTimeout(this.updationDebounce);
    if(!this.updationInterval) {
      this.updationInterval = setInterval(()=> {
        this.updateListVisibility();
      }, this.props.updateRate || 100);
    }
    this.updationDebounce = setTimeout(()=>{
      this.updateListVisibility();
      clearInterval(this.updationInterval);
      this.updationInterval = null;
    }, this.props.updateRate || 100);
  }

  renderDummy =()=> {
    return (
      <div className={styles.dummyContainer} ref={dummyELRef}>
        {this.props.component((this.props.list||[])[0] || {})}
      </div>
    )
  }

  render() {
    this.renderedComponentCount = 0;
    this.renderedContainerCount = 0;
    let renderedList = this.renderList();

    return (
      <div className={styles.eternalList} onScroll={this.handleScroll} ref={containerRef}>
        <div className={styles.ilDummy}>
          <this.renderDummy />
        </div>
        <div className={styles.ilContainer}>
          {renderedList} 
        </div>
      </div>
    )
  }
}
