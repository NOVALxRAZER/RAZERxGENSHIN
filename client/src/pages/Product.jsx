import { Add, Remove } from "@material-ui/icons"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Radio } from 'antd';
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import styled from "styled-components"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import Newsletter from "../components/Newsletter"
import { userRequest } from "../requestMethods"
import { mobile } from "../responsive"
import { useDispatch, useSelector } from "react-redux"
import { addProduct } from "../redux/cartRedux"

const Container = styled.div`

`
const Wrapper = styled.div`
    padding: 50px;
    display: flex;
    ${mobile({ padding: "10px", flexDirection: "column" })}
`
const ImgContainer = styled.div`
    flex: 1;
`
const Image = styled.img`
    width: 100%;
    height: 60vh;
    ${mobile({ height: "30vh" })}
`
const InfoContainer = styled.div`
    flex: 1;
    padding: 0px 50px;
    ${mobile({ padding: "10px" })}
`
const Title = styled.h1`
    font-weight: 600;
`
const Desc = styled.p`
    font-weight: 400;
    font-size: 20px;
    margin: 20px 0px;
`
const Price = styled.span`
    font-weight: 200;
    font-size: 40px;
`
const FilterContainer = styled.div`
    width: 50%;
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    ${mobile({ width: "100%" })}
`
const Filter = styled.div`
    /* flex-direction: "column"; */
`
const FilterTitle = styled.span`
    font-size: 20px;
    font-weight: 500;
`
// const FilterColor = styled.div`
//     width: 20px;
//     height: 20px;
//     border-radius: 50%;
//     background-color: ${props => props.color};
//     margin: 0px 5px;
//     text-shadow: #000 0px 0px 4px;
//     cursor: pointer;
// `
const AddContainer = styled.div`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${mobile({ width: "100%" })}
`
const AmountContainer = styled.div`
    display: flex;
    align-items: center;
    font-weight: 700;
`
const Amount = styled.span`
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border: 1px solid green;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 5px;
`
const CartButton = styled.button`
    padding: 15px;
    border: 2px solid green;
    border-radius: 10px;
    background-color: #e9ffeb;
    font-weight: 500;
    cursor: pointer;

    &:hover{
        background-color: #6f836f;
    }
`

export default function Product() {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [color, setColor] = useState("");
    const [sukses, setSukses] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();

    const player = useSelector(state => state.user.currentUser);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await userRequest.get(`/products/find/${id}`, {
                    headers: {
                        token: "Bearer " + JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken,
                    },
                });
                setProduct(res.data);
            } catch (err) {

            }
        }
        getProduct();
    }, [id]);

    const handleQuantity = (type) => {
        if (type === "dec") {
            quantity > 1 && setQuantity(quantity - 1);
        } else {
            setQuantity(quantity + 1);
        }
    };

    const handleClick = () => {
        dispatch(addProduct({
            ...product,
            quantity,
            color,
            username: player.username, //Kirim Username ke FrontEnd atau Headers untuk Identifikasi bahwa Cart ini Punya Username tersebut
        }));
        setSukses(true);
    }

    const handleClose = () => {
        setSukses(false);
    }

    const onChange = e => {
        console.log('radio checked', e.target.value);
        setColor(e.target.value);
    };

    return (
        <Container>
            <>
                <Dialog
                    fullScreen={fullScreen}
                    open={sukses}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"Added to Shopping Bag"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Product Has Been Added to Shopping Bag!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
            <Navbar />
            <Wrapper>
                <ImgContainer>
                    <Image src={product.img} />
                </ImgContainer>
                <InfoContainer>
                    <Title>{product.title}</Title>
                    <Desc>{product.desc}</Desc>
                    <Price>{"Rp. " + product.price}</Price>
                    <FilterContainer>
                        <Filter>
                            <FilterTitle>Color :</FilterTitle>
                            {product.color?.map((c) => (
                                /* // <Filter color={c} key={c} onClick={() => setColor(c)} /> */
                                <>
                                    <Radio.Group style={{ marginRight: "10px", marginTop: "15px" }} key={c} onChange={onChange} value={color} row>
                                        <Radio style={{ textTransform: 'capitalize' }} value={c} key={c}> {c}</Radio>
                                    </Radio.Group>
                                </>
                            ))}
                        </Filter>
                    </FilterContainer>
                    <AddContainer>
                        <AmountContainer>
                            <Remove cursor="pointer" onClick={() => handleQuantity("dec")} />
                            <Amount>{quantity}</Amount>
                            <Add cursor="pointer" onClick={() => handleQuantity("inc")} />
                        </AmountContainer>
                        <CartButton onClick={() => handleClick()}>ADD TO CART</CartButton>
                    </AddContainer>
                </InfoContainer>
            </Wrapper>
            <Newsletter />
            <Footer />
        </Container>
    )
}
