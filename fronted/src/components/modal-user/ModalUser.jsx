
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModalUser = ({ isOpen, onClose, user, onLogout }) => {
    const [view, setView] = useState('profile'); 
    const navigate = useNavigate();


    if (!isOpen) return null;

    // Evita que el click dentro del modal lo cierre
    const handleContainerClick = (e) => {
        e.stopPropagation();
    };
    

    return (
        <div className="userModal_overlay" onClick={onClose}>
            <div className="userModal_container" onClick={handleContainerClick}>
                
                {/* Botón de Cerrar (X) */}
                <button className="userModal_closeBtn" onClick={onClose}>
                    &times;
                </button>

                {/* --- VISTA: PERFIL --- */}
                {view === 'profile' && (
                    <div className="userModal_content fade-in">
                        <div className="userModal_header">
                            <div className="userModal_avatar">
                                {/* Si no hay foto, mostramos la inicial */}
                                {user?.nickname ? user.nickname.charAt(0).toUpperCase() : "U"}
                            </div>
                            <h3 className="userModal_name">{user?.nickname || "Usuario"}</h3>
                            <p className="userModal_email">{user?.email || "usuario@email.com"}</p>
                        </div>

                        <div className="userModal_actions">
                            <button 
                                className="userModal_btn userModal_btn_secondary"
                                onClick={() => setView('password')}
                            >
                                🔒 Cambiar Contraseña
                            </button>
                            
                            <div className="userModal_divider"></div>

                            <button 
                                className="userModal_btn userModal_btn_logout"
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                    navigate("/");
                                }}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}

                {/* --- VISTA: CAMBIAR CONTRASEÑA --- */}
                {view === 'password' && (
                    <div className="userModal_content fade-in">
                        <h3 className="userModal_title">Nueva Contraseña</h3>
                        <p className="userModal_subtitle">Ingresa tus nuevos datos</p>

                        <form className="userModal_form" onSubmit={(e) => e.preventDefault()}>
                            <div className="userModal_inputGroup">
                                <label>Contraseña Actual</label>
                                <input type="password" placeholder="••••••" />
                            </div>
                            <div className="userModal_inputGroup">
                                <label>Nueva Contraseña</label>
                                <input type="password" placeholder="••••••" />
                            </div>

                            <div className="userModal_rowBtns">
                                <button 
                                    className="userModal_btn userModal_btn_ghost"
                                    onClick={() => setView('profile')}
                                >
                                    Volver
                                </button>
                                <button className="userModal_btn userModal_btn_primary">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ModalUser;