import ContactoFlotante from "../../components/ContactoFlotante";
import CursosHome from "./Cursos"; 
import Hero from "./Hero"; 
import Saludo from "./Saludo";
import Agradecimiento from "./Agradecimiento"; 

const Home = () => {
    return (
        <>
            <div className="homeContainer">
                <main>
                    <Hero />
                    
                    <Saludo />

                    <Agradecimiento />

                    <CursosHome />
                    
                    <ContactoFlotante />
                </main>
            </div>
        </>
    )
}

export default Home;