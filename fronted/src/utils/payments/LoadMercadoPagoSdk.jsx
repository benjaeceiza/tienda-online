export const LoadMercadoPagoSDK = () => {
    return new Promise((resolve, reject) => {
        if (window.MercadoPago) {
            resolve(window.MercadoPago);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.async = true;

        script.onload = () => resolve(window.MercadoPago);
        script.onerror = () => reject("Error cargando MercadoPago SDK");

        document.body.appendChild(script);
    });
};