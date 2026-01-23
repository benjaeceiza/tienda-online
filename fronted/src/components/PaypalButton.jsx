import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

// Este componente recibe el precio, nombre del curso y el ID del curso/usuario para procesar la compra
const PaypalButton = ({ courseId, userId }) => {

    const navigate = useNavigate();

    const initialOptions = {
        "client-id": "AT7wf-cc6pHvNFXO1J-WPKLttOa_MrmdtAleYX99ivQkl15NRn4bNWLxNbENlVd3KdN_DLXBh9x9Ga7s",
        currency: "USD",
        intent: "capture",
    };

    const handleCreateOrder = async (data, actions) => {
        // 1. Llamamos a TU backend para crear la orden
        try {
            const response = await fetch("http://localhost:8080/api/payments/pp/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseID: courseId
                }),
            });

            const order = await response.json();


            return order.id;
        } catch (error) {
            console.error("Error creando la orden:", error);
        }
    };

    const handleApprove = async (data, actions) => {
        // 2. PayPal ya cobró, ahora avisamos a TU backend para que libere el curso
        try {
            const response = await fetch("http://localhost:8080/api/payments/pp/capture-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderID: data.orderID, // ID que devuelve PayPal
                    userID: userId,        // ID del usuario logueado
                    courseID: courseId     // ID del curso que compró
                }),
            });

            const details = await response.json();

            if (details.completed) {

                if (details.token) {
                    localStorage.setItem('token', details.token); 
                }

                navigate('/mis-cursos');
            } else {
                alert("Hubo un problema al procesar el pago.");
            }

        } catch (error) {
            console.error("Error capturando la orden:", error);
        }
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            {/* Aquí puedes personalizar el estilo del botón */}
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
            />
        </PayPalScriptProvider>
    );
};

export default PaypalButton;