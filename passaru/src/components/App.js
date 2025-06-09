import React from 'react';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Ficha from './ficha.js';
import './app.css';
import abi from '../abi.json';

import { BiSolidCoffee } from "react-icons/bi";
import { GiChickenOven } from "react-icons/gi";
import { MdFastfood } from "react-icons/md";
import { MdSoupKitchen } from "react-icons/md";

const CONTRACT_ADDRESS = "0x841d0E3AbE4432aC8d7cbc99171d4a1D9538f959";

function App() {
  const location = useLocation();
  const name = localStorage.getItem('authName');
  const address = localStorage.getItem('authAddress');
  const now = new Date();
  const currentHour = now.getHours();
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  const fichas = [
    {
      id: 0,
      icon: <BiSolidCoffee />,
      name: "Desjejum",
      hourStart: 7,
      hourEnd: 9,
      price: 0.80
    },
    {
      id: 1,
      icon: <GiChickenOven />,
      name: "Almoço",
      hourStart: 11,
      hourEnd: 14,
      price: 1.80
    },
    {
      id: 2,
      icon: <MdFastfood />,
      name: "Lanche",
      hourStart: 15,
      hourEnd: 18,
      price: 0.80
    },
    {
      id: 3,
      icon: <MdSoupKitchen />,
      name: "Jantar",
      hourStart: 18,
      hourEnd: 20,
      price: 1.80
    }
  ].map(ficha => ({
    ...ficha,
    available: currentHour >= ficha.hourStart && currentHour < ficha.hourEnd
  }));

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Erro ao conectar com MetaMask:", error);
        }
      } else {
        alert("MetaMask não encontrada. Instale a extensão.");
      }
    }

    initWeb3();
  }, []);


  const handleSubmit = async (ficha) => {
    try {
      // Pega as contas conectadas no MetaMask 
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const connectedAccount = accounts[0].toLowerCase();

      if (connectedAccount !== address.toLowerCase()) {
        alert("A carteira conectada não corresponde ao endereço cadastrado para este aluno.");
        return; // para aqui, não faz a compra
      }

      if (!web3) {
        alert("MetaMask não está conectado.");
        return;
      }

      const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

      await contract.methods.purchaseFicha(ficha.id).send({
        from: connectedAccount,
        value: web3.utils.toWei(ficha.price.toString(), 'ether'),
      });

      alert("Ficha de " + ficha.name + " comprada com sucesso!");
    } catch (error) {
      console.error("Erro ao comprar ficha:", error);
    }
  };


  return (
    <>
      <div className='hello'>
        <h1>Olá, {name}!</h1>
        <h2>Veja as fichas disponíveis para hoje.</h2>
      </div>
      <div className="container">
        {fichas.map((ficha, index) => (
          <Ficha
            key={index}
            icon={ficha.icon}
            name={ficha.name}
            hourStart={ficha.hourStart}
            hourEnd={ficha.hourEnd}
            available={ficha.available}
            price={ficha.price}
          />
        ))}
        {fichas.some(ficha => ficha.available) && (
          <div className='confirm'>
            {fichas.filter(ficha => ficha.available).map((ficha, idx) => (
              <button key={idx} onClick={() => handleSubmit(ficha)}>
                Confirmar compra
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
