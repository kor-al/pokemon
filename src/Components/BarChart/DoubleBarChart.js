import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { stack, line, curveCatmullRom, curveBasis } from "d3-shape";
import { select, selectAll } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { schemeSet1 } from "d3-scale-chromatic";
import "./DoubleStackedBarChart.css";

const Axis = ({ d3Axis, scale, translateX, translateY, ticks }) => {
  const anchor = useRef();

  const axis = d3Axis(scale).ticks(ticks);

  useEffect(() => {
    select(anchor.current).call(axis);
  }, [scale]);

  return (
    <g transform={`translate(${translateX}, ${translateY})`} ref={anchor} />
  );
};

class DoubleBarChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 10, right: 10, bottom: 50, left: 250 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.yScalePadding = 0.3;
  }

  render() {

    const maxData = {
      xr: max(this.props.data.map((d) => d[this.props.lvariable])),
      xl: max(this.props.data.map((d) => d[this.props.rvariable])),
    };

    var yScale = scaleBand()
      .domain(this.props.items)
      .range([this.height, 0])
      .padding([this.yScalePadding]);

    var xRightScale = scaleLinear()
      .domain([0, maxData.xr])
      .range([0, this.width / 2]);

    var xLeftScale = scaleLinear()
      .domain([0, maxData.xl])
      .range([this.width / 2, 0]);


    var leftCurves = this.props.data.map((d, i) => {
    let points = [{x: 100, y:0},{x: 100, y:yScale(d.name)},
    {x: 0, y:yScale(d.name)}]
    var curveGen = line()
  .x((p) => p.x)
  .y((p) => p.y)
  .curve(curveBasis);

    var curves = (
        <path
          key={`path${i}`}
          d={curveGen(points)}
          stroke="black"
          fill="transparent"
        />
      );
      return curves;
    });


    return (
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g
          transform={`translate(${this.props.size[0] / 2}, ${this.margin.top})`}
        >
          {leftCurves}
        </g>
      </svg>
    );
  }
}

export default DoubleBarChart;
