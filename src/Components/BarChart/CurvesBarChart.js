import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { line, curveBasis } from "d3-shape";
import { select } from "d3-selection";
import { axisLeft, axisBottom, axisRight } from "d3-axis";
import { varToInt } from "../../preprocess";
import "./DoubleStackedBarChart.css";
import { formatNameString } from "../../preprocess";
import "./CurvesBarChart.css";

const Axis = ({ d3Axis, scale, translateX, translateY, ticks }) => {
  const anchor = useRef();

  const axis = d3Axis(scale).ticks(ticks);

  useEffect(() => {
    select(anchor.current).call(axis);
  }, [scale, axis]);

  return (
    <g transform={`translate(${translateX}, ${translateY})`} ref={anchor} />
  );
};

const Legend = ({ width, height, dataLen }) => {
  const leftLabelStart = (
    <text
      x={-height + 10}
      y={-5}
      textAnchor="start"
      className="capture_rate"
      transform={`rotate(${-90})`}
    >
      easier catch
    </text>
  );
  const leftLabelEnd = (
    <text
      x={0}
      y={-5}
      textAnchor="end"
      className="capture_rate"
      transform={`rotate(${-90})`}
    >
      harder catch
    </text>
  );

  const rightLabelStart = (
    <text
      x={-height + 10}
      y={width + 10}
      textAnchor="start"
      className="base_egg_steps"
      transform={`rotate(${-90})`}
    >
      easier hatch
    </text>
  );
  const rightLabelEnd = (
    <text
      x={0}
      y={width + 10}
      textAnchor="end"
      className="base_egg_steps"
      transform={`rotate(${-90})`}
    >
      harder hatch
    </text>
  );

  const circleLabel = (
    <g transform={`translate(0, ${-60})`}>
      <circle className="base_happiness" cx={0} cy={0} r={5} />{" "}
      <text x={20} y={0} textAnchor="start" alignmentBaseline="middle">
        base happiness after hatching
      </text>
    </g>
  );

  const circleLabel_caught = (
    <g transform={`translate(${0}, ${-40})`}>
      <circle
        className="base_happiness base_happiness-caught"
        cx={0}
        cy={0}
        r={5}
      />{" "}
      <text x={20} y={0} textAnchor="start" alignmentBaseline="middle">
        base happiness after catching
      </text>
    </g>
  );

  return (
    <g className="legend">
      {leftLabelStart}
      {leftLabelEnd}
      {rightLabelStart}
      {rightLabelEnd}
      {circleLabel}
      {circleLabel_caught}
      <text>
        <textPath
          href="#curve-lpath0"
          startOffset="20%"
          className="capture_rate"
          textAnchor="start"
        >
          catch
        </textPath>
        <textPath
          href="#curve-rpath0"//{dataLen>1? "#curve-rpath1" : "#curve-rpath0"}
          startOffset="80%"
          className="base_egg_steps"
          textAnchor="end"
        >
          hatch
        </textPath>
      </text>
    </g>
  );
};

class CurvesBarChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 80, right: 30, bottom: 80, left: 30 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.yScalePadding = 0.3;
    this.circleRadius = 10;
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
    const variable = el.dataset.var;
    let val = isNaN(el.dataset.val) ? d[variable] : el.dataset.val;
    if (variable === "base_happiness" && isNaN(el.dataset.val)) {
      val += "(caught)";
    }
    if (variable === "base_happiness" && !isNaN(el.dataset.val)) {
      val += "(hatched)";
    }
    this.tooltip.innerHTML = `
    ${d.name}, ${d.classfication}
    </br>Types: ${d.type1}${d.type2 === "" ? "" : ", " + d.type2}
    </br>${formatNameString(variable)}: ${val}
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
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;

    const maxData = {
      xr: max(
        this.props.data.map((d) => varToInt(d[this.props.rightvariable]))
      ),
      xl: max(this.props.data.map((d) => varToInt(d[this.props.leftvariable]))),
      r: max(this.props.data.map((d) => varToInt(d[this.props.rvariable]))),
    };

    const yStart= 2*this.height / 3

    var xScale = scaleBand()
      .domain(this.props.items)
      .range([this.width, 0])
      .padding([this.yScalePadding]);

    var rScale = scaleLinear()
      .domain([0, maxData.r])
      .range([3, this.circleRadius]);

    var yPlotScale = scaleLinear()
      .domain([0, max([maxData.xr, maxData.xl])])
      .range([0, this.height]);

    var yRightScale = scaleLinear()
      .domain([0, maxData.xr])
      .range([0, yStart]);

    var yLeftScale = scaleLinear()
      .domain([maxData.xl, 0])
      .range([0, yStart]);

    var leftCurves = this.props.data.map((d, i) => {
      let xoffset = xScale.bandwidth() / 2;
      let xsource = xScale.bandwidth() / 2 + xScale(d.name);
      let leftpoints = [
        { x: xsource-2, y: this.height },
        { x: xsource, y: yStart },
        {
          x: xsource - xoffset,
          y: yStart - yLeftScale(d[this.props.leftvariable]),
        },
      ];

      let rightpoints = [
        { x: xsource+2, y: this.height },
        { x: xsource, y: yStart },
        {
          x: xsource + xoffset,
          y: yStart - yRightScale(d[this.props.rightvariable]),
        },
      ];
      var curveGen = line()
        .x((p) => p.x)
        .y((p) => p.y)
        .curve(curveBasis);

      var curves = (
        <g
          key={`g${i}`}
          onMouseOver={(e) => this.mouseover(e)}
          onMouseMove={(e) => this.mousemove(e, d)}
          onMouseOut={(e) => this.mouseleave(e)}
        >
          <path
            key={`lpath${i}`}
            id={`curve-lpath${i}`}
            data-var={this.props.leftvariable}
            d={curveGen(leftpoints)}
            className={this.props.leftvariable}
            stroke="black"
            fill="transparent"
            style={{ strokeWidth: 2, strokeOpacity: 0.5 }}
          />
          <path
            key={`rpath${i}`}
            id={`curve-rpath${i}`}
            d={curveGen(rightpoints)}
            data-var={this.props.rightvariable}
            className={this.props.rightvariable}
            stroke="black"
            fill="transparent"
            style={{ strokeWidth: 2, strokeOpacity: 0.5 }}
          />
          <circle
            key={`lcircle${i}`}
            data-var={this.props.rvariable}
            className={`${this.props.rvariable}-caught ${this.props.rvariable}`}
            cx={leftpoints[2].x}
            cy={leftpoints[2].y}
            r={rScale(d[this.props.rvariable])}
            stroke="black"
            // fill="transparent"
          />
          <circle
            key={`rcircle${i}`}
            data-var={this.props.rvariable}
            className={`${this.props.rvariable}`}
            data-val={120}
            cx={rightpoints[2].x}
            cy={rightpoints[2].y}
            r={rScale(120)} //fixed value
            stroke="black"
            // fill="transparent"
          />
          {/* <text>
            <textPath
              href={`#curve-lpath${i}`}
              startOffset="90%"
              className="catch_rate"
              textAnchor="end"
            >
              catch
            </textPath>{" "}
            <textPath
              href={`#curve-rpath${i}`}
              startOffset="90%"
              className="egg_steps"
              textAnchor="end"
            >
              hatch
            </textPath>{" "}
          </text> */}
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
            <Axis
              d3Axis={axisLeft}
              scale={yPlotScale}
              translateX={0}
              translateY={-5}
              ticks={0}
            />
            <Axis
              d3Axis={axisRight}
              scale={yPlotScale}
              translateX={this.width}
              translateY={-5}
              ticks={0}
            />
            <Legend width={this.width} height={this.height} dataLen={this.props.data.length}/>
          </g>
        </svg>
        <div ref={(node) => (this.tooltip = node)} className="tooltip" />
      </div>
    );
  }
}

export default CurvesBarChart;
