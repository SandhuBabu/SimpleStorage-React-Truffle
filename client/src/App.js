import Web3 from 'web3';
import SimpleStorage from './contracts/SimpleStorage.json'
import { useState, useEffect } from 'react'


// styles
import './App.css';

function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState(0);
  const [input, setInput] = useState('react')

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    async function template() {
      const web3 = new Web3(provider);
      /*
          To interact with smart contract we need
          i) ABI Code
          ii) Contract Address
      
      */

      // gets networkId (in ganacge: 5777)
      const networkId = await web3.eth.net.getId();

      // deployedNetwork.address is contract address of SimpleStorage
      const deployedNetwork = SimpleStorage.networks[networkId];

      // instance of smart contract to make interactions
      const contract = new web3.eth.Contract(SimpleStorage.abi, deployedNetwork.address);

      setState({ web3: web3, contract: contract })
    }

    provider && template()
  }, []);

  useEffect(() => {
    const { contract } = state;
    async function readData() {

      /*
      
      Calling contract method getter to read data from blockchain

      i)  call() is used to read data from smart contracts
      ii) send() is used to writting to smart contracts

      */
      const data = await contract.methods.getter().call();
      setData(data);
    }

    contract && readData();
  }, [state]);

  async function writeData() {
    const { contract } = state;
    setInput(parseInt(input));

    // send is used to write data into smart contract
    if (input != null) {
      await contract.methods.setter(input).send({ from: '0x1Da47e2b5bF8bCC04AB2AcEe3b90bB2768E8442C' });
      setData(input);
      setInput('')
    }
  }

  return (
    <div className="App">
      <h1>Storage DAPP</h1>
      <p>Contract Data : {data}</p>
      <div className="input-sec">
          <input type="text" onChange={e=>setInput(e.target.value)} value={input} required/>
          <label>Enter Data</label>
      </div>
      <button onClick={writeData}>Change Data</button>
    </div>
  );
}

export default App;
