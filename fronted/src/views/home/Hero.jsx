import logo from "../../assets/logos/logo-transparente.png";

const Hero = () => {
    return (
        <header className="heroSection"> {/* Cambié la clase a heroSection */}
            <div className="heroOverlay"></div> {/* Capa oscura separada */}

            <img className="logo-inicio" src={logo} alt="" />
            <p className="beforeTitle">Bioenergía en equilibrio terrenal y cósmico</p>
            <h1 className="titleHome">SANACIÓN COSMOTELÚRICA.</h1>
            <p className="subtitleHome">
                Sanación energética que une Cosmos, Tierra y Conciencia.
            </p>
            {/* Degradado inferior para unir con la siguiente sección */}
            <div className="heroGradientBottom" />
        </header>
    );
};

export default Hero;