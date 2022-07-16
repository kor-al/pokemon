import React, { Component, useRef, useEffect } from "react";
import {
  scaleLinear,
  scaleBand,
  scaleOrdinal,
  scaleSequential,
} from "d3-scale";
import { min, max, ascending, sort, descending, map } from "d3-array";
import { select } from "d3-selection";
import { axisBottom, axisLeft, axisTop } from "d3-axis";
import { schemeSet1, schemeBlues } from "d3-scale-chromatic";
import { formatNameString } from "../../preprocess";
import { interpolateBlues } from "d3-scale-chromatic";

const Legend = ({ scale, uniqueValues, width, xTranslate, yTranslate }) => {
  const step = (width * 0.5) / uniqueValues.length;
  const legend = uniqueValues.map((d, i) => {
    return (
      <rect
        x={width - step / 2 - step * i}
        y={-30}
        width={step}
        key={`legend-rect-${i}`}
        height={20}
        fill={scale(d)}
        stroke={"black"}
        strokeOpacity={0.5}
      ></rect>
    );
  });

  return (
    <g transform={`translate(${xTranslate},${yTranslate})`} className="legend">
      {legend}
    </g>
  );
};

const Axis = ({ d3Axis, scale, ticks, translateX, translateY }) => {
  const anchor = useRef();

  const axis = d3Axis(scale).ticks(ticks);

  useEffect(() => {
    select(anchor.current).call(axis);
  }, [scale]);

  return (
    <g
      className="axis"
      transform={`translate(${translateX}, ${translateY})`}
      ref={anchor}
    />
  );
};

class CustomBarChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 50, right: 30, bottom: 30, left: 60 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.colorVar="experience_growth"
    this.catScale = scaleOrdinal()
    .domain([600000, 800000, 1000000, 1059860, 1250000, 1640000])
    .range([
      "Erratic",
      "Fast",
      "Medium Fast",
      "Medium Slow",
      "Slow",
      "Fluctu­ating",
    ]);

    this.mouseover = this.mouseover.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  mouseover = function (e) {
    let point = e.target;
    this.tooltip.style.opacity = 1;
    point.style.strokeOpacity = 1;
    point.style.strokeWidth = 2;
  };

  mousemove = function (e, d) {
    const point = e.target;
    this.tooltip.innerHTML = `
    ${d.name}, ${d.classfication}
    </br>${formatNameString(this.props.xvariable)}: ${d[this.props.xvariable]}
    </br>${formatNameString(this.props.yvariable)}: ${d[this.props.yvariable]}
    </br>${formatNameString(this.colorVar)}: ${this.catScale(d[this.colorVar])} (${d[this.colorVar]})
    `;
    this.tooltip.style.top = e.pageY + 10 + "px";
    this.tooltip.style.left = e.pageX + 10 + "px";
  };

  mouseleave = function (e) {
    let point = e.target;
    this.tooltip.style.opacity = 0;
    point.style.strokeOpacity = 0.5;
    point.style.strokeWidth = 1;
    this.tooltip.style.top = 0 + "px";
    this.tooltip.style.left = 0 + "px";
  };

  render() {
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;

    const sortedData = this.props.data
      .slice()
      .sort((a, b) =>
        descending(a[this.props.xvariable], b[this.props.xvariable])
      );

    const maxData = {
      y: max(
        this.props.data.map((d) =>
          isNaN(d[this.props.yvariable]) ? 0 : d[this.props.yvariable]
        )
      ),
      x: max(
        this.props.data.map((d) =>
          isNaN(d[this.props.xvariable]) ? 0 : d[this.props.xvariable]
        )
      ),
    };

    let nameScale = scaleBand()
      .range([0, this.width])
      .domain(
        sortedData.map(function (d) {
          return d.name;
        })
      )
      .padding(0.01);

    //individual scales per item but max is common
    let xScale = scaleLinear()
      .domain([0.1, maxData.x])
      .range([0, nameScale.bandwidth()]);
    let yScale = scaleLinear().domain([0, maxData.y]).range([this.height, 0.1]);

    let colorScale = scaleOrdinal(schemeBlues[6]).domain([
      600000, 800000, 1000000, 1059860, 1250000, 1640000,
    ]);

    const boxes = this.props.data.map((d, i) => {
      if (!isNaN(d[this.props.yvariable]) && !isNaN(d[this.props.xvariable])) {
        return (
          <rect
            key={"rect" + i}
            data-name={`${d.name}`}
            className={`rect ${d.name}`}
            onMouseOver={(e) => this.mouseover(e)}
            onMouseMove={(e) => this.mousemove(e, d)}
            onMouseOut={(e) => this.mouseleave(e)}
            style={{
              stroke: "black",
              strokeOpacity: 0.5,
              fill: colorScale(d[this.colorVar]),
              // fill: colorScale(d[this.props.colorvariable]),
              x:
                nameScale(d.name) +
                nameScale.bandwidth() / 2 -
                xScale(d[this.props.xvariable]) / 2,
              y: yScale(d[this.props.yvariable]),
              height: this.height - yScale(d[this.props.yvariable]),
              width: xScale(d[this.props.xvariable]),
              rx: 4,
              ry: 4,
            }}
          />
        );
      } else {
        return (
          <circle
            key={"circle" + i}
            data-name={`${d.name}`}
            className={`circle ${d.name}`}
            onMouseOver={(e) => this.mouseover(e)}
            onMouseMove={(e) => this.mousemove(e, d)}
            onMouseOut={(e) => this.mouseleave(e)}
            style={{
              stroke: "black",
              strokeOpacity: 0.5,
              fill: colorScale(d[this.colorVar]),
              // fill: colorScale(d[this.props.colorvariable]),
              cx: nameScale(d.name) + nameScale.bandwidth() / 2,
              cy: this.height - 20,
              r: 10,
            }}
          />
        );
      }
    });

    const xLabel = (
      <g transform={`translate(${nameScale.bandwidth() / 2},${-25})`}>
        <text textAnchor="middle" x={0} y={0}>
          {"weight (kg)"}
        </text>
      </g>
    );
    const yLabel = (
      <g transform={`rotate(${-90})`}>
        <text textAnchor="middle" x={-this.height / 2} y={-50}>
          {"height (m)"}
        </text>
      </g>
    );

    return (
      <div className="sizeplot">
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
            {boxes}
            {xLabel}
            {yLabel}
            <Legend
              uniqueValues={[
                ...new Set(this.props.data.map((d) => d[this.colorVar])),
              ]}
              scale={colorScale}
              width={this.width}
              xTranslate={0}
              yTranslate={0}
            />
            <Axis
              d3Axis={axisBottom}
              scale={nameScale}
              translateX={0}
              translateY={this.height}
              ticks={3}
            />
            <Axis
              d3Axis={axisLeft}
              scale={yScale}
              translateX={-10}
              translateY={0}
              ticks={3}
            />
            <Axis
              d3Axis={axisTop}
              scale={xScale}
              translateX={0}
              translateY={-10}
              ticks={0}
            />
          </g>
        </svg>
        <div ref={(node) => (this.tooltip = node)} className="tooltip" />
      </div>
    );
  }
}
export default CustomBarChart;
