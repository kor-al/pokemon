import React, { Component, useRef, useEffect } from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { symbol, symbolStar } from "d3-shape";

import "./ScatterPlot.css";

const Axis = ({ d3Axis, scale, translateX, translateY }) => {
  const anchor = useRef();

  const axis = d3Axis(scale);

  useEffect(() => {
    select(anchor.current).call(axis);
  }, [scale,axis]);

  return (
    <g transform={`translate(${translateX}, ${translateY})`} ref={anchor} />
  );
};

const Legend = ({ symbols, labels, width, hight }) => {
  const legend = labels.map((label, i) => {
    return (
      <g key={"legendg" + i} transform={`translate(${20},${5 + 20*i })`}>
        <path
          key={"legendcircle" + i}
          d={symbols[i]()}
          r={8}
          style={{
            strokeOpacity: 1,
            strokeWidth: 1,
            opacity: 0.5,
          }}
          // className={`circle ${this.getTypeColoring(d)}`}
        />
        <text key={"legendtext" + i} x={20} y={2} alignmentBaseline="middle">{label}</text>
      </g>
    );
  });
  return <g className="legend">{legend}</g>;
};

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 30, right: 30, bottom: 50, left: 50 };

    this.getTypeColoring = this.getTypeColoring.bind(this);

    this.mouseover = this.mouseover.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  mouseover = function (e, d) {
    let point = e.target;
    this.tooltip.style.opacity = 1;
    point.style.strokeOpacity = 1;
    point.style.strokeWidth = 2;

    this.tooltip.innerHTML = `
    <img class="tooltip__img" src=${
      process.env.PUBLIC_URL + "/pokemons/" + d.pokedex_number + ".png"
    }>
    <div class="tooltip__text">${d.name}</div>
    <div class="tooltip__text">${d.classfication}</div>`;
  };

  mousemove = function (e, d) {
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
    this.tooltip.style.top = e.pageY + "px";
    this.tooltip.style.left = e.pageX + "px";
  };

  mouseleave = function (e) {
    let point = e.target;
    this.tooltip.style.opacity = 0;
    point.style.strokeOpacity = 0.5;
    point.style.strokeWidth = 1;
    this.tooltip.style.top = 0 + "px";
    this.tooltip.style.left = 0 + "px";
  };

  getTypeColoring(d) {
    if (
      d.type2 !== "" &&
      d.type1 === this.props.selectedType &&
      d.type2 !== this.props.selectedType
    ) {
      return d.type2; //this.props.fillScale(d.type2);
    }
    return d.type1; //this.props.fillScale(d.type1);
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
    const symbol_circle = symbol().size(70);
    const symbol_star = symbol().size(70).type(symbolStar);

    const points = this.props.data.map((d, i) => {
      let sym = symbol_circle;
      if (d.is_legendary === 1) {
        sym = symbol_star;
      }

      return (
        <path
          key={"circle" + i}
          data-name={`${d.name}`}
          d={sym(d)}
          transform={`translate(${xScale(d[this.props.xvariable])},${yScale(
            d[this.props.yvariable]
          )})`}
          // fill={this.getTypeColoring(d)}
          // stroke={rgb(this.getTypeColoring(d)).darker(1)}
          r={8}
          style={{
            strokeOpacity: 1,
            strokeWidth: 1,
            opacity: 0.5,
          }}
          className={`circle ${this.getTypeColoring(d)}`}
          onClick={this.props.onClick}
          onMouseOver={(e) => this.mouseover(e, d)}
          onMouseMove={(e) => this.mousemove(e, d)}
          onMouseOut={(e) => this.mouseleave(e)}
        />
      );
    });

    const labelX = (
      <text x={this.width / 2} y={this.height + 40} textAnchor="middle">
        {this.props.xvariable}
      </text>
    );
    const labelY = (
      <text
        x={-this.height / 2}
        y={-40}
        transform={`rotate(-90)`}
        textAnchor="middle"
      >
        {this.props.yvariable}
      </text>
    );

    return (
      <div className="scatter">
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
            <g>{points}</g>
            {labelX}
            {labelY}
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
            <Legend
              symbols={[symbol_circle, symbol_star]}
              labels={["Non-Legendary Pokémon", "Legendary Pokémon"]}
              width={this.width}
              height={this.height}
            />
          </g>
        </svg>
        <div
          ref={(node) => (this.tooltip = node)}
          className="tooltip-transparent"
        ></div>
      </div>
    );
  }
}
export default ScatterPlot;
