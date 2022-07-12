import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleSequential } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { area, curveCatmullRom } from "d3-shape";
import { interpolateInferno, interpolateGreens } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";



class Heatmap extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 100, right: 10, bottom: 30, left: 100 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.tyleSize = {height: 50, width:50}
    this.maxValue = 4;

    this.rowTiles = this.rowTiles.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  mouseover = function(e) {
    let tile=e.target
    this.tooltip.style.opacity = 1
    tile.style.strokeOpacity = 1;
    tile.style.strokeWidth = 2;
  }
  
  mousemove = function(e) {
    const tile=e.target
    this.tooltip.innerHTML = `Type ${tile.dataset.name} against ${tile.dataset.var} is ${tile.dataset.val}`
    this.tooltip.style.top = (e.pageY+10)+"px"
    this.tooltip.style.left = (e.pageX+10) + "px"
  }
  
  mouseleave = function(e) {
    let tile=e.target
    this.tooltip.style.opacity = 0
    tile.style.strokeOpacity = 0.5;
    tile.style.strokeWidth = 1;
  }


  rowTiles = (d, xScale, yScale, colorScale) => {
    return this.props.vars.map((variable, i) => (
      <rect
        key={`tile-${i}`}
        x={xScale(variable)}
        y={yScale(d.name)}
        fill={colorScale(d[variable])}
        height={yScale.bandwidth()}
        width={xScale.bandwidth()}
        rx={4}
        ry={4}
        data-name={d.name}
        data-var={variable}
        data-val={d[variable]}
        onMouseOver={(e) => this.mouseover(e)}
        onMouseMove={(e) => this.mousemove(e)}
        onMouseOut={(e) => this.mouseleave(e)}
        style={{
          stroke: "black",
          strokeOpacity: 0.5
        }}
      />
    ));
  };

  render() {
    let xScale = scaleBand()
      .domain(this.props.vars)
      .range([0, this.width])
      .padding(0.1);

    let yScale = scaleBand()
      .domain(this.props.items)
      .range([this.height, 0])
      .padding(0.1);

    var colorScale = scaleSequential()
      .interpolator(interpolateGreens)
      .domain([0, this.maxValue]);

    const tiles = this.props.data.map((d, i) => {
      return (
        <g key={"g" + i} data-name={`${d.name}`} className={d.name}>
          {this.rowTiles(d, xScale, yScale, colorScale)}
        </g>
      );
    });

    const labelsY = this.props.data.map((d, i) => {
        let rotate = 0
        let translateX = -10;
        let translateY = yScale(d.name) + yScale.bandwidth()/2;
        return (
          <text key={"text" + i} textAnchor = "end" alignmentBaseline="middle"
          transform={`rotate(${rotate}) translate(${translateX}, ${translateY})`}>
            {d.name}
          </text>
        );
      });

    const labelsX = this.props.vars.map((d, i) => {
        let rotate = -90
        let translateX = 10;
        let translateY =xScale(d) + xScale.bandwidth()/2
        return (
          <text key={"text" + i} textAnchor = "start" alignmentBaseline="middle"
          transform={`rotate(${rotate}) translate(${translateX}, ${translateY})`}>
            {d.slice(8)}
          </text>
        );
      });

    return (
      <div className="heatmap" >
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
          {tiles}
          {labelsX}
          {labelsY}
        </g>
      </svg>
      <div ref={(node) => (this.tooltip = node)} className="tooltip"/>
      </div>
    );
  }
}
export default Heatmap;
