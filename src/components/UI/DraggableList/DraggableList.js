import React, {PureComponent} from 'react';
import {Motion, spring} from 'react-motion';
import range from 'lodash/range';
import { connect } from 'react-redux';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import './DraggableList.module.css'
import BurgerIngredient from '../../Burger/BurgerIngredient/BurgerIngredient';
import ingredientClasses from '../../Burger/BurgerIngredient/BurgerIngredient.module.css';
import burgerClasses from '../../Burger/Burger.module.css';
import {camelCase, startCase} from 'lodash';


function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 300, damping: 50};


class DraggableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
    };
  };





  componentDidMount() {
    
    console.log(this.props.order, this.props.itemsCount);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  componentDidUpdate () {
    console.log('PROPS: ', this.props.order);
  }

  handleTouchStart = (key, pressLocation, e) => {
    
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleTouchMove = (e) => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseDown = (pos, pressY, {pageY}) => {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      originalPosOfLastPressed: pos,
    });
  };

  handleMouseMove = ({pageY}) => {
    const {isPressed, topDeltaY, originalPosOfLastPressed} = this.state;
    const order = this.props.order;
    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = clamp(Math.round(mouseY / 100), 0, this.state.itemsCount - 1);
      let newOrder = order;

      if (currentRow !== order.indexOf(originalPosOfLastPressed)){
        newOrder = reinsert(order, order.indexOf(originalPosOfLastPressed), currentRow);
        console.log(`currentRow: ${currentRow}, originalPosOfLastPressed: ${originalPosOfLastPressed} \n newOrder: ${newOrder}`);
      }

      this.setState({mouseY: mouseY, order: newOrder});
    }
  };

  handleMouseUp = () => {
    this.setState({isPressed: false, topDeltaY: 0});
  };

  render() {
    const {mouseY, isPressed, originalPosOfLastPressed} = this.state;
    const order = this.props.order;

    return (
        <Aux className={ingredientClasses.InnerIngredientsContainer}>
        {this.props.order.map( (ingredient, i) => {
            const ingredientType = ingredient.substring(0, ingredient.length -1);
            const ingredientClass = startCase(camelCase(ingredientType)).replace(/ /g, '');

          const style = originalPosOfLastPressed === i && isPressed
            ? {
                scale: spring(1.1, springConfig),
                shadow: spring(16, springConfig),
                y: mouseY,
              }
            : {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                y: spring(order.indexOf(i) * 100, springConfig),
              };
          return (
            <Motion style={style} key={i}>
              {({scale, shadow, y}) =>
                <div
                
                  onMouseDown={this.handleMouseDown.bind(null, i, y)}
                  onTouchStart={this.handleTouchStart.bind(null, i, y)}
                  className={ingredientClasses[ingredientClass]}
                  style={{
                    boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                    transform: `translate3d(0, ${y+100}px, 0) scale(${scale})`,
                    WebkitTransform: `translate3d(0, ${y+100}px, 0) scale(${scale})`,
                    zIndex: i === originalPosOfLastPressed ? 99 : i,
                  }}>
                  
                </div>
              }
            </Motion>
          );
        })}
      </Aux>
    );
  };
}

const mapStateToProps = (state) => {
  const order = Object.keys(state.burgerBuilder.ingredients )
  .map( igKey => {
      return [...Array( state.burgerBuilder.ingredients[igKey] )].map( ( _, i ) => {
          return `${igKey + i}`;
      } );
  } ).reduce((arr, el) => {
      return arr.concat(el)
  }, []);

  const itemsCount = order.length;
    return {
        order: order,
        itemsCount: itemsCount
        
    }
}

export default connect(mapStateToProps)(DraggableList);
