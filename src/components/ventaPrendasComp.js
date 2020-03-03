import React, { Component } from 'react'
import URL from '../url'
let idCliente;

//inicio codigo para abrir el modal
document.addEventListener('DOMContentLoaded', function () {
    console.log("presionado");
    var elems = document.querySelectorAll('.modal');
    window.M.Modal.init(elems);
});
//fin codigo para abrir el modal 


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
                                {/* pongo el modal aqui con la finalidad de obtener el nombre y apellido del cliente */}
                                <div id="modalCancelarDeuda" className="modal">
                                    <div className="modal-content">
                                        <h4>¿Esta seguro de realizar esta acción...?</h4>
                                        <p>Click en aceptar en caso de que el cliente <b> {c.nombre} {c.apellidoP}</b> está cancelando la deuda total, caso contrario haga Click en Cancelar</p>
                                    </div>
                                    <div className="modal-footer">
                                        <a href="#!" className="modal-close waves-effect red left btn">Cancelar</a>
                                        <a href="#!" className="modal-close waves-effect green right btn">Aceptar</a>
                                    </div>
                                </div>

                                {
                                    c.ventas.reverse().map(v => {
                                        let cantidaTotal = 0;
                                        let precioTotal = 0;
                                        const estado = v.estadoVen;
                                        let colorNumeroVenta;
                                        let btnCancelarMonto;
                                        let btnAgregarMonto;



                                        if (estado) {
                                            colorNumeroVenta = <div><b>N° DE VENTA: </b><div className="chip #ff7043 green lighten-1"><b>{v.idVenta}</b></div></div>
                                            btnCancelarMonto = <button disabled type="submit" className="waves-effect red left btn">CANCELAR DEUDA</button>
                                            btnAgregarMonto = <button disabled type="submit" className="waves-effect blue left btn">AGREGAR MONTO</button>
                                        }
                                        else {
                                            colorNumeroVenta = <div><b>N° DE VENTA: </b><div className="chip #ff7043 deep-orange lighten-1"><b>{v.idVenta}</b></div></div>
                                            btnCancelarMonto = <a href="#modalCancelarDeuda" className="waves-effect btn modal-trigger red left">CANCELAR DEUDA</a>
                                            btnAgregarMonto = <button onClick={() => this.estadoVenta(v.idVenta)} type="submit" className="waves-effect blue right btn">AGREGAR MONTO</button>

                                        }



                                        return (

                                            <div className="col s12 m12 l6" key={v.idVenta}>
                                                <div className="card blue-grey darken-1">

                                                    <div className="row card-content white-text">
                                                        <div className="col s12 m8">
                                                            <span className="card-title">{c.nombre + " " + c.apellidoP + " " + c.apellidoM}</span>
                                                        </div>
                                                        <div className="col s12 m4">
                                                            {colorNumeroVenta}
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
                                                            <div className="col s12 m4">
                                                                <b>FECHA Y HORA DE VENTA: </b>{v.fechaRegVen}
                                                            </div>

                                                            <div className="col s12 m8">

                                                                {btnCancelarMonto}
                                                                {btnAgregarMonto}
                                                                <button data-target="modalCancelarDeuda" className="btn modal-trigger">Modal</button>
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