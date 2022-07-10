import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { area, curveCatmullRom } from "d3-shape";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";

const ReactAxis = ({ scale, translateX, translateY }) => {
  const ticks = scale.ticks();
  return (
    <foreignObject width="100%" y={translateY} height={20} fontSize={10}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </foreignObject>
  );
};

const Axis = ({d3Axis, scale, translateX, translateY }) => {
  const anchor = useRef();

  const axis = d3Axis(scale);

  useEffect(() => {
    select(anchor.current).call(axis);
  }, [scale]);

  return <g transform={`translate(${translateX}, ${translateY})`} ref={anchor} />;
};

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 10, right: 30, bottom: 30, left: 40 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;

    this.getFillColor = this.getFillColor.bind(this);
    // this.state = {
    //     xScale: undefined,
    //     yScale
    // }
  }

  getFillColor(d){
    if(d.type2 !== "" && (d.type1 === this.props.selectedType) && (d.type2 !== this.props.selectedType)){
        return this.props.fillScale(d.type2)
    }
    return this.props.fillScale(d.type1) 
  }

  render() {
    const maxData = {
        x: max(this.props.data.map((d) => d[this.props.xvariable])),
        y: max(this.props.data.map((d) => d[this.props.yvariable])),
      };
    let xScale = scaleLinear()
        .domain([0, maxData.x])
        .range([0, this.width]);
    let yScale = scaleLinear()
        .domain([0, maxData.y])
        .range([this.height, 0]);
    const points = this.props.data.map((d, i) => (
      <circle
        key={"circle" + i}
        data-name={`${d.name}`}
        style={{
          fill: this.getFillColor(d),
          stroke: "black",
          strokeOpacity: 0.5,
          cx: xScale(d[this.props.xvariable]),
          cy: yScale(d[this.props.yvariable]),
          r: 8,
          opacity: 0.5,
        }}
        className={`circle ${d.name}`}
        onClick={this.props.onClick}
      />
    ));
    console.log("points.legth",points.length)
    return (
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
          {points}
          <Axis d3Axis={axisBottom} scale={xScale} translateX={0} translateY={this.height} />
          <Axis d3Axis={axisLeft} scale={yScale} translateX={0} translateY={0} />
        </g>
      </svg>
    );
  }
}
export default ScatterPlot;
