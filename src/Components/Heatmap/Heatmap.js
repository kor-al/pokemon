import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleSequential } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { area, curveCatmullRom } from "d3-shape";
import { interpolateInferno } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";

const Axis = ({ d3Axis, scale, translateX, translateY }) => {
  const anchor = useRef();

  const axis = d3Axis(scale);

  useEffect(() => {
    select(anchor.current).call(axis);
  }, [scale]);

  return (
    <g transform={`translate(${translateX}, ${translateY})`} ref={anchor} />
  );
};

class Heatmap extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 100, right: 10, bottom: 30, left: 100 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.tyleSize = {height: 50, width:50}
    this.maxValue = 5;

    this.rowTiles = this.rowTiles.bind(this);
  }

  rowTiles = (d, xScale, yScale, colorScale) => {
    return this.props.vars.map((variable, i) => (
      <rect
        style={{
          stroke: "black",
          strokeOpacity: 0.5,
          fill: colorScale(d[variable]),
          x: xScale(variable),
          y: yScale(d.name),
          height: yScale.bandwidth(),
          width: xScale.bandwidth(),
          rx:4,
          ry: 4
        }}
      />
    ));
  };

  render() {
    const maxData = max(this.props.data.map((d) => d[this.props.variable]));
    let xScale = scaleBand()
      .domain(this.props.vars)
      .range([0, this.width])
      .padding(0.1);

    let yScale = scaleBand()
      .domain(this.props.items)
      .range([this.height, 0])
      .padding(0.1);

    var colorScale = scaleSequential()
      .interpolator(interpolateInferno)
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
export default Heatmap;
