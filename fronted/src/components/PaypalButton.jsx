import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

const urlBackend = import.meta.env.VITE_API_URL_BACKEND;

const PaypalButton = ({ courseId, userId }) => {

    const navigate = useNavigate();

    const initialOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, 
        currency: "USD",
        intent: "capture",
    };



    const handleCreateOrder = async (data, actions) => {
        try {
            const response = await fetch(`${urlBackend}/payments/pp/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseID: courseId }),
            });

            const order = await response.json();
            return order.id;
        } catch (error) {
            console.error("Error creando la orden:", error);
            navigate("/pago-fallido"); // <--- Si falla al crear, vamos a fallido
        }
    };

    const handleApprove = async (data, actions) => {
        try {
            const response = await fetch(`${urlBackend}/payments/pp/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderID: data.orderID,
                    userID: userId,
                    courseID: courseId
                }),
            });

            const details = await response.json();

            if (details.completed) {
                if (details.token) {
                    localStorage.setItem('token', details.token);
                }
                // AGREGAMOS "&provider=paypal" AL FINAL
                navigate(`/pago-exitoso?payment_id=${data.orderID}&provider=paypal`);
            } else {
                // Si el backend dice que no se completó
                navigate("/pago-fallido");
            }

        } catch (error) {
            console.error("Error capturando la orden:", error);
            navigate("/pago-fallido");
        }
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
                onError={() => navigate("/pago-fallido")} // Si PayPal detecta error
                onCancel={() => console.log("Pago cancelado")} // Opcional: navigate("/pago-fallido")
            />
        </PayPalScriptProvider>
    );
};

export default PaypalButton;