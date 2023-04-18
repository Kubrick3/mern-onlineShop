import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "./Rating";

function Product(props) {
  const { item } = props;

  return (
    <Card>
      <Link to={`/product/${item.slug}`}>
        <img src={item.image} className="card-img-top" alt={item.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${item.slug}`}>
          <Card.Title>{item.name}</Card.Title>
        </Link>
        <Rating rating={item.rating} numReviews={item.numReviews} />
        <Card.Text>Rp.{item.price}</Card.Text>
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
