import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import './Cart.css'
import StripeCheckout from "react-stripe-checkout";
import stripelogo from '../../../assets/logo.png';
import { userRequest } from "../../requestMethods";
import { useSelector } from "react-redux";

const KEY="pk_test_51NFWIoSHZMAO9ZiqEsCXCRsefCHjPc7PEIPcvPFd3adADiSK4JlWpPGFvVvVwVsHNp3FalSPnuC5sjTfzu4wrkqX00w6xOXVEF"

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  const navigate = useNavigate();

  
  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await userRequest.post("/checkout/payment", {
          tokenId: stripeToken.id,
          amount: 500,
        });
        navigate("/success", {
          stripeData: res.data,
          products: cart, });
      } catch {}
    };
    stripeToken && makeRequest();
  }, [stripeToken, cart.total, navigate]);


  return (
    <div className="cart-con">
      <Navbar />      
      <div className="cart-wrapper">
        <h1>YOUR BAG</h1>
        <div className="cart-top">
          <button>CONTINUE SHOPPING</button>          
          <button type="filled">CHECKOUT NOW</button>
        </div>        
        <div className="cart-bottom">
          <div style={{flex: '3'}} className="procart">            
          {cart.products.map((product) => (
            <div className="cart-pro">
              <div className="cart-pro-de">
              <img className="cart-img" src={product.img} />
                <div className="detail">
                  <span >
                  <b>Product:</b> {product.title}
                  </span>
                  <span>
                  <b>ID:</b> {product._id}
                  </span>
                  <div className="cart-pro-color" color={product.color} style={{ backgroundColor: product.color }}/>
                  
                  <b>Size:</b> {product.size}
                  
                </div>
              </div>
              <div className="pricede">
                <div>                
                  <span style={{fontSize : '30px'}}>Quantity : {product.quantity}</span>                                    
                </div>
                <span style={{fontSize : '30px'}}>
                ₹ {product.price * product.quantity}
                </span>
              </div>
            </div>
            ))}                                    
            <hr />            
          </div>
          <div className="sum">
            <span style={{fontWeight: "200"}}>ORDER SUMMARY</span>
            <div className="si shipping">
                <div className="sub">
                <span>Subtotal</span>
                 <span>₹ {cart.total}</span>              
                </div>
                <div className="sub">
                <span>Estimated Shipping</span>
                 <span>₹ 40</span>
                </div>
              
              </div>
            <div className="si">
              <span>Shipping Discount</span>
              <span>₹ 20</span>
            </div>
            <div type="total" className="si">
              <span>Total</span>
              <span>₹ {cart.total}</span>
              </div>

            <StripeCheckout
              name="Fossil Cart"
              image={stripelogo}
              billingAddress
              shippingAddress
              description={`Your total is ₹${cart.total}`}
              amount={cart.total * 100}
              token={onToken}
              stripeKey={KEY}>
              <button className="btn">CHECKOUT NOW</button>
            </StripeCheckout>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;