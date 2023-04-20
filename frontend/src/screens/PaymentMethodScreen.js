import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispath } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  },[shippingAddress, navigate]);
  const [paymentMethodName, setPaymentMethod] = useState( paymentMethod || "PayPal");

  const submitHandler = (event) => {
    event.preventDefault();
    ctxDispath({type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName})
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/checkout')
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
        <div className="container small-container">
          <Helmet>
            <title>Payment Method</title>
          </Helmet>
          <h1 className="my-5">Payment Method</h1>
          <Form onSubmit={submitHandler}>
            <div className="mb-3">
              <Form.Check
                type="radio"
                id="PayPal"
                label="PayPal"
                value="PayPal"
                checked={paymentMethodName === "PayPal"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <Form.Check
                type="radio"
                id="Stripe"
                label="Stripe"
                value="Stripe"
                checked={paymentMethodName === "Stripe"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
            </div>
            <Button type="submit">Continue</Button>
          </Form>
        </div>
    </div>
  );
}

export default PaymentMethodScreen;
