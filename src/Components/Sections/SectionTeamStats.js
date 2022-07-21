import React, { Component } from "react";
// import "./SectionTypes.css";
import DoubleStackedBarChart from "../BarChart/DoubleStackedBarChart";
import Heatmap from "../Heatmap/Heatmap";
import BarChart from "../BarChart/BarChart";
import CustomBarChart from "../BarChart/CustomBarChart";
import CurvesBarChart from "../BarChart/CurvesBarChart";
import Recommend from "../Heatmap/Recommend";
import { format } from "d3-format";
import { min} from "d3-array";

import "./SectionTeamStats.css";

class SectionTeamStats extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <section className="sectionTeamStats pad">
        <div className="section__header">
          <span className="step">4</span>
          <h2>Improve your team stats</h2>
        </div>
        <div className="SectionTeamStats__graphics">
          <Heatmap
            data={this.props.dataTeam}
            size={[
              min([500, this.props.size.screenWidth]),
              min([300, this.props.size.screenWidth]),
            ]}
            marginLeft={this.props.size.screenWidth > 400 ? 150 : 100}
            vars={this.props.columnsAgainst}
            items={this.props.team}
          />

          <Recommend
            data={this.props.dataTeam}
            dataRef={this.props.dataRef}
            size={[
              min([500, this.props.size.screenWidth]),
              min([300, this.props.size.screenWidth]),
            ]}
            vars={this.props.columnsAgainst}
          />

          <DoubleStackedBarChart
            data={this.props.dataTeam}
            size={[
              min([500, this.props.size.screenWidth]),
              min([300, this.props.size.screenWidth]),
            ]}
            marginLeft={this.props.size.screenWidth > 400 ? 150 : 100}
            variables={["hp", "defense"]}
            circlevariables={["hp", "sp_defense"]}
            leftvariable={"attack"}
            circleleftvariable={"sp_attack"}
          />

          <BarChart
            data={this.props.dataTeam}
            size={[
              min([500, this.props.size.screenWidth]),
              min([300, this.props.size.screenWidth]),
            ]}
            marginLeft={this.props.size.screenWidth > 400 ? 150 : 100}
            xvariable={"speed"}
            text={this.props.dataTeam.map((d) => ({
              name: d.name,
              x: d.speed,
              text: `faster than ${format(".0%")(
                d.speed_rank / this.props.data.length
              )}`,
            }))}
          />

          <CustomBarChart
            data={this.props.dataTeam}
            size={[min([500, this.props.size.screenWidth]), 400]}
            xvariable={"weight_kg"}
            yvariable={"height_m"}
            colorvariable={"experience_growth"}
          />

          <CurvesBarChart
            data={this.props.dataTeam}
            size={[min([500, this.props.size.screenWidth]), 400]}
            items={this.props.team}
            leftvariable={"capture_rate"}
            rightvariable={"base_egg_steps"}
            rvariable={"base_happiness"}
          />
        </div>
      </section>
    );
  }
}
export default SectionTeamStats;
