import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { area, curveCatmullRom } from "d3-shape";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";

class Card extends Component {
    constructor(props) {
      super(props);
    }

  
    render() {
        if (this.props.data){
        return <div className="Card">
            <h3>{this.props.data.name}</h3>
            <div>Types:{this.props.data.type1}, {this.props.data.type2}</div>
            <div>Hp:{this.props.data.hp}</div>
            <div>Attack:{this.props.data.attack}</div>
            <div>Defense:{this.props.data.defense}</div>
        </div>
        }
    }
      
  }
  export default Card;
  