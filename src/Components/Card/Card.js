import React, { Component, useRef, useEffect } from "react";
import "./Card.css"

class Card extends Component {
    constructor(props) {
      super(props);
    }

  
    render() {
        return <div className={"card "+ this.props.data.type1+"--transparent"}>
            <h3>{this.props.data.name}</h3>
            <p>{this.props.data.japanese_name}</p>
            <img className="card__portrait" src={process.env.PUBLIC_URL + "/pokemons/" + this.props.data.pokedex_number + ".png"}/>
            <img className="typeIcon" src={process.env.PUBLIC_URL + "/types/" + this.props.data.type1 + ".svg"}/>
            {this.props.data.type2 != "" && <img className="typeIcon" src={process.env.PUBLIC_URL + "/types/" + this.props.data.type2 + ".svg"}/>}
            <div>HP:{this.props.data.hp}</div>
            <div>Attack:{this.props.data.attack}</div>
            <div>Defense:{this.props.data.defense}</div>
        </div>
    }
      
  }
  export default Card;
  