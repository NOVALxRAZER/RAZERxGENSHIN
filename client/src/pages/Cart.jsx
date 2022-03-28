import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { mobile } from '../responsive'
import StripeCheckout from 'react-stripe-checkout'
import { useEffect, useState } from 'react'
import { userRequest } from '../requestMethods'
import { useHistory } from 'react-router'
import { deleteCart, deleteProduct } from '../redux/cartRedux'
import { Link } from '@mui/material'

const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div``
const Wrapper = styled.div`
    padding: 20px;
    ${mobile({ padding: "10px" })}
`
const Title = styled.h1`
    font-weight: 300;
    text-align: center;
`
const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
`
const DeleteAllButton = styled.div`
    border-radius: 5px;
    border: none;
    padding: 9px;
    cursor: pointer;
    background-color: red;
    color: white;
    font-weight: 600;
`
const TopButton = styled.button`
    border-radius: 5px;
    border: none;
    padding: 13px;
    cursor: pointer;
    background-color: darkblue;
    color: white;
    font-weight: 700;
`
const TopTexts = styled.div`
    ${mobile({ display: "none" })}
`
const TopText = styled.span`
    text-decoration: underline;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0px 10px;
    font-weight: 600;
`
const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobile({ flexDirection: "column" })}
`
const Info = styled.div`
    flex: 3;
`
const Product = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobile({ flexDirection: "column" })}
`
const ProductDetail = styled.div`
    flex: 2;
    display: flex;
`
const Image = styled.img`
    width: 200px;
    height: 200px;
`
const Details = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`
const ProductName = styled.span``
const ProductId = styled.span``
const ProductColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${props => props.color};
`
const PriceDetail = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`
const ProductAmount = styled.div`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0px 5px;
    border-radius: 10px;
    border: 1px solid green;
    ${mobile({ margin: "5px 15px" })}
`
const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 300;
    ${mobile({ marginBottom: "20px" })}
`
const Hr = styled.hr`
    background-color: lightgreen;
    border: none;
    height: 1px;
    margin: 20px 0px;
`

const Summary = styled.div`
    flex: 1;
    border: 0.5px solid lightgreen;
    border-radius: 10px;
    padding: 20px;
    height: 35vh;
`
const SummaryTitle = styled.h1`
    font-weight: 400;
`
const SummaryItem = styled.div`
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    font-weight: ${props => props.type === "total" && "500"};
    font-size: ${props => props.type === "total" && "24px"};
`
const SummaryItemText = styled.span``
const SummaryItemPrice = styled.span``
const Button = styled.button`
    width: 100%;
    padding: 15px;
    background-color: green;
    color: white;
    font-weight: 600;
    cursor: pointer;
`
const DeleteProduct = styled.div`
    border-radius: 5px;
    border: none;
    padding: 10px;
    cursor: pointer;
    background-color: red;
    color: white;
    margin-top: 15px;
    font-weight: 600;
`

export default function Cart() {
    const cart = useSelector(state => state.cart)
    const player = useSelector(state => state.user.currentUser);

    const { products } = useSelector(state => state.cart);
    let shoppingBag = products.filter(f => f.username === player.username)

    const [stripeToken, setStripeToken] = useState(null);
    const history = useHistory();
    const dispatch = useDispatch();

    const onToken = token => {
        setStripeToken(token);
    };

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const res = await userRequest.post("/checkout/payment", {
                    tokenId: stripeToken.id,
                    amount: 100,
                }, {
                    headers: {
                        token: "Bearer " + JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken,
                    },
                });
                history.push("/success", {
                    stripeData: res.data,
                    products: cart,
                });
            } catch { }
        };
        stripeToken && makeRequest();
    }, [stripeToken, cart.total, history, cart]);

    const handleDelete = (id, cart) => {
        let filtered = cart.products.filter(function (val) {
            return val._id !== id
        });
        const nextTotal = filtered.map(item => {
            return item.price * item.quantity;
        }).reduce((prev, next) => prev + next, 0)
        dispatch(deleteProduct({ cart: filtered, totalCart: nextTotal }))
    }

    const handleDeleteAll = (id) => {
        dispatch(deleteCart(id));
    }

    return (
        <Container>
            <Navbar />
            <Wrapper>
                <Title>SHOPPING BAG</Title>
                <Top>
                    {shoppingBag.length >= 2 ? (
                        <DeleteAllButton onClick={handleDeleteAll}>Delete All Products</DeleteAllButton>
                    ) : (
                        null
                    )}
                    <TopTexts>
                        <TopText>Shopping Bag ({shoppingBag.length})</TopText>
                    </TopTexts>
                    <Link href="/">
                        <TopButton>Back to Homepage</TopButton>
                    </Link>
                </Top>
                <Bottom>
                    <Info>
                        {shoppingBag.map(product => (
                            <Product key={product._id}>
                                <ProductDetail>
                                    <Image src={product.img} />
                                    <Details>
                                        <ProductName><b>Product : </b>{product.title}</ProductName>
                                        <ProductId><b>ID : </b>{product._id}</ProductId>
                                        <ProductColor color={product.color} />
                                    </Details>
                                </ProductDetail>
                                <PriceDetail>
                                    <ProductAmountContainer>
                                        <ProductAmount>{product.quantity}</ProductAmount>
                                    </ProductAmountContainer>
                                    <ProductPrice>Rp. {product.price * product.quantity}</ProductPrice>
                                    <DeleteProduct onClick={() => handleDelete(product._id, cart)}>Delete Product</DeleteProduct>
                                </PriceDetail>
                            </Product>
                        ))}
                    </Info>
                    <Hr />
                    <Summary>
                        <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                        <SummaryItem>
                            <SummaryItemText>Subtotal</SummaryItemText>
                            <SummaryItemPrice>Rp. {cart.total}</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Shipping Price</SummaryItemText>
                            <SummaryItemPrice>Rp. 15.000</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Shipping Voucher</SummaryItemText>
                            <SummaryItemPrice>Rp. 15.000</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem type="total">
                            <SummaryItemText>Total</SummaryItemText>
                            <SummaryItemPrice>Rp. {cart.total}</SummaryItemPrice>
                        </SummaryItem>
                        <StripeCheckout
                            name="RAZER x GENSHIN"
                            image="https://www.nicepng.com/png/full/177-1779468_razer-logo-png-razer-minimalist.png"
                            billingAddress
                            shippingAddress
                            description={`Your Total Billing is Rp. ${cart.total}`}
                            amount={cart.total * 100}
                            token={onToken}
                            stripeKey={KEY}
                        >
                            <Button>CHECKOUT</Button>
                        </StripeCheckout>
                    </Summary>
                </Bottom>
            </Wrapper>
            <Footer />
        </Container>
    )
}
