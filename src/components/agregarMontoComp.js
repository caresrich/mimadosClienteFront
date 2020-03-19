import React, { Component } from 'react'
import URL from '../url'
import {Link,Redirect} from 'react-router-dom'


let idVenta;

class AgregarMonto extends Component {

    constructor() {
        super();
        this.state = {
            montoCancelado: '',
            idCliente: '',
            redirect:false
        }
        this.handleChange = this.handleChange.bind(this);
        this.agregarMonto = this.agregarMonto.bind(this);
    };


    componentDidMount() {
        idVenta = this.props.match.params.id;
        this.obtenerIdCliente();
    }

    obtenerIdCliente()
    {
       
        fetch(`${URL}/api/ventas/obtenerIdCliente/${idVenta}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ idCliente:data.objeto.idCliente });
            }).catch(err => {
                console.log(err);
                console.log('entro al error');
               
            });
       
            
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
   
    };

    agregarMonto(e)
    {
       
        fetch(`${URL}/api/ventas/addMonto/${idVenta}`, {
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
                    this.setState({
                        redirect:true
                    })
                    
                   
                })
                .catch(err => {
                    console.log(err);
                    console.log('entro al error');
                    
                    window.M.toast({ html: err.message, classes: 'rounded' });
                });
                e.preventDefault();
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={`/ventaPrendas/${this.state.idCliente}`} />
        }
        return (
            <div className="row">
                <div className="col l4">
                </div>
            <div className="col s12 m6 l4">
                <div className="card grey lighten-4 col s12">

                    <form onSubmit={this.agregarMonto} className="col s12">
                        <div className="row">
                            <div className="input-field center col s12">
                                <input onChange={this.handleChange} id="first_name" name="montoCancelado" placeholder="" type="text" className="validate" />
                                <label className="active" htmlFor="first_name">AGREGAR MONTO</label>
                                <span className="helper-text" data-error="wrong" data-success="right">Ingrese el monto a agregar</span>

                            </div>

                        </div>
                        <div className="card-action">
                        <div className="row">
                                    <div className="col s12">
                            <button  type="submit" className="waves-effect green right btn">aceptar</button>
                            <Link to={`/ventaPrendas/${this.state.idCliente}`} className="waves-effect red left btn"><i className="material-icons center">cancel</i></Link>
                            
                        </div>
                        </div>
                        </div>
                    </form>

                </div>
            </div>
            </div>
        )
    }
}


export default AgregarMonto;