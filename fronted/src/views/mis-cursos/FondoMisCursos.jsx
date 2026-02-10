

const FondoMisCursos = ({ onImageLoad }) => {
    return (
        <div className="fondo-wrapper">
            {/* La capa oscura para que el texto se lea bien */}
            <div className="fondo-overlay"></div>
            
            {/* La imagen real. Usamos <img> para poder usar el evento onLoad */}
            <img 
                src="https://i.postimg.cc/3NN2dFtH/fondo_mis_cursos.png" 
                alt="Fondo Mis Cursos" 
                className="fondo-img"
                onLoad={onImageLoad}
                onError={onImageLoad} // Si falla, que cargue igual para no trabar la app
            />
        </div>
    );
};

export default FondoMisCursos;