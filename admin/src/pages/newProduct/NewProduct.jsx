import "./newProduct.css";
import { Checkbox } from 'antd';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import app from "../../firebase";
import { addProduct, stateGetProduct, stateGetUser } from "../../redux/apiCalls";
import { useDispatch } from "react-redux"

export default function NewProduct() {
    const [inputs, setInputs] = useState("")
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [cat, setCat] = useState([]);
    const [color, setColor] = useState([]);
    const [errors1, setErrors1] = useState({ title });
    const [errors2, setErrors2] = useState({ desc });
    const [errors3, setErrors3] = useState({ price });
    const [sukses, setSukses] = useState(false);
    const [values, setValues] = useState({
        title: '',
        desc: '',
        price: '',
    });
    const dispatch = useDispatch()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useState(() => {
        stateGetUser(dispatch);
        stateGetProduct(dispatch);
    }, [dispatch])

    const handleChange = (e) => {
        setInputs(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        });
    }

    const handleChange1 = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors1({ title: '' })
        setTitle(e.target.value);
    }

    const handleChange2 = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors2({ desc: '' })
        setDesc(e.target.value);
    }

    const handleChange3 = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors3({ price: '' })
        setPrice(e.target.value);
    }

    const handleChange4 = (checkedValues) => {
        console.log('checked = ', checkedValues);
        setCat(checkedValues);
    }

    const handleChange5 = (checkedValues) => {
        console.log('checked = ', checkedValues);
        setColor(checkedValues);
    }

    const handleClick = (e) => {
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
                    getDownloadURL(uploadTask.snapshot.ref).then(function (downloadURL) {
                        addProduct({
                            ...values,
                            ...inputs,
                            img: downloadURL,
                            color: color,
                            categories: cat,
                        }, dispatch);
                        setSukses(true)
                    });
                });
            } else {
                addProduct({
                    ...values,
                    ...inputs,
                    color: color,
                    categories: cat,
                }, dispatch)
                setSukses(true)
            }
        }
    }

    console.log(values, "values");

    const handleClose = () => {
        setSukses(false);
    }

    const options = [
        { label: ' Keyboard', value: 'keyboard' },
        { label: ' Mouse', value: 'mouse' },
        { label: ' Headset', value: 'headset' },
    ];

    const options2 = [
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

    return (
        <div className="newProduct">
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
                            Product Has been Successfully Added!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
            <h1 className="addProductTitle">New Product</h1>
            <form className="addProductForm">
                <div className="addProductItem">
                    <label>Image</label>
                    <input type="file" id="file" onChange={e => setFile(e.target.files[0])} />
                </div>
                <div className="addProductItem">
                    <TextField
                        id="title"
                        label="Product Name"
                        variant="standard"
                        type="text"
                        name="title"
                        placeholder="Product Name"
                        onChange={handleChange1}
                        error={Boolean(errors1?.title)}
                        helperText={(errors1?.title)}
                    />
                </div>
                <div className="addProductItem">
                    <TextField
                        id="description"
                        label="Description"
                        variant="standard"
                        type="text"
                        name="desc"
                        placeholder="Product Description"
                        onChange={handleChange2}
                        error={Boolean(errors2?.desc)}
                        helperText={(errors2?.desc)}
                    />
                </div>
                <div className="addProductItem">
                    <TextField
                        id="price"
                        label="Price"
                        variant="standard"
                        type="text"
                        name="price"
                        placeholder="Product Price"
                        onChange={handleChange3}
                        error={Boolean(errors3?.price)}
                        helperText={(errors3?.price)}
                    />
                </div>
                <div className="addProductItem">
                    <label>Categories</label>
                    <Checkbox.Group
                        options={options}
                        onChange={handleChange4}
                    />
                </div>
                <div className="addProductItem">
                    <label>Color</label>
                    <Checkbox.Group
                        options={options2}
                        onChange={handleChange5}
                    />
                </div>
                <div className="addProductItem">
                    <label>Stock</label>
                    <select name="inStock" onChange={handleChange}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <button onClick={handleClick} className="addProductButton">Create</button>
            </form>
        </div>
    );
}
