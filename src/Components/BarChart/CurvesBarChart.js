import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { line, curveBasis } from "d3-shape";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { varToInt } from "../../preprocess";
import "./DoubleStackedBarChart.css";
import { formatNameString } from "../../preprocess";
import "./CurvesBarChart.css"

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
    
    this.mouseover = this.mouseover.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  mouseover = function (e) {
    let point = e.target;
    this.tooltip.style.opacity = 1;
    point.style.strokeOpacity = 1;
    point.style.strokeWidth = 3;
  };

  mousemove = function (e, d) {
    const el = e.target;
    const variable = el.dataset.var
    const val = isNaN(el.dataset.val) ? d[variable] : el.dataset.val
    if (varibale === "base_happiness")
    this.tooltip.innerHTML = `
    ${d.name}, ${d.classfication}
    </br>Types: ${d.type1}${d.type2 == "" ? "" : ", " + d.type2}
    </br>${formatNameString(variable)}: ${isNaN(val)? d[variable]+"(caught)": val + "(hatched)"}
    `;
    this.tooltip.style.top = e.pageY + 10 + "px";
    this.tooltip.style.left = e.pageX + 10 + "px";
  };

  mouseleave = function (e) {
    let point = e.target;
    this.tooltip.style.opacity = 0;
    point.style.strokeOpacity = 0.5;
    point.style.strokeWidth = 2;
    this.tooltip.style.top = 0 + "px";
    this.tooltip.style.left = 0 + "px";
  };

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
          x: xsource - xoffset,
          y: this.height / 2 - yLeftScale(d[this.props.leftvariable]),
        },
        { x: xsource, y: this.height / 2 },
        { x: xsource, y: this.height},
      ];

      let rightpoints = [
        {
          x: xsource + xoffset,
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
        <g key={`g${i}`}             onMouseOver={(e) => this.mouseover(e)}
        onMouseMove={(e) => this.mousemove(e, d)}
        onMouseOut={(e) => this.mouseleave(e)}
        >
          <path
            key={`lpath${i}`}
            data-var={this.props.leftvariable}
            d={curveGen(leftpoints)}
            className={this.props.leftvariable}
            stroke="black"
            fill="transparent"
            style={{strokeWidth: 2, strokeOpacity:0.5}}
          />
          <path
            key={`rpath${i}`}
            d={curveGen(rightpoints)}
            data-var={this.props.rightvariable}
            className={this.props.rightvariable}
            stroke="black"
            fill="transparent"
            style={{strokeWidth: 2, strokeOpacity:0.5}}

          />
          <circle
            key={`lcircle${i}`}
            data-var={this.props.rvariable}
            className={`${this.props.rvariable}-caught ${this.props.rvariable}`}
            cx={leftpoints[0].x}
            cy={leftpoints[0].y}
            r={rScale(d[this.props.rvariable])}
            stroke="black"
            // fill="transparent"
          />
          <circle
            key={`rcircle${i}`}
            data-var={this.props.rvariable}
            className={`${this.props.rvariable}`}
            data-val={120}
            cx={rightpoints[0].x}
            cy={rightpoints[0].y}
            r={rScale(120)} //fixed value 
            stroke="black"
            // fill="transparent"
          />
        </g>
      );
      return curves;
    });

    return (
      <div className="curvesbar">
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
              <div ref={(node) => (this.tooltip = node)} className="tooltip" />
              </div>
    );
  }
}

export default CurvesBarChart;
