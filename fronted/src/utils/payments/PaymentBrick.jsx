import { useEffect } from "react";
import { LoadMercadoPagoSDK } from "./LoadMercadoPagoSdk";

const PaymentBrick = ({
  publicKey,
  preferenceId,
  amount = 10000,
}) => {
  useEffect(() => {
    let brickController;

    const initBrick = async () => {
      try {
        const MercadoPago = await LoadMercadoPagoSDK();

        const mp = new MercadoPago(publicKey, {
          locale: "es-AR",
        });

        const bricksBuilder = mp.bricks();

        brickController = await bricksBuilder.create(
          "payment",
          "paymentBrick_container",
          {
            initialization: {
              amount,
              preferenceId,
              payer: {
                firstName: "",
                lastName: "",
                email: "",
              },
            },
            customization: {
              visual: {
                style: {
                  theme: "default",
                },
              },
              paymentMethods: {
                creditCard: "all",
                debitCard: "all",
                ticket: "all",
                bankTransfer: "all",
                onboarding_credits: "all",
                wallet_purchase: "all",
                maxInstallments: 1,
              },
            },
            callbacks: {
              onReady: () => {
                console.log("Payment Brick listo");
              },
              onSubmit: ({ formData }) => {
                return new Promise((resolve, reject) => {
                  fetch("/process_payment", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                  })
                    .then((res) => res.json())
                    .then(() => resolve())
                    .catch(() => reject());
                });
              },
              onError: (error) => {
                console.error("Error en el Brick:", error);
              },
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    initBrick();

    return () => {
      if (brickController) {
        brickController.unmount();
      }
    };
  }, [publicKey, preferenceId, amount]);

  return <div id="paymentBrick_container" />;
};

export default PaymentBrick;
