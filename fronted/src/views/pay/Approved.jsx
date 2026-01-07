import { useSearchParams } from "react-router-dom";
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
        return <h1>⏳ Esperando confirmación del pago...</h1>;
    }

    if (status === "approved") {
        return <h1>✅ Pago aprobado, curso habilitado</h1>;
    }

    return <h1>⏳ Validando pago...</h1>;
}


export default Approved;