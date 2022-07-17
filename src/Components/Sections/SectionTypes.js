import React, { Component} from "react";
import dataFlow from "../../pokemonTypesCounts";
import { getDataByOneType, summarizeGroupedData } from "../../preprocess";
import { groups } from "d3-array";
import { median, max, min } from "d3-array";
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
    console.log(100, this.props.size.screenWidth/5)

    return (
      <section className="sectionTypes pad">
        <div className="section__header"><span className="step">1</span>
        <h2>Compare and choose Pokémon types</h2></div>
        <div className="sectionTypes__graphics">
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
              size={[min([950, this.props.size.screenWidth]), min([300, this.props.size.screenWidth])]}
              yvariable={this.props.valueDropdownTypeStat}
              onClick={this.props.handleViolinClick}
            />
          </div>
        <div className="heatmap__wrapper">
          <Heatmap
            data={summarizedDataByType}
            size={[min([500, this.props.size.screenWidth]), min([500, this.props.size.screenWidth])]}
            marginLeft={min([110, this.props.size.screenWidth/4])}
            vars={this.props.columnsAgainst}
            items={summarizedDataByType.map((d) => d.name)}
          />
        </div>
          <ChordDiagram
            data={dataFlow}
            size={[min([500, this.props.size.screenWidth]), min([500, this.props.size.screenWidth])]}
            items={this.props.types}
            fillScale={this.props.colorScale_type}
          />
        </div>
      </section>
    );
  }
}
export default SectionTypes;
