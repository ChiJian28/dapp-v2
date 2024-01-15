import React from 'react'
import { useState, useEffect } from 'react'
import abi from "./contractJson/Persons.json"
import { ethers } from "ethers"

const App = () => {
  const [account, setAccount] = useState('Not connected');
  const [person, setPerson] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null
  })
  const [obj, setObj] = useState({
    name: '',
    age: 0,
    message: '',
  });

  useEffect(() => {
    connectMetamask();
    getData();
  }, []);

  useEffect(() => {
    if (state.contract && !dataLoaded) {
      getData();
      setDataLoaded(true);
    }
  }, [state.contract, dataLoaded]);

  // connect to Metamask
  const connectMetamask = async () => {

    const contractAddres = import.meta.env.VITE_CONTRACT_ADDRESS;
    const contractABI = abi.abi;
    //Metamask part
    //1. In order do transactions on sepolia testnet
    //2. Metmask consists of infura api which actually help in connecting to the blockhain
    try {

      const { ethereum } = window;
      const account = await ethereum.request({
        method: "eth_requestAccounts"   // 请求用户授权连接其钱包，并获取用户当前激活的 钱包地址
      })

      window.ethereum.on("accountsChanged", () => {
        window.location.reload()    //当用户切换账户时，触发 "accountsChanged" 事件，然后刷新整个页面，确保页面上的信息与新的账户信息同步。
      })

      setAccount(account);

      const provider = new ethers.providers.Web3Provider(ethereum);//read the Blockchain
      const signer = provider.getSigner(); //write the blockchain
      const contract = new ethers.Contract(
        contractAddres,
        contractABI,
        signer
      )

      setState({ provider, signer, contract });

    } catch (error) {
      console.log(error)
    }
  }

  // get data function
  const getData = async () => {
    try {
      const persons = await state.contract?.getPersonArray();
      setPerson(persons);
    } catch (error) {
      console.error(error)
    }
  }

  // create people
  const createPeople = async () => {
    try {
      const tx = await state.contract.setPersonObj(obj.name, obj.age, obj.message);
      await tx.wait();

      console.log("Create a new person successfully!");
      getData();
    } catch (error) {
      console.error(error);
    }
  }

  // update function
  const updatePerson = async (index, obj) => {
    try {
      const tx = await state.contract.updatePerson(index, obj);
      await tx.wait();

      console.log("Update a new person successfully!");
      getData();
    } catch (error) {
      console.error(error);
    }
  }

  // delete function
  const deletePerson = async (index) => {
    try {
      const tx = await state.contract.removePerson(index);
      await tx.wait();

      console.log("Delete a person successfully!");
      getData();
    } catch (error) {
      console.error(error);
    }
  }

  const setField = (category, value) => {
    setObj((prevObj) => ({ ...prevObj, [category]: value }));
  };

  return (
    <div>
      <div className='bg-red-300 flex flex-col p-4'>
        <input
          type="text"
          placeholder='Name...'
          onChange={(e) => setField('name', e.target.value)}
          className='border rounded-md p-2 mb-2'
        />
        <input
          type="number"
          placeholder='Age...'
          onChange={(e) => setField('age', e.target.value)}
          className='border rounded-md p-2 mb-2'
        />
        <input
          type="text"
          placeholder='Message...'
          onChange={(e) => setField('message', e.target.value)}
          className='border rounded-md p-2 mb-2'
        />
        <button
          onClick={() => createPeople()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add some message !
        </button>
      </div>

      <p> Connected Account - {account}</p>
      {person == null ? (
        <h1>Loading...</h1>
      ) : (
        person?.map((e, index) => (
          <div key={Math.random()} className="mb-4 p-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-md shadow-lg">
            <p className="text-2xl font-bold text-white">Name: {e.name}</p>
            <p className="text-lg text-white">Age: {Number(e.age)}</p>
            <p className="text-white">Message: {e.message}</p>
            <p className="mt-4 text-sm text-gray-200">
              {new Date(e.timestamp * 1000).toLocaleString()}
            </p>
            <button
              onClick={() => updatePerson(index, { name: "BabyShark", age: 99, timestamp: Date.now(), message: "想睡觉" })}
              className="bg-green-500 mt-4 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Modify
            </button>
            <button className="bg-purple-500 mt-4 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={() => deletePerson(index)}>Delete</button>
          </div>
        ))
      )}
    </div>
  )
}

export default App