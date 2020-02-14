import React, { Component } from 'react'
import URL from '../url'
let idCliente;

class VentaPrenda extends Component {
    constructor() {
        super();
        this.state = {
            idCliente: '',
            nombre: '',
            apellidoP: '',
            apellidoM: '',
            ventaPrendas: [],


        }

    };


    componentDidMount() {
        idCliente = this.props.match.params.id;
        this.fetchAllVentas();

    };

    fetchAllVentas() {
        fetch(`${URL}/api/ventaPrendas/${idCliente}`)
            .then(res => res.json())
            .then(data => {

                this.setState({ ventaPrendas: data });
                console.log(this.state.ventaPrendas);
            });

    }

    
    estadoVenta(idVenta) {
        let estado = {
            estadoVen: true
        };
        fetch(`${URL}/api/ventas/actualizarEstadoVenta/${idVenta}`, {
            method: 'PUT',

            //Los headers son necesario o no funcionara el registro
            headers: {
                'Acept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estado)
        })
            .then(res => res.json())
            .then(data => {

                window.M.toast({ html: data.message, classes: 'rounded' });
                this.fetchAllVentas();
            })
            .catch(err => {
                console.log(err);
                window.M.toast({ html: err.message, classes: 'rounded' });
            });
    }
   

    render() {
        return (
            <div>
                {
                    this.state.ventaPrendas.map(c => {
                        
                        return (
                            <div className="row" key={c.idCliente}>
                                {
                                    c.ventas.reverse().map(v => {
                                        let cantidaTotal = 0;
                                        let precioTotal = 0;
                                        const estado=v.estadoVen;
                                        let button;
                                        
                                        if(estado)
                                        {
                                            button=<button onClick={() => this.estadoVenta(v.idVenta)} type="submit" className="waves-effect green left btn">CANCELADO</button>
                                        }
                                        else
                                        {
                                            button=<button onClick={() => this.estadoVenta(v.idVenta)} type="submit" className="waves-effect red left btn">DEBE</button>
                                        }
                                        return (
                                            
                                            <div className="col s12 m12 l6" key={v.idVenta}>
                                                <div className="card blue-grey darken-1">

                                                    <div className="row card-content white-text">
                                                        <div className="col s12 m8">
                                                            <span className="card-title">{c.nombre + " " + c.apellidoP + " " + c.apellidoM}</span>
                                                        </div>
                                                        <div className="col s12 m4">
                                                            <b>N° DE VENTA: </b><div className="chip #ff7043 deep-orange lighten-1"><b>{v.idVenta}</b></div>
                                                        </div>


                                                    </div>
                                                    <table className="highlight centered ">
                                                        <thead>
                                                            <tr>

                                                                <th>DETALLE DE LA PRENDA</th>
                                                                <th>CANTIDAD</th>
                                                                <th>PRECIO</th>
                                                                <th>SUB TOTAL</th>
                                                            </tr>
                                                        </thead>

                                                        {
                                                            v.ventaPrendas.map(vp => {
                                                                cantidaTotal = cantidaTotal + vp.cantidad;
                                                                precioTotal = precioTotal + vp.cantidad * vp.precio;

                                                                return (
                                                                    <tbody key={vp.idVentaPrenda}>
                                                                        <tr>

                                                                            <td>{vp.detalle}</td>
                                                                            <td>{vp.cantidad}</td>
                                                                            <td>{vp.precio}</td>
                                                                            <td>{vp.cantidad * vp.precio}</td>

                                                                        </tr>

                                                                    </tbody>

                                                                );
                                                            })

                                                        }

                                                    </table>


                                                    <div className="card-action #90a4ae blue-grey lighten-2">
                                                        <div className="row">
                                                            <div className="col s12 m7">
                                                                <b>CANTIDAD TOTAL DE PRENDAS: </b><div className="chip"><b>{cantidaTotal}</b></div>
                                                            </div>
                                                            <div className="col s12 m5">
                                                                <b>PRECIO TOTAL: </b> <div className="chip"><b>{precioTotal} Bs.</b></div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col s12 m6">
                                                                <b>DEJÓ: </b><div className="chip"><b>{v.montoCancelado} Bs.</b></div>
                                                            </div>
                                                            <div className="col s12 m6">
                                                                <b>RECOGE CON: </b><div className="chip"><b>{precioTotal - v.montoCancelado} Bs.</b></div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col s12 m6">
                                                                <b>FECHA Y HORA DE VENTA: </b>{v.fechaRegVen}
                                                            </div>
                                                            
                                                            <div className="col s12 m6">
                                                                
                                                                {button}
                                                            </div>



                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        );
    };
};

export default VentaPrenda;