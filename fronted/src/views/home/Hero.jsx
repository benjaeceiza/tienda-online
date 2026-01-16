import { Link } from "react-router-dom";
import mariposa from "../../assets/fondos/mariposainicio.png";

const Hero = () => {
    return (
        <header className="heroSection"> {/* Cambié la clase a heroSection */}
            <div className="heroOverlay"></div> {/* Capa oscura separada */}

            <p className="beforeTitle">Bioenergía en equilibrio terrenal y cósmico</p>
            <h1 className="titleHome">SANACION COSMOTELURICA.</h1>
            <p className="subtitleHome">
                Esta compleja estructura que es el hombre tiene un combustible especial:
                la bioenergía que es vehiculizada por la kundalini.
            </p>
            <Link to={"/cursos/sistema de sanacion cosmotelurica"}>
                <div className="btnWrapper btnHomeWrapper">
                    <svg className="ring" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            className="dashed-circle"
                        />
                    </svg>
                    <button className="btnHome">Ver<br></br>Cursos</button>
                </div></Link>

            <img className="headerMariposa" src={mariposa} alt="Mariposa" />

            {/* Degradado inferior para unir con la siguiente sección */}
            <div className="heroGradientBottom" />
        </header>
    );
};

export default Hero;