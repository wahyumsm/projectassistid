import { Button, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Autocomplete from '@mui/material/Autocomplete';

import axios from 'axios'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import AccessContext from '../context/AccesProvider'
import { blue, red } from '@mui/material/colors';


//INI ADALAH STATE  
const Home = () => {
    const { accessToken } = useContext(AccessContext)
    const [pegawai, setPegawai] = useState([]);
    const [listProvinsi, setListProvinsi] = useState([]);
    const [listKabupaten, setListKabupaten] = useState([]);
    const [listKelurahan, setListKelurahan] = useState([]);
    const [listKecamatan, setListKecamatan] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({});
    const [editId, setEditId] = useState("");

    //INI FUNGSI MEREAD DATA PADA DATABASE
    const getObject = async () => {
        await axios({
            method: 'GET',
            url: 'https://61601920faa03600179fb8d2.mockapi.io/pegawai',
            headers: {
                'Authorization': 'Bearer' + accessToken
            }
        }).then((res) => {
            setPegawai(res.data)
            // }

            //     if (res.data?.data) {

        })
    }

    //ini data pada provinsi yang di ambil dari database provinsi
    const getListProvinsi = async () => {
        await axios({
            method: 'GET',
            url: 'http://dev.farizdotid.com/api/daerahindonesia/provinsi',
            headers: {
                'Authorization': 'Bearer' + accessToken
            }

        }).then((res) => {
            if (res.data) {
                console.log(res.data.provinsi);

                const mapProvinsi = res.data.provinsi.map(v => ({
                    id: v.id,
                    label: v.nama,
                }));

                console.log(mapProvinsi);
                setListProvinsi(mapProvinsi)
            }
        })
    }
    useEffect(() => {
        getObject();

        // data provinsi dibutuhkan untuk autocomplete provinsi
        getListProvinsi();
    }, [])


    //INI API DARI Kabupaten AUTOCOMPLETE MENGAMBIl DARI API Kabupaten
    const getListKabupaten = async (id) => {
        console.log(id, "ini kabupaten")


        await axios({
            method: 'GET',
            url: `http://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`,
            headers: {
                'Authorization': 'Bearer' + accessToken
            }

        }).then((res) => {
            if (res.data) {
                console.log(res.data.kabupaten);

                const mapKabupaten = res.data.kota_kabupaten.map(v => ({
                    id: v.id,
                    label: v.nama,
                }));
                console.log(mapKabupaten)
                setListKabupaten(mapKabupaten)
            }
        })
    }


    //INI API YANG DIAMBIL DARI DATA  BASE URL DARI Kecamatan
    const getListKecamatan = async (id) => {
        console.log(id, "ini adalah Kecamatan")


        await axios({
            method: 'GET',
            url: 'http://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=' + id,
            headers: {
                'Authorization': 'Bearer' + accessToken
            }
        }).then((res) => {
            if (res.data) {
                console.log(res.data.kecamatan);

                const mapKecamatan = res.data.kecamatan.map(v => ({
                    id: v.id,
                    label: v.nama,
                }));
                console.log(mapKecamatan)
                setListKecamatan(mapKecamatan)
            }
        })
    }
    //INI DIAMBIL DARI DATABASE KELURAHAN API
    const getListKelurahan = async (id) => {
        console.log(id, "ini adalah keluarahan")


        await axios({
            method: 'GET',
            url: 'https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=' + id,
            headers: {
                'Authorization': 'Bearer' + accessToken
            }
        }).then((res) => {
            if (res.data) {
                console.log(res.data.getListKelurahan);

                const mapKelurahan = res.data.kelurahan.map(v => ({
                    id: v.id,
                    label: v.nama,
                }));
                console.log(mapKelurahan)
                setListKelurahan(mapKelurahan)
            }
        })
    }



    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    //INI UNTUK MENGAPUS PADA HALAMAN APLIKASI DATA PEGAWAI
    const handleDelete = async (id) => {
        await axios({
            method: 'DELETE',
            url: 'https://61601920faa03600179fb8d2.mockapi.io/pegawai/' + id,

            headers: {
                'Authorization': 'Bearer' + accessToken
            }
        }).then((res) => {
            if (res.data) {
                alert('apakah anda yakin menghapusnya ? data anda')


                getObject();
            }
        })

    }
    //INI FUNGSI MEMBUAT DATA PADA  BACKEND API
    const handleCreate = async () => {
        const payload = {
            nama: form.nama,
            kabupaten: form.kabupaten,
            provinsi: form.provinsi,
            kelurahan: form.kelurahan,
            kecamatan: form.kecamatan
        }
        console.log(payload);
        await axios({
            method: 'POST',
            url: 'https://61601920faa03600179fb8d2.mockapi.io/pegawai',
            headers: {
                'Authorization': 'Bearer' + accessToken
            },
            data: payload,
        }).then((res) => {
            alert('Sukses Menambah data')
            setForm({});
            getObject();
        })

    }

    const e = () => {
        console.log('e')
    }
    //INI FUNGSI UNTUK MEMBUKA HALAMAN PADA EDIT
    const handleEdit = (value) => {
        console.log(value);
        setForm({
            nama: value.nama,
            kabupaten: value.kabupaten,
            provinsi: value.provinsi,
            kelurahan: value.kelurahan,
            kecamatan: value.kecamatan,
        })
        setEditId(value.id)
        setIsEdit(true)
        setOpen(true)
    }
    //INIFUNGSI MENGUBAH  DATA PADA BACK END API PADA DATABASE API
    const handleUpdate = async () => {
        const payload = {
            nama: form.nama,
            kabupaten: form.kabupaten,
            provinsi: form.provinsi,
            kelurahan: form.kelurahan,
            kecamatan: form.kecamatan
        }
        await axios({
            method: 'PUT',
            url: 'https://61601920faa03600179fb8d2.mockapi.io/pegawai/' + editId,
            headers: {
                'Authorization': 'Bearer' + accessToken
            },
            data: payload
        }).then((res) => {
            if (res.data) {
                alert('sukses mengubah data')
                setForm({});
                getObject();
            }
        })
    }

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setIsEdit(false)
        setOpen(!open)
    };
    //Memanggil Auto complete dari Provinsi ke Kabupaten
    function onChangeProvinsi(event, value) {
        console.log(value);
        setForm(prev => ({
            ...prev,
            provinsi: value.label,
        }))
        getListKabupaten(value.id)
    }
    //MEMANGGIL AUTO COMPLET DARI KABUPATEN KE KE KECAMATAN
    function onChangeKabupaten(event, value) {
        console.log(value);
        setForm(prev => ({
            ...prev,
            kabupaten: value.label,
        }))
        getListKecamatan(value.id)
    }
    //MEMANGGIL AUTO COMPLETE DARI KECAMATAN KE KELURAHAN
    function onChangeKecamatan(event, value) {
        console.log(value);
        setForm(prev => ({
            ...prev,
            kecamatan: value.label,
        }))
        getListKelurahan(value.id)
    }
    //INI BERFUBGSI UNTUUK MENGUBAH PADA KELURAHAN DARI AUTO COMPLETE

    function onChangeKelurahan(event, value) {
        console.log(value);
        setForm(prev => ({
            ...prev,
            kelurahan: value.label
        }))
        getListKelurahan(value.id)
    }
    const handleChangeState = target => e => {
        console.log(e.target.value);
        setForm(prev => ({
            ...prev,
            [target]: e.target.value
        }))
    }
    //INI UNTUK MERENDEER SEMUA HALAMAN}
    return (
        <>

            <div>
                <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}

                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <div>
                        <Box style={{ width: 900, height: 700 }} sx={style}>

                            <Typography style={{ textAlign: 'center', marginTop: 100 }} id="keep-mounted-modal-title" variant="h6" component="h2">
                                Apakah Anda Ingin Menambah Pada data Karyawan
                            </Typography>
                            <Typography style={{ textAlign: 'center' }} id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                                Isilah data Data Karyawan dibawah ini
                            </Typography>

                            <Autocomplete style={{ marginLeft: 2, position: 'absolute', marginTop: 100 }}
                                disablePortal
                                id="combo-box-demo"
                                options={listProvinsi}
                                sx={{ width: 220 }}
                                onChange={onChangeProvinsi}
                                renderInput={(params) => <TextField {...params} label="Daftar Provinsi" value={form.provinsi} />}
                            />

                            <Autocomplete style={{ marginLeft: 600, position: 'absolute', marginTop: 100 }}
                                disablePortal
                                id="combo-box-demo"
                                options={listKelurahan}
                                sx={{ width: 220 }}
                                onChange={onChangeKelurahan}
                                renderInput={(params) => <TextField {...params} label="Kelurahan" value={form.kelurahan} onChange={handleChangeState('kelurahan')} />}
                            />
                            <Autocomplete style={{ marginLeft: 600, position: 'absolute', marginTop: 7 }}
                                disablePortal
                                id="combo-box-demo"

                                options={listKecamatan}
                                sx={{ width: 220 }}
                                onChange={onChangeKecamatan}
                                renderInput={(params) => <TextField {...params} label="Kecamatan" value={form.kecamatan} onChange={handleChangeState('kecamatan')} />}
                            />

                            <TextField id="outlined-basic" label="Nama" variant="outlined" value={form.nama} onChange={handleChangeState('nama')} InputLabelProps={{ shrink: true }} />

                            <Autocomplete style={{ marginLeft: 3, position: 'absolute', marginTop: 150 }}
                                disablePortal
                                id="combo-box-demo"
                                options={listKabupaten}
                                sx={{ width: 220 }}
                                onChange={onChangeKabupaten}
                                renderInput={(params) => <TextField {...params} label="Kabupaten" value={form.kabupaten} onChange={handleChangeState('kabupaten')} />}
                            />


                            <Grid Grid item xs={4}>
                                <IconButton style={{ backgroundColor: 'blue', marginLeft: 260, width: 160, marginTop: 300, borderRadius: 100 }} onClick={() => isEdit ? handleUpdate() : handleCreate()}>
                                    <Button onClick={handleUpdate} style={{ color: 'white' }} >
                                        {isEdit ? 'Ubah' : 'Tambah'} Pegawai
                                    </Button>
                                </IconButton>
                                <Button onClick={handleOpen} style={{ backgroundColor: 'orange', marginLeft: 100, width: 160, marginTop: 290, borderRadius: 100 }}> Keluar</Button>
                            </Grid>
                        </Box>
                    </div>
                </Modal>
            </div >
            <Box sx={{ flexGrow: 1 }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={auth}
                                onChange={handleChange}
                                aria-label="login switch"
                            />
                        }
                        label={auth ? 'Logout' : 'Login'}
                    />
                </FormGroup>
                <AppBar style={{ backgroundColor: 'blue' }} position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}

                        >

                        </IconButton>
                        <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                            Data Pegawai
                        </Typography>
                        <Button style={{ backgroundColor: 'white', borderRadius: 10, marginRight: 719, marginTop: 30, textAlign: 'center' }} onClick={handleOpen}>Menu Tambah</Button>
                        {auth && (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>

                                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>

            <>



                <TableContainer style={{ marginTop: 1 }} component={Paper}>

                    <Table sx={{ minWidth: 650, textAlign: 'center', }} size="small" aria-label=" a dense table">

                        <TableHead>
                            <TableRow>
                                <TableCell><p>ID</p></TableCell>
                                <TableCell align="left"><p>Nama</p></TableCell>
                                <TableCell align="left">Kabupaten</TableCell>
                                <TableCell align="left">Provinsi</TableCell>
                                <TableCell align="left">Kelurahan</TableCell>
                                <TableCell align="left">Kecamatan</TableCell>
                                <TableCell align="left">Aksi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {
                                pegawai.map(v => {
                                    return (
                                        <>
                                            <TableRow>
                                                <TableCell style={{ border: '1px solid #000' }}>{typeof v.id === 'string' && v.id}</TableCell>
                                                <TableCell style={{ border: '1px solid #000' }}>{typeof v.nama === 'string' && v.nama}</TableCell>
                                                <TableCell style={{ border: '1px solid #000' }} >{typeof v.kabupaten === 'string' && v.kabupaten}</TableCell>
                                                <TableCell style={{ border: '1px solid #000' }}>{typeof v.provinsi === 'string' && v.provinsi}</TableCell>
                                                <TableCell style={{ border: '1px solid #000' }}>{typeof v.kelurahan === 'string' && v.kelurahan}</TableCell>
                                                <TableCell style={{ border: '1px solid #000' }}>{typeof v.kecamatan === 'string' && v.kecamatan}</TableCell>

                                                <TableCell style={{ border: '1px solid #000' }}>
                                                    <IconButton style={{ backgroundColor: blue[500] }} onClick={() => handleEdit(v)}>
                                                        <EditTwoToneIcon></EditTwoToneIcon>
                                                    </IconButton>
                                                    <IconButton style={{ backgroundColor: red[500] }} onClick={() => handleDelete(v.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>

                                        </>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </>

        </>
    )
}
export default Home
