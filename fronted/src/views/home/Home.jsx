



import ContactoFlotante from "../../components/ContactoFlotante";
import Cursos from "./Cursos";
import Header from "./Header";



const Home = () => {

    return (
        <>

            <div className="homeContainer">
                <Header />
                <main>
                    <Cursos />
                    <ContactoFlotante />
                </main>
            </div>
        </>
    )
}

export default Home;