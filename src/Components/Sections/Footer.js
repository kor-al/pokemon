import React from "react";
import "./Footer.css";

function Footer(props) {
  return (
    <footer className="footer pad">
      <div className="footer__text">
        <p>
          Data visualization based on the Pokémon dataset of{" "}
          <a href="https://onyxdata.co.uk/dataset_challenge/july-2022/">
            the July Onyx DataDNA Challenge
          </a>
        </p>
        <p>
          Developed and designed by Alisa Korinevskaya. Code available at{" "}
          <a href="https://github.com/kor-al">GitHub</a>
        </p>
      </div>
      <div className="footer_side"><img className="footer__img" src={process.env.PUBLIC_URL + "Dream_Dive_Ball_Sprite.webp"}/></div>
    </footer>
  );
}

export default Footer;
