import React, { useContext, useEffect, useReducer } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import Axios from "axios";
import LoadingBox from "../components/LoadingBox";


const reducer = (state,action) => {
    switch (action.type){
        case "CREATE_REQUEST":
            return {...state, loading: true};
        case "CREATE_SUCCSESS":
            return {...state, loading: false};
        case "CREATE_FAIL":
            return {...state, loading: false};
        default:
            return state;
    }
}

function CheckoutScreen() {

    const [{loading}, dispatch] = useReducer(reducer, {
        loading: false,
    });

  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((acc, cur) => acc + cur.quantity * cur.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice > 7000000 ? round2(0) : round2(100000);

  cart.taxPrice = round2(0.01 * cart.itemsPrice);

  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const checkoutHandler = async () => {
    try{
        dispatch({type: "CREATE_REQUEST"});
        const {data} = await Axios.post('/api/orders',
        {
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        },{
            headers: {
                authorization: `Bearer ${userInfo.token}`
            }
        });
        ctxDispatch({type: "CART_CLEAR"});
        dispatch({type: "CREATE_SUCCESS"})
        localStorage.removeItem('cartItems');
        navigate(`/order/${data.order._id}`)
    }catch(err){
        dispatch({type : "CREATE_FAIL"});
        toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Checkout</title>
      </Helmet>
      <h1 className="my-3">Checkout</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName}
                <br />
                <strong>Address:</strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{" "}
                      </Col>
                      <Col md={4}>
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>Rp.{item.price.toLocaleString()}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                    <Row>
                        <Col>Items</Col>
                        <Col>Rp{cart.itemsPrice.toLocaleString()}</Col>
                    </Row>
                    </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>Rp{cart.shippingPrice.toLocaleString()}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>Rp{cart.taxPrice.toLocaleString()}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>Rp{cart.totalPrice.toLocaleString()}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    onClick={checkoutHandler}
                    disabled={cart.cartItems.length === 0}
                  >
                    Checkout
                  </Button>
                </div>
                {loading && <LoadingBox></LoadingBox>}
              </ListGroup.Item>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CheckoutScreen;
