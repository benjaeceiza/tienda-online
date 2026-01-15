import ContactoFlotante from "../../components/ContactoFlotante";
import CursosHome from "./Cursos"; // Tu archivo de secciones de cursos
import Hero from "./Hero"; // ANTES ERA HEADER.JSX


const Home = () => {
    return (
        <>
            <div className="homeContainer">
                {/* 1. El Menú Fijo (Glass) */}

                <main>
                    {/* 2. La Portada Principal */}
                    <Hero />

                    {/* 3. Las Secciones de Cursos */}
                    <CursosHome />
                    
                    {/* 4. Botón flotante de WhatsApp */}
                    <ContactoFlotante />
                </main>
            </div>
        </>
    )
}

export default Home;