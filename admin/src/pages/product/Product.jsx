import "./product.css";
import app from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { Link, useLocation } from "react-router-dom";
import Chart from "../../components/chart/Chart"
import { productData } from "../../dummyData"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Checkbox } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { userRequest } from "../../requestMethods";
import { getProduct, stateEditProduct, stateGetUser, updateProduct } from "../../redux/apiCalls";

export default function Product() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [color, setColor] = useState("");
    const [category, setCategory] = useState("")
    const [errors1, setErrors1] = useState({ title });
    const [errors2, setErrors2] = useState({ desc });
    const [errors3, setErrors3] = useState({ price });
    const [file, setFile] = useState(null)
    const location = useLocation();
    const productId = location.pathname.split("/")[2];
    const dispatch = useDispatch();
    // eslint-disable-next-line
    const [pStats, setPStats] = useState([]);
    const [sukses, setSukses] = useState(false);
    const stockRef = useRef();
    const catRef = useRef();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [values, setValues] = useState({
        title: '',
        desc: '',
        price: '',
        categories: '',
    });

    const product = useSelector((state) => state.getProducts.getProduct);
    const updatedProduct = useSelector((state) => state.editProducts.editProduct);

    const options = [
        { label: ' Green', value: 'green' },
        { label: ' Blue', value: 'blue' },
        { label: ' Black', value: 'black' },
        { label: ' Pink', value: 'pink' },
        { label: ' Grey', value: 'grey' },
        { label: ' Red', value: 'red' },
        { label: ' Linen', value: 'linen' },
        { label: ' White', value: 'white' },
        { label: ' Yellow', value: 'yellow' },
    ];

    useEffect(() => {
        stateGetUser(dispatch);
        getProduct(productId, dispatch);
        if (updatedProduct?.response === 1) {
            stateEditProduct(dispatch);
            getProduct(productId, dispatch);
        }
    }, [dispatch, productId, updatedProduct])

    const MONTHS = useMemo(
        () => [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"
        ],
        []
    );

    useEffect(() => {
        const getStats = async () => {
            try {
                const res = await userRequest.get("orders/income?pid=" + productId, {
                    headers: {
                        token: "Bearer " + JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken,
                    },
                });
                const list = res.data.sort((a, b) => {
                    return a._id - b._id;
                });
                list.map((item) =>
                    setPStats((prev) => [
                        ...prev,
                        { name: MONTHS[item._id - 1], Sales: item.total },
                    ])
                );
            } catch (err) {
                console.log(err);
            }
        };
        getStats();
    }, [productId, MONTHS]);

    const handleChange1 = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors1({ title: '' })
        setTitle(e.target.value)
    }

    const handleChange2 = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors2({ desc: '' })
        setDesc(e.target.value)
    }

    const handleChange3 = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors3({ price: '' })
        setPrice(e.target.value)
    }

    const handleChange4 = (checkedValues) => {
        console.log('checked = ', checkedValues);
        setColor(checkedValues);
    }

    const handleChange5 = (e) => {
        console.log(catRef);
    }

    const handleClose = () => {
        setSukses(false);
    }

    const handleClick = (e) => {
        console.log("masuk");

        e.preventDefault();
        if (!values.title) {
            setErrors1({ title: "Title is Required" })
        }
        if (!values.desc) {
            setErrors2({ desc: "Description is Required" })
        }
        if (!values.price) {
            setErrors3({ price: "Price is Required" })
        }
        // console.log((values.title !== '' && values.desc !== '' && values.price !== ''), "mas ijal")

        if (values.title && values.desc && values.price) {
            if (file) {
                const fileName = new Date().getTime() + file.name;
                const storage = getStorage(app);
                const StorageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(StorageRef, file);

                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                    }
                }, function (error) {
                    // Handle unsuccessful uploads
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    console.log("bedain");

                    getDownloadURL(uploadTask.snapshot.ref).then(function (downloadURL) {
                        updateProduct(productId, {
                            ...values,
                            img: downloadURL,
                            color: color,
                            inStock: stockRef.current.value,
                            categories: catRef.current.value,
                        }, dispatch)
                        setSukses(true);
                    });
                });
            } else {
                console.log("first");

                updateProduct(productId, {
                    ...values,
                    color: color,
                    inStock: stockRef.current.value,
                    categories: catRef.current.value,
                }, dispatch)
                setSukses(true);
            }
        }
    }

    useEffect(() => {
        if (product !== null && Object.keys(product).length > 0) {
            setTitle(product?.title || '')
            setDesc(product?.desc || '')
            setPrice(product?.price || '')
            setColor(product?.color || '')
            setCategory(product?.categories || '')
            setValues({
                title: product?.title || '',
                desc: product?.desc || '',
                price: product?.price || '',
            })
        }
    }, [product])

    return (
        <div className="product">
            <>
                <Dialog
                    fullScreen={fullScreen}
                    open={sukses}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"Success"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Product Has been Successfully Updated!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
            <div className="productTitleContainer">
                <h1 className="productTitle">Product</h1>
                <Link to="/newproduct">
                    <button className="productAddButton">Create</button>
                </Link>
            </div>
            <div className="productTop">
                <div className="productTopLeft">
                    <Chart data={productData} dataKey="Sales" title="Sales Performance" />
                </div>
                <div className="productTopRight">
                    <div className="productInfoTop">
                        <img src={product?.img} alt="" className="productInfoImg" />
                        <span className="productName">{product?.title}</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">Product ID       :</span>
                            <span className="productInfoValue">{product?._id}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Sales    :</span>
                            <span className="productInfoValue">5123</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Category    :</span>
                            <span className="productInfoValue">{product?.categories}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="productBottom">
                <form className="productForm">
                    <div className="productFormLeft">
                        <TextField
                            id="standard-basic1"
                            label="Product Name"
                            variant="standard"
                            style={{ marginBottom: "10px" }}
                            type="text"
                            name="title"
                            value={title}
                            placeholder="Product Name"
                            onChange={handleChange1}
                            error={Boolean(errors1?.pass)}
                            helperText={(errors1?.pass)}
                        />
                        <label>Category</label>
                        <select name="categories" value={category} id="idCategories" ref={catRef} onChange={handleChange5}>
                            <option value="keyboard">Keyboard</option>
                            <option value="mouse">Mouse</option>
                            <option value="headset">Headset</option>
                        </select>
                        <TextField
                            id="standard-basic2"
                            label="Description"
                            variant="standard"
                            style={{ marginBottom: "15px" }}
                            type="text"
                            name="desc"
                            value={desc}
                            placeholder="Product Description"
                            onChange={handleChange2}
                            error={Boolean(errors2?.desc)}
                            helperText={(errors2?.desc)}
                        />
                        <TextField
                            id="standard-basic3"
                            label="Price"
                            variant="standard"
                            style={{ marginBottom: "10px" }}
                            type="text"
                            name="price"
                            value={price}
                            placeholder="Product Price"
                            onChange={handleChange3}
                            error={Boolean(errors3?.price)}
                            helperText={(errors3?.price)}
                        />
                        {/* <form name="color" value={color} id="idColor" ref={colorRef}>
                            <input type="checkbox" id="color1" value="black" />
                            <label> Black</label><br />
                            <input type="checkbox" id="color2" value="green" />
                            <label> Green</label><br />
                            <input type="checkbox" id="color3" value="white" />
                            <label> White</label><br />
                            <input type="checkbox" id="color4" value="blue" />
                            <label> Blue</label><br />
                            <input type="checkbox" id="color5" value="red" />
                            <label> Red</label><br />
                            <input type="checkbox" id="color6" value="yellow" />
                            <label> Yellow</label><br />
                            <input type="checkbox" id="color7" value="pink" />
                            <label> Pink</label><br />
                            <input type="checkbox" id="color8" value="grey" />
                            <label> Grey</label><br />
                        </form> */}
                        <label>Color</label>
                        <Checkbox.Group
                            options={options}
                            value={color}
                            style={{ marginBottom: "15px" }}
                            onChange={handleChange4}
                        />
                        <label>In Stock</label>
                        <select name="inStock" id="idStock" ref={stockRef}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="productFormRight">
                        <div className="productUpload">
                            <img src={product?.img} alt="" className="productUploadImg" />
                        </div>
                        <input type="file" id="file" onChange={e => setFile(e.target.files[0])} />
                        <button className="productButton" onClick={handleClick}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
