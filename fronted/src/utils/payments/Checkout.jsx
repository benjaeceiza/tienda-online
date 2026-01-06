import { useEffect } from "react";
import PaymentBrick from "./PaymentBrick";
import { useLoading } from "../../context/LoadingContext";

const Checkout = () => {

  const { hideLoader } = useLoading();

  useEffect(() => {
    hideLoader();
  }, [])

  
  return (
    <div>
      <h2>Pagar</h2>

      <PaymentBrick
        publicKey="YOUR_PUBLIC_KEY"
        preferenceId="PREFERENCE_ID"
        amount={10000}
      />
    </div>
  );
};

export default Checkout;