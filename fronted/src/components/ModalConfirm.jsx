import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



const ModalConfirm = ({ setShowModal }) => {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const closeSession = () => {
        logout();
        setShowModal(false);
        navigate("/");
    };


    return (

        <>
            <div className="modalConfirmContainer">
                <div className="modalConfirmBox">
                    <h2 className="modalConfirmTitle">¿Estás seguro?</h2>
                    <div className="modalConfirmButtons">
                        <button className="btnCancel" onClick={() => setShowModal(false)}>Cancelar</button>
                        <button className="btnConfirm" onClick={() => closeSession()} >Confirmar</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalConfirm;