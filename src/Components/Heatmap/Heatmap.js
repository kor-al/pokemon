import React, { Component } from "react";
import { scaleLinear, scaleBand, scaleSequential} from "d3-scale";
import { interpolateInferno, interpolateGreens, interpolateRdYlBu, interpolateSpectral, interpolateRdYlGn} from "d3-scale-chromatic";
import "./Heatmap.css"



class Heatmap extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 100, right: 10, bottom: 30, left: this.props.marginLeft };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.tyleSize = {height: 50, width:50}
    this.maxValue = 4;

    this.rowTiles = this.rowTiles.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  mouseover = function(e) {
    let tile=e.target
    this.tooltip.style.opacity = 1
    tile.style.strokeOpacity = 1;
    tile.style.strokeWidth = 2;
  }
  
  mousemove = function(e) {
    const tile=e.target
    this.tooltip.innerHTML = `${tile.dataset.name} - damage by <span class=${tile.dataset.var.slice(8)}>${tile.dataset.var.slice(8)}</span> is ${tile.dataset.val}`
    this.tooltip.style.top = (e.pageY+10)+"px"
    this.tooltip.style.left = (e.pageX+10) + "px"
  }
  
  mouseleave = function(e) {
    let tile=e.target
    this.tooltip.style.opacity = 0
    tile.style.strokeOpacity = 0.5;
    tile.style.strokeWidth = 1;
  }


  rowTiles = (d, xScale, yScale, colorScale) => {
    return this.props.vars.map((variable, i) => (
      <rect
        key={`tile-${i}`}
        x={xScale(variable)}
        y={yScale(d.name)}
        // fill={colorScale(d[variable])}
        className={"tile damage-"+d[variable]*100}
        height={yScale.bandwidth()}
        width={xScale.bandwidth()}
        rx={4}
        ry={4}
        data-name={d.name}
        data-var={variable}
        data-val={d[variable]}
        onMouseOver={(e) => this.mouseover(e)}
        onMouseMove={(e) => this.mousemove(e)}
        onMouseOut={(e) => this.mouseleave(e)}
      />
    ));
  };

  render() {
    this.margin = { top: 100, right: 10, bottom: 30, left: this.props.marginLeft };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;

    let xScale = scaleBand()
      .domain(this.props.vars)
      .range([0, this.width])
      .padding(0.1);

    let yScale = scaleBand()
      .domain(this.props.items)
      .range([this.height, 0])
      .padding(0.1);

    var colorScale = scaleSequential( t => interpolateRdYlGn(1-t))
      // .interpolator(interpolateGreens)
      .domain([0, this.maxValue]);
      // .domain([0, 0.25, 0.5, 1, 2]);

    const tiles = this.props.data.map((d, i) => {
      return (
        <g key={"g" + i} data-name={`${d.name}`} className={d.name}>
          {this.rowTiles(d, xScale, yScale, colorScale)}
        </g>
      );
    });

    const labelsY = this.props.data.map((d, i) => {
        let rotate = 0
        let translateX = -10;
        let translateY = yScale(d.name) + yScale.bandwidth()/2;
        return (
          <text key={"text" + i} textAnchor = "end" alignmentBaseline="middle"
          transform={`rotate(${rotate}) translate(${translateX}, ${translateY})`}>
            {d.name}
          </text>
        );
      });

    const labelsX = this.props.vars.map((d, i) => {
        let rotate = -90
        let translateX = 10;
        let translateY =xScale(d) + xScale.bandwidth()/2
        return (
          <text key={"text" + i} textAnchor = "start" alignmentBaseline="middle" className="heatmap__label-x"
          transform={`rotate(${rotate}) translate(${translateX}, ${translateY})`}>
            {d.slice(8)}
          </text>
        );
      });

      const axisName = <text key={"axisNameX"} fontWeight="bold" x={this.width/2} y={-this.margin.top+10} textAnchor = "middle" alignmentBaseline="middle">
          Attacker
          </text>

// const axisYName = <text key={"axisNameY"} transform={`rotate(-90) translate(${0},${0})`} fontWeight="bold" x={-this.height/2} y={-this.margin.left+10} textAnchor = "middle" alignmentBaseline="middle">
// Defender
// </text>


    return (
      <div className="heatmap" >
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
          {tiles}
          {labelsX}
          {labelsY}
          {axisName}
          {/* {axisYName} */}
        </g>
      </svg>
      <div ref={(node) => (this.tooltip = node)} className="tooltip"/>
      </div>
    );
  }
}
export default Heatmap;
