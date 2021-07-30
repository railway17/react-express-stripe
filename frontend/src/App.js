import React from 'react';
import scriptLoader from 'react-async-script-loader';
import axios from 'axios';

const CURRENCY = 'cad';

const toCent = amount => amount * 100;

const StripeForm = ({ isScriptLoaded, isScriptLoadSucceed }) => {
  const [stripe, setStripe] = React.useState(null);

  React.useEffect(() => {
    if (isScriptLoaded && isScriptLoadSucceed) {
      setStripe(window.Stripe('pk_test_51JIuyEDqBUsC4lJzgBirWlQRKXrxOFYAFX025Cx22KSfpLb3kfO9IrO362IQ4qllhZxyuSOVsBfdVi8NXCRjPOPB00ZlZeH01w'));
    }
  }, [isScriptLoaded, isScriptLoadSucceed]);

  const [amount, setAmount] = React.useState(0);

  const handleSubmit = async event => {
    event.preventDefault();

    const session = await axios.post(
      'https://dashboard.choice.red/payment/session-initiate',
      {
        customerEmail: 'dev@choice.marketing',
        // clientReferenceId:
        //   'IDENTIFIER_TO_MAP_YOUR_CUSTOMER_TO_YOUR_PRODUCT_LATER',
        lineItem: {
          name: 'Han MingYun',
          description: 'Test Credit Card Payment',
          // images: ['https://image.cnbcfm.com/api/v1/image/106187392-1571322289627gettyimages-1044704448.jpg?v=1571322316&w=740&h=416'],
          amount: toCent(amount),
          currency: CURRENCY,
          quantity: 1,
        },
        successUrl: 'https://dashboard.choice.red/success',
        cancelUrl: 'https://dashboard.choice.red/cancel',
      }
    );

    const result = await stripe.redirectToCheckout({
      sessionId: session.data.id,
    });

    console.log(result.error.message);
  };

  if (!stripe) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />
      CAD
      <button type="submit">Buy</button>
    </form>
  );
};

export default scriptLoader('https://js.stripe.com/v3/')(StripeForm);
