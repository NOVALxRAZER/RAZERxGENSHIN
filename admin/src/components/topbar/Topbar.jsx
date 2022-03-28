import React from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { userLogout } from "../../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";

export default function Topbar() {
    const myStorage = window.localStorage;
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.currentUser);

    const handleClick = () => {
        userLogout(dispatch);
        myStorage.removeItem("persist:root");
    }

    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <a href="/" style={{ textDecoration: "none" }}>
                        <span className="logo">Razer Admin</span>
                    </a>
                </div>
                <div className="topRight">
                    <div className="topbarIconContainer">
                        <a href="/login" style={{ textDecoration: "none", color: "black" }} onClick={handleClick}>Logout</a>
                    </div>
                    <div className="topbarIconContainer">
                        <NotificationsNone />
                        <span className="topIconBadge">2</span>
                    </div>
                    <div className="topbarIconContainer">
                        <Language />
                        <span className="topIconBadge">2</span>
                    </div>
                    <div className="topbarIconContainer">
                        <Settings />
                    </div>
                    <img src={user.image} alt="" className="topAvatar" />
                </div>
            </div>
        </div>
    );
}
