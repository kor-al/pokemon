import React, { Component } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { min, max, mean, rollup } from "d3-array";
import { area, curveCatmullRom } from "d3-shape";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";

class ViolinChartKDE extends Component {
  constructor(props) {
    super(props);
    this.createViolinChart = this.createViolinChart.bind(this);
  }

  componentDidMount() {
    this.createViolinChart();
  }

  componentDidUpdate() {
    this.createViolinChart();
  }

  createViolinChart() {
    const node = this.node;
    select(node).select("*").remove(); //clean
    var margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const width = this.props.size[0] - margin.left - margin.right;
    const height = this.props.size[1] - margin.top - margin.bottom;
    const nodeg_translated = select(node)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const yMax = max(this.props.data.map((d) => d[this.props.yvariable]));
    const yMin = min(this.props.data.map((d) => d[this.props.yvariable]));
    var yScale = scaleLinear().domain([0, yMax]).range([height, 0]);
    //var xScale = scaleLinear().domain([0, 30]).range([0, 20]);
    const types = this.props.fillScale.domain();
    var xScale = scaleBand().domain(types).range([0, width]).padding(0.2); // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    const dataByTypes = this.props.dataGrouped;

    var kde = kernelDensityEstimator(kernelEpanechnikov(0.2), yScale.ticks(50));

    // Build and Show the Y scale
    nodeg_translated.append("g").call(axisLeft(yScale));

    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    nodeg_translated
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(xScale));

    var sumstat = rollup(dataByTypes, (d) => {
      let input = d[0][1].map((g) => {
        return g[this.props.yvariable];
      }); // Keep the variable called Sepal_Length
      let density = kde(input); // And compute the binning on it.
      return density;
    });

    console.log("sumstat", sumstat);

    // What is the biggest value that the density estimate reach?
    var maxNum = 0;
    for (let i in sumstat) {
      let allBins = sumstat[i].value;
      let kdeValues = allBins.map(function (a) {
        return a[1];
      });
      let biggest = max(kdeValues);
      if (biggest > maxNum) {
        maxNum = biggest;
      }
    }
    var areaViolinFunc = (xscale) => {
      return area()
        .x0((d) => xscale(-d.length))
        .x1((d) => xscale(d.length))
        .y((d) => yScale(d.x0)) // yScale(d[this.props.yvariable]))
        .curve(curveCatmullRom);
    };

    // nodeg_translated
    //   .selectAll("g.violin")
    //   .data(dataByTypes)
    //   .enter()
    //   .append("g")
    //   .attr("class", "violin");
    // select(node).selectAll("g.violin").data(dataByTypes).exit().remove();

    // nodeg_translated
    //   .selectAll("g.violin")
    //   .data(dataByTypes)
    //   .attr("class", (d) => d[0])
    //   .attr("transform", (d, i) => {return `translate(${xScale(d[0])},0)`})//#`translate(${30 + i * step},0)`)
    //   .append("path")
    //   .style("stroke", "black")
    //   .style("fill", (d, i) => this.props.fillScale(d[0]))
    //   .attr("d", (d) => {
    //     const yData = d[1].map((d) => isNaN(d[this.props.yvariable])? 0 : d[this.props.yvariable]);
    //     const hist = histFunc(yData);
    //     const histData = hist(yData);
    //     console.log(d[0],histData)
    //     const maxBinData = max(histData.map(d => d.length))
    //     const minBinData = 0;
    //     const groupScale =   scaleLinear().range([0, xScale.bandwidth()]).domain([-maxBinData,maxBinData])
    //     const areaViolinScaled = areaViolinFunc(groupScale);
    //     return areaViolinScaled(histData);
    //   })
    //   .on("click", e=> this.props.onClick(e));
  }

  render() {
    return (
      <svg
        ref={(node) => (this.node = node)}
        width={this.props.size[0]}
        height={this.props.size[1]}
      ></svg>
    );
  }
}

// 2 functions needed for kernel density estimate
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [
        x,
        mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });
  };
}
function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

export default ViolinChartKDE;
