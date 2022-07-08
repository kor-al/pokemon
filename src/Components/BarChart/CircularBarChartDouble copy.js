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

class CircularBarChartDouble extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 10, right: 30, bottom: 30, left: 40 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.innerRadius = 100;
    this.outerRadius = Math.min(this.width, this.height) / 2;
  }

  render() {
    const maxData = {
      y: max(this.props.data.map((d) => d[this.props.yvariable])),
      yinner: max(this.props.data.map((d) => d[this.props.yinnervariable])),
    }

    let xScale = scaleBand()
      .range([0, Math.PI])
      .domain(
        this.props.data.map(function (d) {
          return d.name;
        })
      );
    let yScale = scaleRadial()
      .range([this.innerRadius, this.outerRadius])
      .domain([0, maxData.y]);

    let yScaleInner = scaleRadial()
      .range([this.innerRadius, 5])   // Domain will be defined later.
      .domain([0, maxData.yinner]);


    const pathGenerator = arc()
      .innerRadius(this.innerRadius)
      .outerRadius((d) => yScale(d[this.props.yvariable]))
      .startAngle(d=> xScale(d.name))
      .endAngle(d=> {return xScale(d.name) + xScale.bandwidth(); })
      .padAngle(0.01)
      .padRadius(this.innerRadius);
    
    const pathGeneratorInner = arc()
      .innerRadius(d=> yScaleInner(0))
      .outerRadius((d) => yScaleInner(d[this.props.yinnervariable]))
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

    const arcsInner = this.props.data.map((d, i) => (
      <path
        key={"pathInner" + i}
        data-name={`${d.name}`}
        d={pathGeneratorInner(d)}
        style={{
          fill: "red",
          stroke: "black",
          opacity: 0.5,
        }}
        className={`arc inner`}
      />
    ));

    return (
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g transform={`translate(${this.props.size[0]/2}, ${this.props.size[1]/2})`}>
          {arcs}
          {arcsInner}
          {/* <Axis d3Axis={axisBottom} scale={xScale} translateX={0} translateY={this.height} /> */}
          {/* <Axis d3Axis={axisLeft} scale={yScale} translateX={0} translateY={0} /> */}
        </g>
      </svg>
    );
  }
}
export default CircularBarChartDouble;
