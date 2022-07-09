import React, { Component, useRef, useEffect } from "react";
import { chord, ribbon } from "d3-chord";
import { scaleLinear, scaleBand } from "d3-scale";
import { min, max, bin, groups, descending } from "d3-array";
import { arc } from "d3-shape";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
class ChordDiagram extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 30, right: 50, bottom: 30, left: 50 };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;
    this.innerRadius = Math.min(this.width, this.height) * 0.39;
    this.outerRadius = this.innerRadius * 1.1;
    this.mapping = {};
    this.matrix = [];
    this.init = this.init.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
  }

  onMouseOver(e){
    // const nodes = select(e.target.parentElement).selectAll(`.${e.target.dataset.name}`)
    // select(e.target.parentElement).classed("dimmed", true)
    // nodes.classed("highlighted", true)
    
  }

  fade(opacity) {
    return function (g, i) {
        svg.selectAll(".chord path")
            .filter(function (d) { return d.source.index != i && d.target.index != i; })
            // .transition()
            .style("opacity", opacity);
            console.log("name: "+config.gnames[i].buurt);
    };}

  onMouseOut(e){
    // select(e.target.parentElement).style("stroke", "black");
    // console.log(e.target.classList[0])
    // select("."+e.target.classList[0]).style("stroke", "black");
  }

  mapItemsToIndex = (items) => {
    let result = {};
    items.forEach((d, i) => {
      result[d] = i;
    });
    return result;
  };

  init() {
    this.mapping = this.mapItemsToIndex(this.props.items);

    this.props.data.forEach((flow) => {
      if (!this.matrix[this.mapping[flow.type2]]) {
        this.matrix[this.mapping[flow.type2]] = new Array(
          this.props.items.length
        ).fill(0);
      }
      this.matrix[this.mapping[flow.type2]][this.mapping[flow.type1]] = flow.n;
    });
  }

  render() {
    this.init();
    var res = chord()
      .padAngle(0.05) // padding between entities (black arc)
      .sortSubgroups(descending)(this.matrix);

    console.log("res", res);
    var arcGen = arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle);
    var itemArcs = res.groups.map((d, i) => (
      <path
        key={"path" + i}
        data-name={`${d.index}`}
        d={arcGen(d)}
        style={{ fill: this.props.fillScale(this.props.items[d.index]) }}
      />
    ));
    var labels = res.groups.map((d, i) => {
      let angle = (d.startAngle + d.endAngle) / 2;
      let rotate = (angle * 180 / Math.PI - 90)
      let translateX = (this.outerRadius)
      let translateY = (0)
      let transform = `rotate(${rotate}) translate(${translateX}, ${translateY})`
      let anchor = null
      if (angle > Math.PI){
        transform += "rotate(180)"
        anchor = "end"
      }
      return (
        <text
          key={"text" + i}
          data-name={`${d.index}`}
          textAnchor={anchor}
          alignmentBaseline="middle"
          transform={transform}
          style={{
            color: this.props.fillScale(this.props.items[d.index])
          }}
        >
          {this.props.items[d.index]}
        </text>
      );
    });

    var ribbonGen = ribbon()
      .source((d) => d.source)
      .target((d) => d.target)
      .radius(this.innerRadius);

    var ribbons = res.map((d, i) => (
      <path
        key={"ribbon" + i}
        d={ribbonGen(d)}
        style={{ fill: this.props.fillScale(this.props.items[d.source.index]) }}
        onMouseOver={(e) => this.onMouseOver(e)}
        onMouseOut={(e) => this.onMouseOut(e)}
      />
    ));

    return (
      <svg width={this.props.size[0]} height={this.props.size[1]}>
        <g transform={`translate(${this.width / 2}, ${this.height / 2})`}>
          {itemArcs}
          {ribbons}
          {labels}
        </g>
      </svg>
    );
  }
}

export default ChordDiagram;
