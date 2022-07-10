import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { arc } from "d3-shape";
import { select, selectAll } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { schemeSet1 } from "d3-scale-chromatic";


class StackedBarChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 10, right: 30, bottom: 50, left: 30 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
  }

  render(){
    return (
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
            {tiles}
            {labelsX}
            {labelsY}
          </g>
        </svg>
      );
  }


}

export default StackedBarChart;