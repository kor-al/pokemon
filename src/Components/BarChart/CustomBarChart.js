import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { arc } from "d3-shape";
import { select, selectAll } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { schemeSet1 } from "d3-scale-chromatic";
import { formatNameString } from "../../preprocess";

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
    this.margin = { top: 10, right: 30, bottom: 30, left: 30 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;


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
    </br>Types: ${d.type1}${d.type2 == "" ? "" : ", " + d.type2}
    </br>${formatNameString(this.props.xvariable)}: ${
      d[this.props.xvariable]
    }
    </br>${formatNameString(this.props.yvariable)}: ${
      d[this.props.yvariable]
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
        this.props.data.map(function (d) {
          return d.name;
        })
      )
      .padding(0.01);

    //individual scales per item but max is common
    let xScale = scaleLinear()
      .domain([0.1, maxData.x])
      .range([0, nameScale.bandwidth()]);
    let yScale = scaleLinear().domain([0, maxData.y]).range([0.1, this.height]);

    let colorScale = scaleOrdinal()
      .domain(
        this.props.data
          .map(function (d) {
            return d.experience_growth;
          })
          .sort()
      )
      .range([
        "#f7fbff",
        "#deebf7",
        "#c6dbef",
        "#9ecae1",
        "#6baed6",
        "#4292c6",
        "#2171b5",
        "#08519c",
        "#08306b",
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
              fill: colorScale(d.experience_growth),
              // fill: colorScale(d[this.props.colorvariable]),
              x:
                nameScale(d.name) +
                nameScale.bandwidth() / 2 -
                xScale(d[this.props.xvariable]) / 2,
              y: this.height - yScale(d[this.props.yvariable]),
              height: yScale(d[this.props.yvariable]),
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
              fill: colorScale(d.experience_growth),
              // fill: colorScale(d[this.props.colorvariable]),
              cx: nameScale(d.name) + nameScale.bandwidth() / 2,
              cy: this.height - 20,
              r: 10,
            }}
          />
        );
      }
    });

    return (
      <div className="sizeplot">
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
            {boxes}
            <Axis
              d3Axis={axisBottom}
              scale={nameScale}
              translateX={0}
              translateY={this.height}
              ticks={3}
            />
          </g>
        </svg>
        <div ref={(node) => (this.tooltip = node)} className="tooltip" />
      </div>
    );
  }
}
export default CustomBarChart;
