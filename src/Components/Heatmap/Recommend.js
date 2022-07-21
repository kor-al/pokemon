import React, { Component } from "react";
import { min, ascending } from "d3-array";
import "./Recommend.css";

const TypeListItem = ({ type_name, i }) => {
  return (
    <li key={"typeListItem" + i} className={"recommend__item " + type_name}>
      <img
        className="typeIcon"
        title={type_name}
        alt={type_name}
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
    this.props.vars.forEach((v) => {
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
  }

  //   identifyRecommendedType() {
  //     this.recommendedTypes = new Set();
  //     this.props.dataRef.forEach((d) => {
  //       this.team_weaknesses_type.forEach((w) => {
  //         if (d[w.variable] < 1) this.recommendedTypes.add(d.name);
  //       });
  //     });
  //   }

  identifyRecommendedType() {
    // {against_type : x} where x is count of how much it can be recommended
    let countRecommendedTypes = {};
    this.props.dataRef.forEach((d) => {
      this.team_weaknesses_type.forEach((w) => {
        if (d[w.variable] < 1) {
          if (d.name in countRecommendedTypes)
            countRecommendedTypes[d.name] += 1;
          else countRecommendedTypes[d.name] = 1;
        }
      });
    });

    //make it sortable
    this.recommendedTypes = [];
    for (var type in countRecommendedTypes) {
      this.recommendedTypes.push([type, countRecommendedTypes[type]]);
    }
    //sort by the number of occurrences
    this.recommendedTypes.sort(function (a, b) {
      return b[1] - a[1];
    });

    //take only types but not occurrences
    this.recommendedTypes = this.recommendedTypes.map((d) => d[0]);
  }

  render() {
    this.identifyWeakness();
    this.identifyRecommendedType();

    const weaktypes = this.team_weaknesses_type.map((t, i) => {
      let type_name = t.variable.slice(8);
      return <TypeListItem type_name={type_name} i={i} />;
    });
    const types = this.recommendedTypes.map((t, i) => {
      let type_name = t;
      return <TypeListItem type_name={type_name} i={(1+i)*20} />;
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
            <div className="recommend__success">
              <p>
                Your team is more or less impervious to attacks of all types.
                For each attack type, you have at least one team member who is
                resistant to it to some degree.
              </p>
              <div className="success__img">
                <img
                  className="success__background"
                  alt={"Reward"}
                  src={process.env.PUBLIC_URL + "/reward_bkg.svg"}
                />
                <img
                  className="successIcon"
                  title={"Success!"}
                  alt={"Success"}
                  src={process.env.PUBLIC_URL + "/Dream_Razz_Berry_Sprite.webp"}
                />
              </div>
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
