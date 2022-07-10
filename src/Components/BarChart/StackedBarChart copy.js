import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { stack } from "d3-shape";
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

  render() {
    var yScale = scaleBand()
      .domain(this.props.items)
      .range([0, this.height])
      .padding([0.2]);

    var xScale = scaleLinear().domain([0, 500]).range([0,this.width]);

    var colorScale = scaleOrdinal()
      .domain(this.props.variables)
      .range(["#e41a1c", "#377eb8"]);

    var stackedData = stack().keys(this.props.variables)(this.props.data);
    console.log("stackedData", stackedData)
    var grects = stackedData.map((group, j) => {
      console.log(group);
      var rects = group.map((d, i) => (
        <rect
          key={`rect${i}`}
          x={xScale(d[0])}
          y={yScale(d.data.name)}
          width={xScale(d[1]) - xScale(d[0])}
          height={yScale.bandwidth()}
        />
      ));
      return(
        <g key={`g${j}`} className={`${group.key}`} fill={colorScale(group.key)}>
          {rects}
        </g>
      );
    });

    return (
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
          {grects}
        </g>
      </svg>
    );
  }
}

export default StackedBarChart;
