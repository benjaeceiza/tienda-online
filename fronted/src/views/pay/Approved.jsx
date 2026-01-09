import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";

export const Approved = () => {
    const [params] = useSearchParams();

    const paymentId =
        params.get("payment_id") ||
        params.get("collection_id");

    const [status, setStatus] = useState("pending");

    const { hideLoader } = useLoading();

    useEffect(() => {

        hideLoader();

        if (!paymentId) return;

        const check = async () => {
            const res = await fetch(
                "http://localhost:8080/api/payments/mp/verify/" + paymentId
            );
            const data = await res.json();
            setStatus(data.status);
        };

        check();
    }, [paymentId]);

    if (!paymentId) {

        return (
            <>
                <div className="messagePayContainer">
                    <h1>⏳ Esperando confirmación del pago...</h1>
                </div>
            </>
        );
    }

    if (status === "approved") {
        return (
            <>
                <div className="messagePayContainer">
                    <h1>✅ Pago aprobado, curso habilitado</h1>
                    <Link to={"/mis-cursos"} className="btn btnCheckout">Ir a mis cursos</Link>
                </div>
            </>
        );
    }


    return (
        <>
            <div className="messagePayContainer">
                <h1>⏳ Validando pago...</h1>
            </div>
        </>
    );
}


export default Approved;