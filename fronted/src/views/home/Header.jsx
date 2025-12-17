import { useRef } from "react";
import StarfieldFX from "../../utils/StarfieldFX";
import mariposa from "../../assets/fondos/mariposainicio.png";


const Header = () => {

    const heroRef = useRef(null);
    return (
        <>
            <header
                className="headerHome"
                ref={heroRef}
                style={{ position: "relative", overflow: "hidden" }}
            >
                <StarfieldFX targetRef={heroRef} />

                <p className="beforeTitle">Bioenergía en equilibrio terrenal y cósmico</p>
                <h1 className="titleHome">SANACION COSMOTELURICA.</h1>
                <p className="subtitleHome">
                    Esta compleja estructura que es el hombre tiene un combustible especial:
                    la bioenergía que es vehiculizada por la kundalini.
                </p>
                <img className="headerMariposa" src={mariposa} alt="Mariposa" />
            </header>
        </>
    );
};

export default Header;
