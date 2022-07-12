import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { stack, line, curveCatmullRom, curveBasis } from "d3-shape";
import { select, selectAll } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { varToInt } from "../../preprocess";
import "./DoubleStackedBarChart.css";
import { toBeInTheDocument } from "@testing-library/jest-dom/dist/matchers";

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

class CurvesBarChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 50, right: 10, bottom: 30, left: 10 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.yScalePadding = 0.3;
    this.circleRadius = 10
    // this.rectHeight = this.height/5
    // this.rectWidth = this.width/10
    
  }

  render() {


    const maxData = {
      xr: max(this.props.data.map((d) => varToInt(d[this.props.rightvariable]))),
      xl: max(this.props.data.map((d) => varToInt(d[this.props.leftvariable]))),
      r: max(this.props.data.map((d) => varToInt(d[this.props.rvariable]))),
    };

    var xScale = scaleBand()
      .domain(this.props.items)
      .range([this.width, 0])
      .padding([this.yScalePadding]);

    var rScale = scaleLinear()
      .domain([0, maxData.r])
      .range([3, this.circleRadius]);

    var yRightScale = scaleLinear()
      .domain([0, maxData.xr])
      .range([0, this.height / 2]);

    var yLeftScale = scaleLinear()
      .domain([0, maxData.xl])
      .range([0,this.height / 2]);

    var leftCurves = this.props.data.map((d, i) => {
      let xoffset = xScale.bandwidth()/2
      let xsource = xScale.bandwidth()/2 + xScale(d.name);
      let leftpoints = [
        {
          x: xsource + xoffset,
          y: this.height / 2 - yLeftScale(d[this.props.leftvariable]),
        },
        { x: xsource, y: this.height / 2 },
        { x: xsource, y: this.height},
      ];

      let rightpoints = [
        {
          x: xsource - xoffset,
          y: this.height / 2 - yRightScale(d[this.props.rightvariable]),
        },
        { x: xsource, y: this.height / 2 },
        { x: xsource, y: this.height},
      ];
      var curveGen = line()
        .x((p) => p.x)
        .y((p) => p.y)
        .curve(curveBasis);

      var curves = (
        <g key={`g${i}`}>
          <path
            key={`lpath${i}`}
            d={curveGen(leftpoints)}
            stroke="black"
            fill="transparent"
          />
          <path
            key={`rpath${i}`}
            d={curveGen(rightpoints)}
            stroke="black"
            fill="transparent"
          />
          <circle
            key={`lcircle${i}`}
            cx={leftpoints[0].x}
            cy={leftpoints[0].y}
            r={rScale(d[this.props.rvariable])}
            stroke="black"
            fill="transparent"
          />
          <circle
            key={`rcircle${i}`}
            cx={rightpoints[0].x}
            cy={rightpoints[0].y}
            r={rScale(120)} //fixed value 
            stroke="black"
            fill="transparent"
          />
        </g>
      );
      return curves;
    });

    return (
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
          {leftCurves}
          <Axis
            d3Axis={axisBottom}
            scale={xScale}
            translateX={0}
            translateY={this.height}
          />
        </g>
      </svg>
    );
  }
}

export default CurvesBarChart;
