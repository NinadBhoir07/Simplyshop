import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { memo } from "react";

const PayPalButton = memo(
  ({
    amount,
    onSuccess,
    onError,
    currency = "USD", // Add default
  }) => {
    const createOrder = (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: parseFloat(amount || 0).toFixed(2),
              currency_code: currency,
            },
          },
        ],
      });
    };

    const onApproveHandler = (data, actions) => {
      return actions.order.capture().then(onSuccess).catch(onError);
    };

    return (
      <PayPalScriptProvider
        options={{
          "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
          currency: currency,
        }}
      >
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApproveHandler}
          onError={onError}
          disabled={amount <= 0}
        />
      </PayPalScriptProvider>
    );
  },
);

PayPalButton.displayName = "PayPalButton";
export default PayPalButton;
