import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom'
import URL from '../url'


class Formulario extends Component {
    constructor() {
        super();
        this.state = {
            idCliente: '',
            nombre: '',
            apellidoP: '',
            apellidoM: '',
            allClient: [],
            redirect:false
        }
        this.handleChange = this.handleChange.bind(this);
        this.addClient = this.addClient.bind(this);
        this.buscar = this.buscar.bind(this);
    };





    componentDidMount() {
        this.fetchAllClient();
    };

    //for the input search
    buscar(e) {

        let c = e.target.value;
        console.log('valooooooor' + c);
        const obj = {
            nombre: c
        }

        fetch('http://localhost:4000/api/clientes/buscar', {
            method: 'POST',
            //Los headers son necesario o no funcionara el registro
            body: JSON.stringify(obj),
            headers: {
                'Acept': 'application/json',
                'Content-Type': 'application/json'
            }

        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.setState({
                    allClient: data
                })
                    .catch(err => {
                        console.log('erooooooooor' + err);

                    })
            })
        e.preventDefault();
    };

    fetchAllClient() {
        fetch(`${URL}/api/clientes/`)
            .then(res => res.json())
            .then(data => {

                this.setState({ allClient: data });

            });

    };

    //solicita un solo cliente del servidor y asigna sus propiedades al estado
    editClient(id) {
        fetch(`http://localhost:4000/api/clientes/${id}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    idCliente: data.idCliente,
                    nombre: data.nombre,
                    apellidoP: data.apellidoP,
                    apellidoM: data.apellidoM
                });
            })
    };

    deleteClient(id) {
        fetch(`http://localhost:4000/api/clientes/${id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                window.M.toast({ html: data.message, classes: 'rounded' });
                this.fetchAllClient();
            })
            .catch(err => {

                window.M.toast({ html: err.message, classes: 'rounded' });
            });
    };


    estadoEnVacio() {

        this.setState({
            idCliente: '',
            nombre: '',
            apellidoP: '',
            apellidoM: ''
        }
        )
    };


    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value.toUpperCase()
        });
    };



    addClient(e) {

        if (this.state.idCliente) {

            fetch(`http://localhost:4000/api/clientes/${this.state.idCliente}`, {
                method: 'PUT',

                //Los headers son necesario o no funcionara el registro
                headers: {
                    'Acept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
                .then(res => res.json())
                .then(data => {

                    window.M.toast({ html: data.message, classes: 'rounded' });
                    this.estadoEnVacio();
                    this.fetchAllClient();
                })
                .catch(err => {
                    console.log(err);
                    window.M.toast({ html: err.message, classes: 'rounded' });
                });
        } else {

            fetch('http://localhost:4000/api/clientes/', {
                method: 'POST',
                body: JSON.stringify(this.state),
                //Los headers son necesario o no funcionara el registro
                headers: {
                    'Acept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    window.M.toast({ html: data.message, classes: 'rounded' });
                    this.estadoEnVacio();
                    this.fetchAllClient();
                })
                .catch(err => {
                    console.log(err);
                    window.M.toast({ html: err.message, classes: 'rounded' });
                });


        }
        e.preventDefault();

    }

    render() {
        /*permite usar estos estilos dentro de una etiqueta*/
        const style = { marginRight: "10px" };
        //usando if redireccionando a otra pagina en caso la venta haya sido exitosa
        if(this.state.redirect)
        {
            return <Redirect to={`/venderPrendas/${this.state.idCliente}`}/>
        }

        return (


            <div className="formulario">

                <div className="row">
                    {/**Aqui empieza la columna de la table de clientes */}
                    <div className="col s9">
                        <div className="row">
                            {
                                this.state.allClient.map(c => {
                                    return (
                                        <div className="col s4 m4" key={c.idCliente}>
                                            <div className="card blue-grey darken-1">
                                                <div className="card-content white-text">
                                                    <span className="new badge red" ><strong>{c.idCliente}</strong></span>
                                                    <span className="card-title">{c.nombre + " " + c.apellidoP + " " + c.apellidoM}</span>
                                                    <p>.</p><br></br>
                                                    <p><strong>Fecha de Registro:</strong> {c.fechaRegCli}</p>
                                                </div>
                                                <div className="card-action">
                                                    <button style={style} onClick={() => this.editClient(c.idCliente)} type="submit" className="waves-effect blue left btn"><i className="material-icons center">edit</i></button>
                                                    <Link to={`/ventaPrendas/${c.idCliente}`} type="submit" className="waves-effect grey darken-3 center btn"><i className="material-icons left">local_mall</i>Ventas</Link>
                                                    <Link to={`/venderPrendas/${c.idCliente}`} className="waves-effect green right btn"><i className="material-icons center">local_grocery_store</i></Link>
                                                </div>
                                            </div>
                                        </div>

                                    );
                                })
                            }
                        </div>
                    </div>
                    {/* aqui empiez ala columna del formulario */}
                    <div className="col s3">

                        <div className="card nav-wrapper grey lighten-4 col s12">
                            <form>
                                <div className="input-field">
                                    <input placeholder="Buscar por ID,Nombre o Apellido" id="search" type="search" onKeyUp={e => this.buscar(e)} />
                                    <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                                    <i className="material-icons">close</i>
                                </div>
                            </form>
                        </div>


                        <div className="card grey lighten-4 col s12">
                            <form onSubmit={this.addClient} className=" col s12">

                                <div className="input-field">
                                    <i className="material-icons prefix">account_circle</i>
                                    <input value={this.state.nombre} placeholder="" name="nombre" onChange={this.handleChange} id="icon_prefix" type="text" className="validate" required />
                                    <label htmlFor="icon_prefix">NOMBRE</label>
                                </div>
                                <div className="input-field">
                                    <i className="material-icons prefix">account_circle</i>
                                    <input value={this.state.apellidoP} placeholder="" name="apellidoP" onChange={this.handleChange} id="icon_telephone" type="text" className="validate" required />
                                    <label htmlFor="icon_telephone">APELLIDO PATERNO</label>
                                </div>
                                <div className="input-field">
                                    <i className="material-icons prefix">account_circle</i>
                                    <input value={this.state.apellidoM} placeholder="" name="apellidoM" onChange={this.handleChange} id="icon_apM" type="text" className="validate" />
                                    <label htmlFor="icon_apM">APELLIDO MATERNO</label>
                                </div>
                                <div className="card-action">
                                    <button type="submit" className="waves-effect green btn"><i className="material-icons left">add</i>Registrar</button>
                                    <button type="reset" onClick={() => this.estadoEnVacio()} className="waves-effect red right btn"><i className="material-icons center">cancel</i></button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>

            </div>

        );
    };
};


export default Formulario;