

const FondoMisCursos = ({ onImageLoad }) => {
    return (
        <div className="fondo-wrapper">
            {/* La capa oscura para que el texto se lea bien */}
            <div className="fondo-overlay"></div>
            
            {/* La imagen real. Usamos <img> para poder usar el evento onLoad */}
            <img 
                src="https://res.cloudinary.com/dmnksm3th/image/upload/v1770840319/fondo-mis-cursos_axu9vr.webp" 
                alt="Fondo Mis Cursos" 
                className="fondo-img"
                onLoad={onImageLoad}
                onError={onImageLoad} // Si falla, que cargue igual para no trabar la app
            />
        </div>
    );
};

export default FondoMisCursos;