import { Badge } from '@material-ui/core'
import { ShoppingCartOutlined, ArrowDropDown } from '@material-ui/icons'
import styled from 'styled-components'
import { mobile } from "../responsive"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { userLogout } from '../redux/apiCalls'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { loginGoogleSuccess } from '../redux/userRedux'
import { baseURL } from '../requestMethods'
import noAvatar from '../images/noImage.png'

const Container = styled.div`
    height: 60px;
    position: sticky;
    width: 100%;
    z-index: 999;
    top: 0;
    background-color: green;
    ${mobile({ height: "50px" })}
`
const Wrapper = styled.div`
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${mobile({ padding: "10px 0px" })}
`
const Left = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
`
const Center = styled.div`
    flex: 1;
    text-align: center;
`
const Logo = styled.h1`
    font-weight: bold;
    ${mobile({ fontSize: "16px" })}
`
const Right = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    ${mobile({ flex: 2, justifyContent: "center" })}
`
const UserItem = styled.span`
    margin-right: 20px;
    font-size: 20px;
    font-weight: 500;
`
const UserImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
`
const MenuItems = styled.div`
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;
    margin-left: 20px;
    margin-right: 20px;
    ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`

export default function Navbar() {
    const dispatch = useDispatch()
    const myStorage = window.localStorage;
    const player = useSelector(state => state.user.currentUser);
    const { products } = useSelector(state => state.cart);
    // const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const getUser = () => {
            fetch(`/auth/login/success`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            })
                .then((response) => {
                    if (response.status === 200) return response.json();
                    throw new Error("authentication has been failed!");
                })
                .then((resObject) => {
                    dispatch(loginGoogleSuccess(resObject.user));
                    //   setUser(resObject.user);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getUser();
    }, [dispatch]);

    const handleAnchor = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = () => {
        userLogout(dispatch);
        window.open(`/auth/logout`, "_self");
        myStorage.removeItem("persist:root");
    }

    return (
        <Container>
            <Wrapper>
                <Left>

                </Left>
                <Center><Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}><Logo>RAZER x GENSHIN</Logo></Link></Center>
                <Right>
                    {player ? (
                        <>
                            {/* {user ? (
                                <UserImage src={user?.image}/>
                            ) : ( 
                                null 
                            )} */}
                            {player ? (
                                <UserImage src={player?.image ? player?.image : noAvatar} />
                            ) : (
                                null
                            )}
                            {/* {user ? (
                                <MenuItems style={{marginLeft: "-5px"}}>{user?.displayName}</MenuItems>
                            ) : (
                                null
                            )} */}
                            {player ? (
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls="demo-positioned-menu"
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleAnchor}
                                    style={{ textDecoration: "none", color: "black" }}
                                >
                                    <UserItem style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {player?.username}<ArrowDropDown />
                                    </UserItem>
                                </Button>
                            ) : (
                                null
                            )}
                            {/* {user ? (
                                    <MenuItems onClick={handleLogout}>Logout</MenuItems>
                            ) : (
                                null
                            )} */}
                            {player ? (
                                <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
                                    <MenuItems onClick={handleClick}>Logout</MenuItems>
                                </Link>
                            ) : (
                                null
                            )}
                        </>
                    ) : (
                        <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
                            <MenuItems>Login</MenuItems>
                        </Link>
                    )}
                    <Link to="/cart" style={{ textDecoration: "none", color: "black" }}>
                        <MenuItems>
                            <Badge badgeContent={products.filter(f => f.username === player.username).length} color="primary">
                                <ShoppingCartOutlined />
                            </Badge>
                        </MenuItems>
                    </Link>
                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                    >
                        <Link to={`/profile/${player?._id}`} style={{ textDecoration: "none", color: "black" }}>
                            <MenuItem>Profile</MenuItem>
                        </Link>
                    </Menu>
                </Right>
            </Wrapper>
        </Container>
    )
}
