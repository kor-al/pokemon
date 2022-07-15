import React, { Component} from "react";
import dataFlow from "../../pokemonTypesCounts";
import { getDataByOneType, summarizeGroupedData } from "../../preprocess";
import { groups } from "d3-array";
import { median } from "d3-array";
import "./SectionTypes.css";

import Dropdown from "../Dropdown";
import ChordDiagram from "../Circle/ChordDiagram";
import ViolinChart from "../ViolinChart/ViolinChart";
import Heatmap from "../Heatmap/Heatmap";

class SectionTypes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dataByTypes = groups(
      this.props.data.filter((d) => d.type2 === ""),
      (d) => d.type1
    ); //only one-typed pokemons
    const summarizedDataByType = summarizeGroupedData(
      dataByTypes,
      this.props.columnsAgainst,
      median
    );
    const dataOneType = getDataByOneType(this.props.data);
    const dataOneTypeByTypes = groups(dataOneType, (d) => d.type); //all pokemons with types in first and secons positions

    return (
      <section className="sectionTypes pad">
        <h2><span className="step">1</span>Choose types of your pokemons</h2>
        <div className="sectionTypes__graphics">
          <Heatmap
            data={summarizedDataByType}
            size={[500, 500]}
            marginLeft={100}
            vars={this.props.columnsAgainst}
            items={summarizedDataByType.map((d) => d.name)}
          />

          <ChordDiagram
            data={dataFlow}
            size={[500, 500]}
            items={this.props.types}
            fillScale={this.props.colorScale_type}
          />
          <div className="violin__wrapper">
          <p>Click on a colored shape to select a type</p>
            <Dropdown
              label="Stat"
              options={this.props.baseStats.map((t) => ({
                label: t,
                value: t,
              }))}
              value={this.props.valueDropdownTypeStat}
              onChange={(e) =>
                this.props.handleDropdownChange(e, "valueDropdownTypeStat")
              }
            />
            <ViolinChart
              fillScale={this.props.colorScale_type}
              data={dataOneType} //TODO: remove it as it's needed only to calc max ranges
              dataGrouped={dataOneTypeByTypes}
              size={[900, 200]}
              yvariable={this.props.valueDropdownTypeStat}
              onClick={this.props.handleViolinClick}
            />
          </div>
        </div>
      </section>
    );
  }
}
export default SectionTypes;
