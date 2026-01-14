
import mariposa from "../../assets/fondos/mariposainicio.png";

const Header = () => {
    return (
        <>
            <header
                className="headerHome"
                style={{ position: "relative", overflow: "hidden" }}
            >
                <p className="beforeTitle">Bioenergía en equilibrio terrenal y cósmico</p>
                <h1 className="titleHome">SANACION COSMOTELURICA.</h1>
                <p className="subtitleHome">
                    Esta compleja estructura que es el hombre tiene un combustible especial:
                    la bioenergía que es vehiculizada por la kundalini.
                </p>
                
                <img className="headerMariposa" src={mariposa} alt="Mariposa" />

                {/* --- AGREGADO: EL DEGRADADO --- */}
                <div 
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "150px", // Ajusta esto para que el degradado sea más largo o corto
                        background: "linear-gradient(to bottom, transparent, #f186a8)", // OJO AQUÍ
                        pointerEvents: "none", // Esto es para que el click pase a través si hay botones abajo
                        zIndex: 2 // Para asegurarnos que esté por encima del fondo
                    }}
                />
            </header>
        </>
    );
};

export default Header;