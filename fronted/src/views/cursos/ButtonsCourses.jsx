import { useTranslation } from 'react-i18next';

const ButtonsCourses = ({ cursos, setCursoSeleccionado, cursoSeleccionado }) => {
  const { t } = useTranslation("global");

  return (
    <div className="course-select-glass-card course-select-list-card">
      <div className="course-select-list-header">
        <h2 className="course-select-list-title">{t("cursos_vista.tus_cursos")}</h2>
        <span className="course-select-count">{cursos.length} {t("cursos_vista.disponibles")}</span>
      </div>
      
      <div className="course-select-scroll-container">
        <div className="course-select-buttons-container">
          {cursos.map((c) => {
            // Verificamos si este es el curso activo
            const isActive = cursoSeleccionado?._id === c._id;
            
            return (
              <button
                key={c._id}
                className={`course-select-item-row ${isActive ? 'active' : ''}`}
                onClick={() => setCursoSeleccionado(c)}
              >
                {/* Indicador visual (Barrita lateral) */}
                <div className="course-select-indicator"></div>

                {/* Contenido del botón */}
                <div className="course-select-item-content">
                  <span className="course-select-item-title">
                    {/* 🔥 Traducción dinámica por ID */}
                    {t(`cursos_db.${c._id}.nombre`, c.nombre)}
                  </span>
                  <span className="course-select-item-status">
                    {isActive ? t("cursos_vista.reproduciendo") : t("cursos_vista.click_ver")}
                  </span>
                </div>

                {/* Icono de Play sutil */}
                <div className="course-select-item-icon">
                  {isActive ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ButtonsCourses;