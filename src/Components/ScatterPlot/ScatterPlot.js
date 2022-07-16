import React, { Component, useRef, useEffect } from "react";
import { scaleLinear} from "d3-scale";
import { max} from "d3-array";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { symbol, symbolStar } from "d3-shape";

import "./ScatterPlot.css"

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



class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 10, right: 30, bottom: 30, left: 40 };

    this.getFillColor = this.getFillColor.bind(this);

    this.mouseover = this.mouseover.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  mouseover = function(e,d) {
    let point=e.target
    this.tooltip.style.opacity = 1
    point.style.strokeOpacity = 1;
    point.style.strokeWidth = 2;

    this.tooltip.innerHTML = `
    <img class="tooltip__img" src=${process.env.PUBLIC_URL + "/pokemons/" + d.pokedex_number + ".png"}>
    <div class="tooltip__text">${d.name}</div>
    <div class="tooltip__text">${d.classfication}</div>`
  }
  
  mousemove = function(e,d) {
    const point=e.target
    // this.tooltip.innerHTML = `
    // ${d.name}, ${d.classfication}
    // </br>Types: ${d.type1}${d.type2 == ""? "": ", " + d.type2}
    // </br>${formatNameString(this.props.xvariable)}: ${d[this.props.xvariable]}
    // </br>${formatNameString(this.props.yvariable)}: ${d[this.props.yvariable]}
    // `
    // this.tooltip.innerHTML = `
    // <img class="tooltip__img" src=${process.env.PUBLIC_URL + "/pokemons/" + d.name + ".png"}>
    // <div class="tooltip__text">${d.name}</div>
    // <div class="tooltip__text">${d.classfication}</div>
    // `
    this.tooltip.style.top = (e.pageY)+"px"
    this.tooltip.style.left = (e.pageX) + "px"
  }
  
  mouseleave = function(e) {
    let point=e.target
    this.tooltip.style.opacity = 0
    point.style.strokeOpacity = 0.5;
    point.style.strokeWidth = 1;
    this.tooltip.style.top = (0)+"px"
    this.tooltip.style.left = (0) + "px"
  }

  getFillColor(d) {
    if (
      d.type2 !== "" &&
      d.type1 === this.props.selectedType &&
      d.type2 !== this.props.selectedType
    ) {
      return d.type2//this.props.fillScale(d.type2);
    }
    return d.type1//this.props.fillScale(d.type1);
  }

  render() {
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    const maxData = {
      x: max(this.props.data.map((d) => d[this.props.xvariable])),
      y: max(this.props.data.map((d) => d[this.props.yvariable])),
    };
    let xScale = scaleLinear().domain([0, maxData.x]).range([0, this.width]);
    let yScale = scaleLinear().domain([0, maxData.y]).range([this.height, 0]);

    const points = this.props.data.map((d, i) => {
      let sym = symbol().size(70);
      if (d.is_legendary === 1) {
        sym.type(symbolStar);
      }

      return (
        <path
          key={"circle" + i}
          data-name={`${d.name}`}
          d={sym(d)}
          transform={`translate(${xScale(d[this.props.xvariable])},${yScale(
            d[this.props.yvariable]
          )})`}
          // fill={this.getFillColor(d)}
          // stroke={rgb(this.getFillColor(d)).darker(1)}
          r={8}
          style={{
            strokeOpacity: 1,
            strokeWidth: 1,
            opacity: 0.5,
          }}
          className={`circle ${this.getFillColor(d)}`}
          onClick={this.props.onClick}
          onMouseOver={(e) => this.mouseover(e,d)}
          onMouseMove={(e) => this.mousemove(e, d)}
          onMouseOut={(e) => this.mouseleave(e)}
        />
      );
    });
    return (
      <div className="scatter">
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
            {points}
            <Axis
              d3Axis={axisBottom}
              scale={xScale}
              translateX={0}
              translateY={this.height}
            />
            <Axis
              d3Axis={axisLeft}
              scale={yScale}
              translateX={0}
              translateY={0}
            />
          </g>
        </svg>
        <div ref={(node) => (this.tooltip = node)} className="tooltip-transparent">
          </div>
      </div>
    );
  }
}
export default ScatterPlot;
