import React, { Component } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { max, sort, ascending } from "d3-array";
import { axisBottom } from "d3-axis";
import { select } from "d3-selection";
import { useRef, useEffect } from "react";
import { symbol, symbolTriangle } from "d3-shape";
import "./DoubleStackedBarChart.css";
import { formatNameString } from "../../preprocess";

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

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.margin = { top: 10, right: 150, bottom: 50, left: 100 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;

    this.yScalePadding = 0.3;

    this.mouseover = this.mouseover.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);

    // this.createBarChart = this.createBarChart.bind(this)
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
    </br>Types: ${d.type1}${d.type2 == "" ? "" : ", " + d.type2}
    </br>${formatNameString(this.props.xvariable)}: ${
      d[this.props.xvariable]
    }
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
    const sortedData = this.props.data
      .slice()
      .sort((a, b) =>
        ascending(a[this.props.xvariable], b[this.props.xvariable])
      );

    const maxData = {
      x: max(this.props.data.map((d) => d[this.props.xvariable])),
    };

    var yScale = scaleBand()
      .domain(sortedData.map((d) => d.name))
      .range([this.height, 0])
      .padding([this.yScalePadding]);

    var xScale = scaleLinear().domain([0, maxData.x]).range([0, this.width]);

    var rects = this.props.data.map((d, i) => (
      <rect
        key={`rect${i}`}
        x={0}
        y={yScale(d.name)}
        width={xScale(d[this.props.xvariable])}
        height={yScale.bandwidth()}
        rx={4}
        ry={4}
        onMouseOver={(e) => this.mouseover(e)}
        onMouseMove={(e) => this.mousemove(e, d)}
        onMouseOut={(e) => this.mouseleave(e)}
      />
    ));

    // var lines = this.props.data.map((d, i) => {
    //   let triangle = symbol().type(symbolTriangle).size(50);
    //   let translateX = xScale(d[this.props.xvariable]);
    //   let translateY = yScale(d.name) + yScale.bandwidth() / 2;
    //   return (
    //     <g className={d.name}>
    //       <line
    //         key={`line${i}`}
    //         x1={0}
    //         y1={yScale(d.name) + yScale.bandwidth() / 2}
    //         x2={xScale(d[this.props.xvariable])}
    //         y2={yScale(d.name) + yScale.bandwidth() / 2}
    //         strokeWidth={13}
    //       />
    //       <path
    //         key={`head${i}`}
    //         d={triangle()}
    //         transform={`translate(${translateX + 3}, ${translateY}) rotate(90)`}
    //       />
    //     </g>
    //   );
    // });

    var labels = this.props.data.map((d, i) => (
      <text
        key={`label${i}`}
        x={-10}
        y={yScale(d.name) + yScale.bandwidth() / 2}
        textAnchor="end"
        alignmentBaseline="middle"
      >
        {d.name}
      </text>
    ));

    var text = this.props.text.map((d, i) => (
      <text
        className={d.name}
        key={`text${i}`}
        x={xScale(d.x) + 10}
        y={yScale(d.name) + yScale.bandwidth() / 2}
        textAnchor="start"
        alignmentBaseline="middle"
      >
        {d.text}
      </text>
    ));

    return (
      <div className="barplot">
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
            <g className={this.props.xvariable}>
              {rects}
              {text}
            </g>
            <Axis
              d3Axis={axisBottom}
              scale={xScale}
              translateX={0}
              translateY={this.height + 10}
              ticks={6}
            />
            {labels}
          </g>
        </svg>
        <div ref={(node) => (this.tooltip = node)} className="tooltip" />
      </div>
    );
  }
}

export default BarChart;
