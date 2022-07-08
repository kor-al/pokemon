import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleRadial } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { arc } from "d3-shape";
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

class CircularBarChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 10, right: 30, bottom: 30, left: 40 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.innerRadius = 50;
    this.outerRadius = 100;
  }

  render() {
    const maxData = max(this.props.data.map((d) => d[this.props.yvariable]));

    let xScale = scaleBand()
      .range([0, Math.PI])
      .domain(
        this.props.data.map(function (d) {
          return d.name;
        })
      );
    let yScale = scaleRadial()
      .range([this.innerRadius, this.outerRadius])
      .domain([0, maxData]);

    const pathGenerator = arc()
      .innerRadius(this.innerRadius)
      .outerRadius((d) => yScale(d[this.props.yvariable]))
      .startAngle(d=> xScale(d.name))
      .endAngle(d=> {return xScale(d.name) + xScale.bandwidth(); })
      .padAngle(0.01)
      .padRadius(this.innerRadius);
      
    const arcs = this.props.data.map((d, i) => (
      <path
        key={"path" + i}
        data-name={`${d.name}`}
        d={pathGenerator(d)}
        style={{
          fill: "green",
          stroke: "black",
          opacity: 0.5,
        }}
        className={`arc`}
      />
    ));
    return (
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g transform={`translate(${this.props.size[0]/2}, ${this.props.size[1]/2})`}>
          {arcs}
          {/* <Axis d3Axis={axisBottom} scale={xScale} translateX={0} translateY={this.height} /> */}
          {/* <Axis d3Axis={axisLeft} scale={yScale} translateX={0} translateY={0} /> */}
        </g>
      </svg>
    );
  }
}
export default CircularBarChart;
