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
    this.chord = {}
    this.init = this.init.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
  }

  onMouseOver(e){
    // const nodes = select(e.target.parentElement).selectAll(`.${e.target.dataset.name}`)
    const index = e.target.dataset.name
    const chord = document.querySelector(".chord")
    const ribbons = chord.querySelectorAll("path.ribbon")
    const arcs = chord.querySelectorAll("path.arc")
    // paths.forEach(p=>{
    //     if(p.dataset.name !=index) p.style.opacity = "0.3";
    // })
    // const connections = this.chord.filter(d=> d.source.index == index)
    // const targetIndices = connections.map(d=> d.target.index)
    let connectedIndices = []
    ribbons.forEach(p=>{
        if((p.dataset.target !=index )&& (p.dataset.source!=index) ) {
            p.style.opacity = "0.2";
            p.style.stroke = "2";}
        if(p.dataset.target == index) connectedIndices.push(p.dataset.source)
        if(p.dataset.source == index) connectedIndices.push(p.dataset.target)
    })
    arcs.forEach(p=>{
        if(!connectedIndices.includes(p.dataset.name) ){
            p.style.opacity = "0.2";
            p.style.stroke = "2";}
    })
  }

  onMouseOut(e){
    const paths = Array.from(document.querySelector(".chord").querySelectorAll("path"))
    paths.forEach(p=>{ p.style.opacity = "1";
    })
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
    this.chord = res;

    var arcGen = arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle);
    var itemArcs = res.groups.map((d, i) => (
      <path
        key={"path" + i}
        className={"arc"}
        data-name={`${d.index}`}
        d={arcGen(d)}
        style={{ fill: this.props.fillScale(this.props.items[d.index]) }}
        onMouseOver={(e) => this.onMouseOver(e)}
        onMouseOut={(e) => this.onMouseOut(e)}
      />
    ));
    var labels = res.groups.map((d, i) => {
      let angle = (d.startAngle + d.endAngle) / 2;
      let rotate = (angle * 180 / Math.PI - 90)
      let translateX = (this.outerRadius +10)
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
        className={"ribbon"}
        d={ribbonGen(d)}
        data-source={`${d.source.index}`}
        data-target={`${d.target.index}`}
        style={{ fill: this.props.fillScale(this.props.items[d.source.index]) }}
      />
    ));

    return (
      <svg width={this.props.size[0]} height={this.props.size[1]} className="chord">
        <g transform={`translate(${this.props.size[0] / 2}, ${this.props.size[1] / 2})`}>
          {itemArcs}
          {ribbons}
          {labels}
        </g>
      </svg>
    );
  }
}

export default ChordDiagram;
