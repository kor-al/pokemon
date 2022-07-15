import React, { Component } from "react";
// import "./SectionTypes.css";
import DoubleStackedBarChart from "../BarChart/DoubleStackedBarChart";
import Heatmap from "../Heatmap/Heatmap";
import BarChart from "../BarChart/BarChart";
import CustomBarChart from "../BarChart/CustomBarChart";
import CurvesBarChart from "../BarChart/CurvesBarChart";
import { format } from "d3-format";

import "./SectionTeamStats.css";

class SectionTeamStats extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="sectionTeamStats pad">
        <h2>
          <span className="step">4</span>Improve your team stats
        </h2>
        <div className="SectionTeamStats__graphics">
          <Heatmap
            data={this.props.dataTeam}
            size={[500, 300]}
            marginLeft={150}
            vars={this.props.columnsAgainst}
            items={this.props.team}
          />
          <DoubleStackedBarChart
            data={this.props.dataTeam}
            size={[500, 300]}
            items={this.props.team}
            variables={["hp", "defense"]}
            circlevariables={["hp", "sp_defense"]}
            leftvariable={"attack"}
            circleleftvariable={"sp_attack"}
          />

          <BarChart
            data={this.props.dataTeam}
            size={[500, 300]}
            xvariable={"speed"}
            items={this.props.team}
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
            size={[500, 300]}
            items={this.props.team}
            xvariable={"weight_kg"}
            yvariable={"height_m"}
            colorvariable={"experience_growth"}
          />

          <CurvesBarChart
            data={this.props.dataTeam}
            size={[500, 300]}
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