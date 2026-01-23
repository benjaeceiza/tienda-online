// config/paypal.js
import paypal from '@paypal/checkout-server-sdk';

// Configuración del entorno
const environment = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (process.env.PAYPAL_API_ENV === 'live') {
        return new paypal.core.LiveEnvironment(clientId, clientSecret);
    }

    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

// Exportamos la función client como named export
export const client = () => {
    return new paypal.core.PayPalHttpClient(environment());
};