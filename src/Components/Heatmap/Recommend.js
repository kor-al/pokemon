import React, { Component } from "react";
import { sum, min, ascending, sort } from "d3-array";
import "./Recommend.css";

const TypeListItem = ({ type_name }) => {
  return (
    <li className={"recommend__item " + type_name}>
      <img
        className="typeIcon"
        title={type_name}
        src={process.env.PUBLIC_URL + "/types/" + type_name + ".svg"}
      />
      <span className="typeText">{type_name}</span>
    </li>
  );
};

class Recommend extends Component {
  constructor(props) {
    super(props);
    this.margin = {
      top: 100,
      right: 10,
      bottom: 30,
      left: this.props.marginLeft,
    };
    this.width = this.props.size[0] - this.margin.left - this.margin.right;
    this.height = this.props.size[1] - this.margin.top - this.margin.bottom;

    this.team_weaknesses_type = [];
    this.identifyWeakness = this.identifyWeakness.bind(this);
    this.identifyRecommendedType = this.identifyRecommendedType.bind(this);
  }

  identifyWeakness() {
    let team_weaknesses = [];
    let maxVal = 0;
    this.props.vars.map((v) => {
      let min_v = min(this.props.data, (d) => d[v]);
      if (min_v >= 1) {
        team_weaknesses.push({ variable: v, value: min_v });
        if (min_v > maxVal) maxVal = min_v;
      }
    });
    team_weaknesses = team_weaknesses.sort((a, b) =>
      ascending(a.value, b.value)
    );
    this.team_weaknesses_type = team_weaknesses.filter(
      (d) => d.value === maxVal
    );
    console.log("team_weaknesses_type", this.team_weaknesses_type);
  }

  identifyRecommendedType() {
      console.log(this.props.dataRef)
    this.recommendedTypes = new Set();
    this.props.dataRef.map((d) => {
      this.team_weaknesses_type.forEach((w) => {
        if (d[w.variable] < 1) this.recommendedTypes.add(d.name);
      });
    });
  }

  render() {
    this.identifyWeakness();
    this.identifyRecommendedType();

    const weaktypes = this.team_weaknesses_type.map((t) => {
      let type_name = t.variable.slice(8);
      console.log("type_name", type_name);
      return <TypeListItem type_name={type_name} />;
    });
    const types = [...this.recommendedTypes].map((t) => {
      console.log("t", t);
      let type_name = t;
      console.log("weak type_name", type_name);
      return <TypeListItem type_name={type_name} />;
    });
    return (
      <div className="recommend">
        <div className="recommend__flex">
          {weaktypes.length > 0 && (
            <div className="recommend__weakness">
              <p>Your team is especially vulnerable to</p>
              <ul className="recommend__list">{weaktypes}</ul>
            </div>
          )}
          {weaktypes.length === 0 && (
            <div className="recommend__good">
              <p>Your team is more or less impervious to attacks of all types. For each attack type, you have at least one team member who is resistant to it to some degree.</p>
            </div>
          )}
          {types.length > 0 && (
            <div className="recommend__recommendation">
              <p>Try to add pokemons of types</p>
              <ul className="recommend__list">{types}</ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Recommend;
