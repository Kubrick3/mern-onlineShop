import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");

  useEffect(()=> {
    if(!userInfo){
        navigate('/signin?redirect=/shipping')
    }
  },[userInfo, navigate])
  const submitHandler = (event) => {
    event.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
      },
    });

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
      })
    );
    navigate("/payment");
  };

  return (
    <div>
      <Helmet>
        <title>Shipping</title>
      </Helmet>
      <CheckoutSteps step1 step2/>
      <div className="container small-container">
        <h1 className="my-3">Shipping</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alamat</Form.Label>
            <Form.Control
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kota</Form.Label>
            <Form.Control
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kode Pos</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ShippingScreen;
