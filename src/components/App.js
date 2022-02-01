import React, {
  Component
} from 'react';
//import logo from '../logo.png';
import './App.css';
//import { create } from 'ipfs-http-client';
import Web3 from 'web3';
import img from '../abis/img.json'
//import detectEthereumProvider from '@metamask/detect-provider';

// connect to ipfs daemon API server
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})
const web3Provider = '';


class App extends Component {

  /*Este método se ejecuta cuando el componente se está por renderizar.
   En este punto es posible modificar el estado del componente sin causar 
   una actualización (y por lo tanto no renderizar dos veces el componente). 
   Es importante sin embargo evitar causar cualquier clase de efecto 
   secundario (petición HTTP por ejemplo) ya que este método se ejecuta 
   en el servidor y hacer esto puede causar problemas de memoria.
   * 
   */
  async componentWillMount() { //ver bien el significado de este metodo lifecycles callbacks revisar
    await this.LoadBlockchain();
    await this.loadBlockchainData();
    //await this.render1();
  }


  //traerme la cuenta
  loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    const account = accounts[0];
    this.setState({
      account: account
    })
    var web3 = new Web3(Web3.givenProvider)
    const netid = await web3.eth.net.getId();
    const networkData = img.networks[netid]
    if (networkData) {
      /**fetch del contrato
       * me traigo el contrato con Contract pasandole el abi y address, seteo un
       * estado del contrato, luego llamo alos metodos del SC, en este caso el read
       * y utilizo el call y seteo al estado del memHash donde me deberia mostrar
       * lo que le pase a la funcion, me permite ver si se actualizan bien los datos en
       * la blockchain
       */
      const abi = img.abi;
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address);
      this.setState({
        contract
      })
      const memHash = await contract.methods.read().call();
      this.setState({
        memHash
      });
      console.log("CONTRATO", contract);
    } else {
      window.alert('el smart contract no se desplego en una red detectada')
    }

    console.log(netid);
    console.log(account);


    /**
     * la importancia del netwoek id es basicamente porque necesitamos 2 cosas, el abi (JSON) y el address 
     * el cual nos ayuda a identificar la key o address de la red por asi decir
     * dentro de el objeto ABI.
     * para traer ese id:web3.eth.net.getId()
     * 
     * ABI: img.abi
     * adress:networkData.address
     */


    /**
     * hay 2 tipos de funciones que usamos para llamar metodos, call functions, no cuestan gas pero las de send si.
     * 
     */

  }

  /*render1=async()=>{
    const key=this.account;
    document.getElementById("account").innerText=key;
  }*/ //no hace falta esta funcion ni todo el tema del inner-text, etc, trabajo con el state y le paso los estados  directo al html


  //traerme el smart contract

  //traerme la cuenta
  //traerme la cuenta


  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      memHash: "QmaRKkeoDEiU4WFXMwW7uv69H85Y9y2EPxhsvLdXRj8CWD",
      account: ' ',
      contract: null
    }
  }

  LoadBlockchain = async () => {

    if (window.ethereum) {
      let web3Provider = ''
      web3Provider = window.ethereum;
      await window.ethereum.request({
        method: "eth_requestAccounts"
      });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask "
      );
    }

  }

  captureFile = (event) => {
    event.preventDefault();
    console.log('file capt');
    //Procesar el archivo en ipfs
    const file = event.target.files[0];
    const reader = new window.FileReader(); //convertir la imagen en un buffer, el file
    //lo que se necesita para ponerlo en ipfs, leer en mdn
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result)
      }) //lo pongo en un state de react
      console.log('buffer', this.state.buffer)
    }

  }


  //para ver la imagen subida en ipfs usamos el complemento de infura, donde
  //se pasa la url y esta imagen va a estar subida en ipfs compuesto de
  //https://ipfs.infura.io/ipfs/hash generado de la imagen.

  /**
   * el state es un estado del componente de react, definido arriba y lo llamo
   * dentro de todos los metodo en los cuales lo necesite,por ejemplo el buffer, es un estado
   * en el cual me sirve para referenciar el file y gracias a los metodos como file reader
   * me permite poder ver los datos del archivo en si, acoplando con ipfs, eb este metodo hago un try and catch
   * donde defino una var resultado donde espero que en ipfs se guarde el estado del buffer de la imagen
   * y me traigo los datos del resultado de dicha imagen donde se hashea,etc
   * 
   * 
   */

  onSubmit = async (event) => {
    event.preventDefault();
    console.log('submiting');
    try {
      const resultado = await ipfs.add(this.state.buffer); //la anterior implmenetacion se queda vieja por la version de ipfs
      console.log('IPFS Result', resultado);
      const memHash = resultado[0].hash; //defino var memhash donde guardo lo que trae el resultado en la pos 0 
      //llamo al estado memhash y le defino la variable memhash =memhash

      //poner el file en la blockchain, ahora utilizo el send, desde y le seteo el estado de la cuenta que voy a mandar
      //this.state.contract.

      this.state.contract.methods.write(memHash).send({
        from: this.state.account
      }, () => {
        console.log("recibido")
        return this.setState({
          memHash: memHash
        });
      })


      /*this.state.contract.methods.write(memHash).send({from: this.state.account}).then((r)=>{
        console.log("recibido") // no entra aca
        return this.setState({memHash:memHash});
       })*/


    } catch (error) {
      console.log('error whit that image..');

    }


  }

  /*<video src={`https://ipfs.infura.io/ipfs/${this.state.memHash}`} className="App-logo1" type="video/mp4" />
                  
                  <h2>Sube un archivo del tipo MP4, video</h2>
                  <center> <form onSubmit={this.onSubmit}  >
                    <input type='file' class="form-control" id="inputGroupFile01" onChange={this.captureFile} />
                    <input type='submit' class="form-control" />
                  </form></center>  */

                  render() {
                    return (
                      
                      <div>
                     
                        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                          <a
                            className="navbar-brand col-sm-3 col-md-2 mr-0"
                            target="_blank"
                            rel="noopener noreferrer"
                            
                          >
                          IPFS Dapp 
                          </a>
                          <center><span id="account">{this.state.account}</span></center>
                        </nav>
                        <div className="container-fluid mt-5">
                        <ul class="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                </ul>
                          <div className="row">
                
                            <main role="main" className="col-lg-12 d-flex text-center">
                              
                              <div className="content mr-auto ml-auto">
                              <div className="imagen">
                                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memHash}`} className="App-logo"  />
                                   
                                <h1>Dapp with IPFS</h1>
                                <p>&nbsp;</p>
                                <h2>Sube un archivo del tipo JPG,JPEG</h2>
                                <center><form onSubmit={this.onSubmit} >
                                  <input type='file' class="form-control" id="inputGroupFile01" onChange={this.captureFile} />
                                  <button type='submit' class="boton2"    >ENVIAR</button>
                                </form></center>
                                </div>
                                <br/>
                                <div className="video" controls width="100" height="100">
                                  
                                
                                
                                </div>
                                
                                
                                
                              </div>
                             
                               </main>
                          </div>
                        </div>
                      
                      </div>
                      
                    );
                  }
                }

  export default App;