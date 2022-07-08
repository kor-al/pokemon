import React, { Component, useRef, useEffect } from "react";
import { scaleLinear, scaleBand, scaleRadial } from "d3-scale";
import { min, max, bin, groups, range } from "d3-array";
import { arc } from "d3-shape";
import { select, selectAll} from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import "./CircularBarChartQuadrupled.css";

const Axis = ({ d3Axis, scale, ticks, translateX, translateY }) => {
  const anchor = useRef();

  const axis = d3Axis(scale).ticks(ticks);

  useEffect(() => {
    select(anchor.current).call(axis);
  }, [scale]);

  return (
    <g className="axis" transform={`translate(${translateX}, ${translateY})`} ref={anchor} />
  );
};

class CircularBarChartQuadrupled extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 100, right: 50, bottom: 100, left: 100 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.innerRadius = 100;
    this.outerRadius = Math.min(this.width, this.height) / 2;
    this.centralRadius = 5;
    this.circlesRadius = 100;

    this.addCircles = this.addCircles.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
  }

  addCircles(rvar, distToCenterFunc, xScale, rScale, classes) {
    const circles = this.props.data.map((d, i) => {
      let ang = xScale(d.name) + xScale.bandwidth() / 2; //(Math.PI * 2 * i) / n;
      return (
        <circle
          key={"circle" + i}
          data-name={`${d.name}`}
          r={rScale(d[rvar])}
          cx={distToCenterFunc(d) * Math.sin(ang)}
          cy={-distToCenterFunc(d) * Math.cos(ang)}
          className={`${classes} ${d.name}`}
        />
      );
    });

    return circles;
  }

  onMouseOver(e){
    const nodes = select(e.target.parentElement).selectAll(`.${e.target.dataset.name}`)
    select(e.target.parentElement).classed("dimmed", true)
    nodes.classed("highlighted", true)
  }

  onMouseOut(e){
    const nodes = select(e.target.parentElement).selectAll(`.${e.target.dataset.name}`)
    select(e.target.parentElement).classed("dimmed", false)
    nodes.classed("highlighted", false)
  }

  render() {
    const maxData = {
      y1: max(this.props.data.map((d) => d[this.props.y1variable])),
      y1inner: max(this.props.data.map((d) => d[this.props.y1innervariable])),
      y2: max(this.props.data.map((d) => d[this.props.y2variable])),
      y2inner: max(this.props.data.map((d) => d[this.props.y2innervariable])),
    };

    let xScale1 = scaleBand()
      .range([0, Math.PI])
      .domain(
        this.props.data.map(function (d) {
          return d.name;
        })
      )
      .padding(0.01);

    let xScale2 = scaleBand()
      .range([-Math.PI, 0])
      .domain(
        this.props.data.map(function (d) {
          return d.name;
        }))
      .padding(0.02);

    let y1Scale = scaleRadial()
      .range([this.innerRadius, this.outerRadius])
      .domain([0, maxData.y1]);

    let y2Scale = scaleRadial()
      .range([this.innerRadius, this.outerRadius])
      .domain([0, maxData.y2]);

    let y2Scale_axis = scaleRadial()
      .range([this.outerRadius, this.innerRadius])
      .domain([0, maxData.y2]);

    let y1ScaleInner = scaleRadial()
      .range([this.innerRadius, this.centralRadius])
      .domain([0, maxData.y1inner]);

    let y2ScaleInner = scaleRadial()
      .range([this.innerRadius, this.centralRadius])
      .domain([0, maxData.y2inner]);

    //For circles
    let rScaleHP = scaleLinear().range([3, 30]).domain([1, 255]);
    let rScaleSpeed = scaleLinear().range([3, 30]).domain([5, 180]);

    const pathGenerator = (xScale, yScale, yvar) =>
      arc()
        .innerRadius(this.innerRadius)
        .outerRadius((d) => yScale(d[yvar]))
        .startAngle((d) => xScale(d.name))
        .endAngle((d) => {
          return xScale(d.name) + xScale.bandwidth();
        })
        .padAngle(0.01)
        .cornerRadius(10)
        .padRadius(this.innerRadius);

    const pathGeneratorInner = (xScale, yScaleInner, yvar) =>
      arc()
        .innerRadius((d) => yScaleInner(0))
        .outerRadius((d) => yScaleInner(d[yvar]))
        .startAngle((d) => xScale(d.name))
        .endAngle((d) => {
          return xScale(d.name) + xScale.bandwidth();
        })
        .padAngle(0.01)
        .cornerRadius(3)
        .padRadius(this.innerRadius);

    const arcs = (pathGen, classes) =>
      this.props.data.map((d, i) => (
        <path
          key={"path" + i}
          data-name={`${d.name}`}
          d={pathGen(d)}
          className={`${classes} ${d.name}` }
          onMouseOver={(e) => this.onMouseOver(e)}
          onMouseOut={(e) => this.onMouseOut(e)}
        />
      ));

    const labels =  this.props.data.map((d, i) => {
      let rotate = ((xScale1(d.name) + xScale1.bandwidth() / 2) * 180 / Math.PI - 90)
      let translateX = (y1Scale(d[this.props.y1variable])+10)
      let translateY = 0

      return (<g
        key={`g-${i}`}
        textAnchor={(xScale1(d.name) + xScale1.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"}
        transform={`rotate(${rotate}) translate(${translateX}, ${translateY})`}>
        <text
        alignmentBaseline="middle">{d.name}
        </text>
      </g>)
      })

    return (
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g
          transform={`translate(${this.props.size[0] / 2}, ${
            this.props.size[1] / 2
          })`}
        >
          {arcs(
            pathGenerator(xScale1, y1Scale, this.props.y1variable),
            "arcStat arcStat--outer"
          )}
          {arcs(
            pathGeneratorInner(
              xScale1,
              y1ScaleInner,
              this.props.y1innervariable
            ),
            "arcStat arcStat--inner"
          )}
          {arcs(
            pathGenerator(xScale2, y2Scale, this.props.y2variable),
            "arcStat arcStat--outerdouble"
          )}
          {arcs(
            pathGeneratorInner(
              xScale2,
              y2ScaleInner,
              this.props.y2innervariable
            ),
            "arcStat arcStat--innerdouble"
          )}
          {this.addCircles(
            "hp",
            (d) => this.circlesRadius,
            xScale1,
            rScaleHP,
            "circle hp"
          )}
          {this.addCircles(
            "speed",
            (d) => y2Scale(d[this.props.y2variable]) + 20,
            xScale2,
            rScaleSpeed,
            "circle speed"
          )}
          {labels}
          <Axis d3Axis={axisBottom} scale={y1Scale} translateX={0} translateY={0} ticks={3}/>
          <Axis d3Axis={axisBottom} scale={y2Scale_axis} translateX={-this.outerRadius-this.innerRadius} translateY={0} ticks={3}/>
          <Axis d3Axis={axisLeft} scale={y1ScaleInner} translateX={0} translateY={-this.innerRadius-this.centralRadius} ticks={3}/>
        </g>
      </svg>
    );
  }
}
export default CircularBarChartQuadrupled;
