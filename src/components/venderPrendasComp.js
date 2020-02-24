import React, { Component } from 'react'
import { Link,Redirect } from 'react-router-dom'

let idCliente;
export default class VenderPrendas extends Component {
    constructor() {
        super();
        this.state = {
            venta: [{ idVenta: "", idPrenda: "", detalle: "", cantidad: 0, precio: 0, }],
            cliente: {
                nombre: "",
                apellidoP: "",
                apellidoM: ""
            },
            total: 0,
            recogeCon: 0,
            montoDejado: 0,
            cantidadPrendas: 0,
            //estado para redireccionar a otro enlace en caso que se realize la venta satisfactotiamente
            redirect:false
        };
        this.handleChange = this.handleChange.bind(this);
        this.addNewVenta = this.addNewVenta.bind(this);
        this.calcularRecogeCon = this.calcularRecogeCon.bind(this);
    };

    

    componentDidMount() {
        //recuperando el id de cliente que viene en la url, recuperando con props
        idCliente = this.props.match.params.id;
        fetch(`http://localhost:4000/api/ventas/vender/${idCliente}`)
            .then(res => res.json())
            .then(data => {
                this.setState({

                    venta: [{
                        idVenta: data.idVenta,
                        idPrenda: 1,
                        cantidad: 1
                    }],
                    cliente: {
                        nombre: data.cliente.nombre,
                        apellidoP: data.cliente.apellidoP,
                        apellidoM: data.cliente.apellidoM
                    }

                })
                console.log(this.state);
            })
    };

    addClick() {
        this.setState(prevState => ({
            venta: [...prevState.venta,
                 { idVenta: this.state.venta[0].idVenta, idPrenda: 1, detalle: "", cantidad: 1, precio: "" }
                ]
        }))
    };


    createUI() {
        return this.state.venta.map((el, i) => (
            <div key={i}>
                <div className="row">
                    <div className=" col s2">
                        <div className="row">
                            <div className="col s2">
                                <i className="material-icons prefix">local_offer</i>
                            </div>
                            <div className="col s10">
                                <input placeholder="PRENDA" name="idPrenda" id="idprenda" type="text" value={el.idPrenda || ''} onChange={this.handleChange.bind(this, i)} required />
                            </div>
                        </div>
                    </div>
                    <div className="inline col s5">
                        <div className="row">
                            <div className="col s2">
                                <i className="material-icons prefix right">content_paste</i>
                            </div>
                            <div className="col s10">
                                <input placeholder="DETALLE" name="detalle" type="text" className="validate" value={el.detalle || ''} onChange={this.handleChange.bind(this, i)} required />
                            </div>
                        </div>
                    </div>
                    <div className=" col s2">
                        <div className="row">
                            <div className="col s2">
                                <i className="material-icons prefix">filter_1</i>
                            </div>
                            <div className="col s10">
                                <input placeholder="CANTIDAD" name="cantidad" type="text" className="validate" value={el.cantidad || ''} onChange={this.handleChange.bind(this, i)} required />
                            </div>
                        </div>
                    </div>
                    <div className=" col s2">
                        <div className="row">
                            <div className="col s2">
                                <i className="material-icons prefix">monetization_on</i>
                            </div>
                            <div className="col s10">
                                <input placeholder="PRECIO" name="precio" id="precio" type="text" className="validate" value={el.precio || ''} onChange={this.handleChange.bind(this, i)} required />
                            </div>
                        </div>
                    </div>
                    <div className="input-field col s1">
                        {/**se esta utilizando Link por que por alguna razon si utilizo button al precipnar se envia el formulario pese a utilizar preventDefault */}
                        <Link onClick={this.removeClick.bind(this, i)} to="#" className="waves-effect orange lighten-1 right btn"><i className="material-icons center">delete</i></Link>
                    </div>
                </div>
            </div>
        ))
    }

    calcularRecogeCon(e) {
        const { value } = e.target;
        this.setState({
            recogeCon: this.state.total - value,
            montoDejado: value
        });
    }


    handleChange(i, e) {
        const { name, value } = e.target;
        let venta = [...this.state.venta];
        //usando to UpperCase para enviar los valores en mayuscula
        venta[i] = { ...venta[i], [name]: value.toUpperCase() };
        //con el for calculamos el total del precio de la venta recorriendo tods los acmpos de cantidad y precio
        let totalPrecio = 0;
        for (let i of venta) {
            totalPrecio = totalPrecio + i.cantidad * i.precio;
        }
        //sumando la  cantidad de prendas con for

        this.setState({
            venta,
            total: totalPrecio,
            recogeCon: totalPrecio - this.state.montoDejado
        });
    };

    removeClick(i) {
        let venta = [...this.state.venta];
        venta.splice(i, 1);
        let totalPrecio = 0;
        for (let i of venta) {
            totalPrecio = totalPrecio + i.cantidad * i.precio;
        }
        this.setState({
            venta,
            total: totalPrecio,
            recogeCon: totalPrecio - this.state.montoDejado
        });
    }

    addNewVenta(e) {
        let montoCancelado={
            montoCancelado:document.getElementById("montoDejado").value
        }
        fetch(`http://localhost:4000/api/ventaPrendas/${idCliente}`, {
            method: 'POST',
            body: JSON.stringify(this.state.venta,montoCancelado),
            //Los headers son necesario o no funcionara el registro
            headers: {
                'Acept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                window.M.toast({ html: data.message, classes: 'rounded' });
                //si añadio con exito las prendas, entonces actualizamos el precio de la venta
                if (data.exito) {
               
                    let montoDejado={
                        montoCancelado:document.getElementById("montoDejado").value
                    }
                  
                    fetch(`http://localhost:4000/api/ventas/actualizarMontoVenta/${this.state.venta[0].idVenta}`, {
                        method: 'PUT',

                        //Los headers son necesario o no funcionara el registro
                        headers: {
                            'Acept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(montoDejado)
                    })
                        .then(res => res.json())
                        .then(data => {
                            window.M.toast({ html: data.message, classes: 'rounded' });
                            if(data.exito)
                            {
                                this.setState({
                                    redirect:true
                                })
                            }
                        })
                        .catch(err => {

                            window.M.toast({ html: err, classes: 'rounded' });
                        });
                }


            })
            .catch(err => {
                console.log(err);
                window.M.toast({ html: err.message, classes: 'rounded' });
            });

        e.preventDefault();
    };

    cancelVenta()
    {
        
    };


    render() {
        /*permite usar estos estilos dentro de una etiqueta*/

        //const styleInput = { textTransform: "uppercase" };
        if(this.state.redirect)
        {
            return <Redirect to={`/ventaPrendas/${idCliente}`}/>
        }

        return (
            <div className="row">
                <div className="col s9">
                    <div className="card grey lighten-4 col s12">
                        <b>VENDIENDO A: </b><span>{this.state.cliente.nombre + " " + this.state.cliente.apellidoP + " " + this.state.cliente.apellidoM}</span>
                        <form >
                            {this.createUI()}
                        </form>
                        <div className="row">
                            <div className="card-action col s12">
                                <Link onClick={this.addClick.bind(this)} to="#" className="btn-floating btn-large waves-effect waves-light right red"><i className="material-icons">add</i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s3">
                    <div className="card grey lighten-4 col s12">
                        <div className="row">
                            <b className="col s6">TOTAL:</b>

                            <input disabled value={this.state.total} placeholder="Precio Total de la Venta" type="text" className="col s6" />


                        </div>
                        <div className="row">
                            <b className="col s6">RECOGE CON:</b>

                            <input disabled value={this.state.recogeCon} placeholder="Monto con el que Recoge" type="text" className="col s6 " />


                        </div>
                        <div className="row">
                            <b className="col s6">MONTO DEJADO:</b>

                            <input onChange={this.calcularRecogeCon} placeholder="Monto Que Dejó" type="text" id="montoDejado" className="col s6" required />

                        </div>
                        <div className="row">
                            <div className="card-action">

                                <button onClick={this.addNewVenta} className="waves-effect left green btn"><i className="material-icons left">local_mall</i>Vender</button>


                                <button type="reset" onClick={() => this.cancelVenta()} className="waves-effect red right btn"><i className="material-icons right">cancel</i>Cancel</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
