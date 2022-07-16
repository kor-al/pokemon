import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { min, max, ascending, sort } from "d3-array";
import { stack } from "d3-shape";
import { select, selectAll } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { formatNameString } from "../../preprocess";
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

const Legend = ({ circleleftvariable, circlerightvariable, leftvar, centervar, rightvar, r , width}) => {
  const yleftCircleLegend = (
    <g>
      <circle
        cx={-width/2+90}
        cy={0}
        r={r}
        className={circleleftvariable}
      />
      <text
        x={-width/2}
        y={0}
        alignmentBaseline="middle"
        key={"label" + 1}
        className={circleleftvariable}
        textAnchor={"start"}
      >
        {circleleftvariable}
      </text>
    </g>
  );
  const yleftRectLegend = (
    <g transform={`translate(${0},${20})`}>
      <rect
        x={-width/2+85}
        y={-5}
        width={10}
        height={10}
        className={leftvar}
      />
      <text
        x={-width/2}
        y={0}
        alignmentBaseline="middle"
        key={"label" + 1}
        className={leftvar}
        textAnchor={"start"}
      >
        {leftvar}
      </text>
    </g>
  );
  const yrightCircleLegend = (
    <g>
      <circle
        cx={width / 2+20}
        cy={0}
        r={r}
        width={10}
        height={10}
        className={circlerightvariable}
      />
      <text
        x={width/2}
        y={0}
        alignmentBaseline="middle"
        key={"label" + 1}
        className={circlerightvariable}
        textAnchor={"end"}
      >
        {circlerightvariable}
      </text>
    </g>
  );

  const yrightRectLegend = (
    <g transform={`translate(${0},${20})`}>
      <rect
        x={width/2+15}
        y={-5}
        width={10}
        height={10}
        className={rightvar}
      />
      <text
        x={width/2}
        y={0}
        alignmentBaseline="middle"
        key={"label" + 1}
        className={rightvar}
        textAnchor={"end"}
      >
        {rightvar}
      </text>
    </g>
  );

  const ycenterectLegend = (
    <g transform={`translate(${0},${20})`}>
      {/* <rect
        x={width/2+15}
        y={-5}
        width={10}
        height={10}
        className={centervar}
      /> */}
      <text
        x={0}
        y={0}
        alignmentBaseline="middle"
        key={"label" + 1}
        className={centervar}
        textAnchor={"start"}
      >
        {centervar}
      </text>
    </g>
  );

  return (
    <g className="legend" transform={`translate(${0},${-30})`}>
      {yleftCircleLegend}
      {yleftRectLegend}
      {yrightCircleLegend}
      {yrightRectLegend}
      {ycenterectLegend}
    </g>
  );
};

class DoubleStackedBarChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 50, right: 30, bottom: 30, left: 150 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.yScalePadding = 0.3;

    this.mouseover = this.mouseover.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  mouseover = function (e) {
    let el = e.target;
    console.log(el);
    if (el.tagName == "line" || el.tagName === "circle") {
      el = el.parentElement;
      console.log(el);
      el.style.strokeWidth = 3;
    } else {
      el.style.strokeWidth = 3;
    }
    this.tooltip.style.opacity = 1;
    // el.style.strokeOpacity = 1;
    el.style.strokeWidth = 2;
  };

  mousemove = function (e, d) {
    let el = e.target;
    if (el.tagName == "line" || el.tagName === "circle") {
      el = el.parentElement;
      el.style.strokeWidth = 3;
    } else {
      el.style.strokeWidth = 3;
    }
    this.tooltip.innerHTML = `
    ${el.dataset.name}
    </br>${formatNameString(el.dataset.var)}: ${el.dataset.val}
    `;
    this.tooltip.style.top = e.pageY + 10 + "px";
    this.tooltip.style.left = e.pageX + 10 + "px";
  };

  mouseleave = function (e) {
    let el = e.target;
    if (el.tagName == "line") {
      el = el.parentElement;
      el.style.strokeWidth = 3;
    }
    if (el.tagName === "circle") {
      el = el.parentElement;
      el.style.strokeWidth = 0;
    } else {
      el.style.strokeWidth = 0;
    }
    this.tooltip.style.opacity = 0;
    // el.style.strokeOpacity = 0.5;
    this.tooltip.style.top = 0 + "px";
    this.tooltip.style.left = 0 + "px";
  };

  render() {
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;

    const sortedData = this.props.data
      .slice()
      .sort((a, b) =>
        ascending(a[this.props.leftvariable], b[this.props.leftvariable])
      );

    const stackedVariablesSumMax = (vars) =>
      vars.reduce(
        (prev, next) => prev + max(this.props.data.map((d) => d[next])),
        0
      );

    const maxData = {
      y: stackedVariablesSumMax(this.props.variables),
      ycircle: stackedVariablesSumMax(this.props.circlevariables),
      yleft: max(this.props.data.map((d) => d[this.props.leftvariable])),
      yleftcircle: max(
        this.props.data.map((d) => d[this.props.circleleftvariable])
      ),
    };

    var yScale = scaleBand()
      .domain(sortedData.map((d) => d.name))
      .range([this.height, 0])
      .padding([this.yScalePadding]);

    var xScale = scaleLinear()
      .domain([0, max([maxData.y, maxData.ycircle])])
      .range([0, this.width / 2]);

    var xLeftScale = scaleLinear()
      .domain([0, max([maxData.yleft, maxData.yleftcircle])])
      .range([this.width / 2, 0]);

    // var colorScale = scaleOrdinal()
    //   .domain(this.props.variables.concat([this.props.leftvariable]))
    //   .range(["#e41a1c", "#377eb8", '#4daf4a']);

    var stackedData = stack().keys(this.props.variables)(this.props.data);
    var stackedDataCircle = stack().keys(this.props.circlevariables)(
      this.props.data
    );
    var grects = stackedData.map((group, j) => {
      var rects = group.map((d, i) => (
        <rect
          key={`rect${i}`}
          data-var={group.key}
          data-val={d[1] - d[0]}
          data-name={d.data.name}
          x={xScale(d[0])}
          y={yScale(d.data.name)}
          width={xScale(d[1]) - xScale(d[0])}
          height={yScale.bandwidth()}
          rx={4}
          ry={4}
          onMouseOver={(e) => this.mouseover(e)}
          onMouseMove={(e) => this.mousemove(e, d)}
          onMouseOut={(e) => this.mouseleave(e)}
        />
      ));
      return (
        <g key={`g${j}`} className={`${group.key}`}>
          {/* fill={colorScale(group.key)}> */}
          {rects}
        </g>
      );
    });

    var group = stackedDataCircle[1]; //sp_defense
    var gcircles = group.map((d, i) => {
      var circles = (
        <g
          transform={`translate(0,${yScale.bandwidth() / 2})`}
          data-var={group.key}
          data-val={d[1] - d[0]}
          data-name={d.data.name}
        >
          <line
            key={`line${i}`}
            strokeWidth={3}
            x1={xScale(d[0])}
            y1={yScale(d.data.name)}
            x2={xScale(d[1])}
            y2={yScale(d.data.name)}
            onMouseOver={(e) => this.mouseover(e)}
            onMouseMove={(e) => this.mousemove(e, d)}
            onMouseOut={(e) => this.mouseleave(e)}
          />
          <circle
            key={`circle${i}`}
            cx={xScale(d[1])}
            cy={yScale(d.data.name)}
            r={yScale.bandwidth() / 7}
            onMouseOver={(e) => this.mouseover(e)}
            onMouseMove={(e) => this.mousemove(e, d)}
            onMouseOut={(e) => this.mouseleave(e)}
          />
        </g>
      );
      return (
        <g key={`g${d.data.name}-${0}`} className={`${group.key}`}>
          {circles}
        </g>
      );
    });

    var leftRects = this.props.data.map((d, i) => {
      var rects = (
        <rect
          key={`rect${i}`}
          data-var={this.props.leftvariable}
          data-val={d[this.props.leftvariable]}
          data-name={d.name}
          x={-this.width / 2 + xLeftScale(d[this.props.leftvariable])}
          y={yScale(d.name)}
          width={this.width / 2 - xLeftScale(d[this.props.leftvariable])}
          height={yScale.bandwidth()}
          rx={4}
          ry={4}
          onMouseOver={(e) => this.mouseover(e)}
          onMouseMove={(e) => this.mousemove(e, d)}
          onMouseOut={(e) => this.mouseleave(e)}
        />
      );
      return rects;
    });

    var leftCircles = this.props.data.map((d, i) => {
      var circles = (
        <g
          key={`gcircle${i}`}
          data-var={this.props.circleleftvariable}
          data-val={d[this.props.circleleftvariable]}
          data-name={d.name}
          transform={`translate(0,${yScale.bandwidth() / 2})`}
        >
          <circle
            key={`circle${i}`}
            cx={-this.width / 2 + xLeftScale(d[this.props.circleleftvariable])}
            cy={yScale(d.name)}
            r={yScale.bandwidth() / 7}
            onMouseOver={(e) => this.mouseover(e)}
            onMouseMove={(e) => this.mousemove(e, d)}
            onMouseOut={(e) => this.mouseleave(e)}
          />
          <line
            key={`line${i}`}
            strokeWidth={3}
            x1={-this.width / 2 + xLeftScale(0)}
            y1={yScale(d.name)}
            x2={-this.width / 2 + xLeftScale(d[this.props.circleleftvariable])}
            y2={yScale(d.name)}
            onMouseOver={(e) => this.mouseover(e)}
            onMouseMove={(e) => this.mousemove(e, d)}
            onMouseOut={(e) => this.mouseleave(e)}
          />
        </g>
      );
      return circles;
    });

    var labels = this.props.data.map((d, i) => {
      var labels = (
        <text
          key={"text" + i}
          y={yScale(d.name)}
          x={
            -this.width / 2 +
            xLeftScale(
              max([
                d[this.props.circleleftvariable],
                d[this.props.leftvariable],
              ])
            ) -
            10
          }
          textAnchor={"end"}
          alignmentBaseline="middle"
        >
          {d.name}
        </text>
      );
      return (
        <g key={"g" + i} transform={`translate(0,${yScale.bandwidth() / 2})`}>
          {labels}
        </g>
      );
    });

    var xLabels = [];

    xLabels.push(
      <text
        key={"xlabelDef"}
        y={this.height}
        x={this.width / 2}
        className={"defense"}
        textAnchor={"end"}
        alignmentBaseline="middle"
      >
        {"defence"}
      </text>
    );

    xLabels.push(
      <text
        key={"xlabelHP"}
        y={this.height}
        x={xScale(0)}
        className={"hp"}
        textAnchor={"start"}
        alignmentBaseline="middle"
      >
        {"hp"}
      </text>
    );

    xLabels.push(
      <text
        key={"xlabelAtk"}
        y={this.height}
        x={-this.width / 2}
        className={"attack"}
        textAnchor={"start"}
        alignmentBaseline="middle"
      >
        {"attack"}
      </text>
    );

    return (
      <div className="stackedbar">
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          <g
            transform={`translate(${this.margin.left + this.width / 2}, ${
              this.margin.top
            })`}
          >
            {grects}
            {gcircles}
            <g className={`${this.props.leftvariable}`}>{leftRects}</g>
            <g className={`${this.props.circleleftvariable}`}>{leftCircles}</g>
            {labels}
            {/* <g>{xLabels}</g> */}
            <Legend
              circleleftvariable={this.props.circleleftvariable}
              circlerightvariable={this.props.circlevariables[1]}
              leftvar={this.props.leftvariable}
              centervar={this.props.variables[0]}
              rightvar={this.props.variables[1]}
              r={5} width={this.width}
            />
            <Axis
              d3Axis={axisBottom}
              scale={xScale}
              translateX={0}
              translateY={this.height}
              ticks={5}
            />
            <Axis
              d3Axis={axisBottom}
              scale={xLeftScale}
              translateX={-this.width / 2}
              translateY={this.height}
              ticks={5}
            />
          </g>
        </svg>
        <div ref={(node) => (this.tooltip = node)} className="tooltip" />
      </div>
    );
  }
}

export default DoubleStackedBarChart;
