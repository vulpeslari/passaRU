import React from 'react';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import Ficha from './ficha.js';
import abi from '../abi.json';

import { BiSolidCoffee } from "react-icons/bi";
import { GiChickenOven } from "react-icons/gi";
import { MdFastfood } from "react-icons/md";
import { MdSoupKitchen } from "react-icons/md";

const CONTRACT_ADDRESS = "0x611f46872b31B3b490158A45A9919E498eE25Dec";

function App() {
  const location = useLocation();
  const name = localStorage.getItem('name');
  const address = localStorage.getItem('address');
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
      price: 0.80,
      priceWei: "52632000000000"
    },
    {
      id: 1,
      icon: <GiChickenOven />,
      name: "Almoço",
      hourStart: 11,
      hourEnd: 14,
      price: 1.80,
      priceWei: "118421000000000"
    },
    {
      id: 2,
      icon: <MdFastfood />,
      name: "Lanche",
      hourStart: 15,
      hourEnd: 18,
      price: 0.80,
      priceWei: "52632000000000"
    },
    {
      id: 3,
      icon: <MdSoupKitchen />,
      name: "Jantar",
      hourStart: 18,
      hourEnd: 20,
      price: 1.80,
      priceWei: "118421000000000"
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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const connectedAccount = accounts[0].toLowerCase();

      if (connectedAccount !== address.toLowerCase()) {
        toast.error("Carteira não corresponde ao aluno cadastrado!");
        return;
      }

      const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

      await contract.methods.purchaseFicha(ficha.id).send({
        from: connectedAccount,
        value: ficha.priceWei,
      });

      toast.success(`Ficha de ${ficha.name} comprada com sucesso!`);

    } catch (error) {
      //console.log(extractErrorMessage(error));
      toast.error(`Erro na compra. Verifique se o aluno já comprou essa ficha hoje.`); // Toast de erro com 8 segundos
    }
  };

  // Função para extrair a mensagem de erro do revert
  function extractErrorMessage(error) {
    // Padrão para mensagens de require (MetaMask/Viem)
    const requirePattern = /reason="([^"]*)"|reverted with reason string '([^']*)'/;
    const matches = error.message.match(requirePattern);

    if (matches) {
      // Retorna a mensagem capturada (pode estar no grupo 1 ou 2 da regex)
      return matches[1] || matches[2];
    }

    // Erros comuns da MetaMask (saldo insuficiente, gas limit, etc)
    if (error.message.includes("Ficha indisponivel.")) {
      return "Horário indisponível para compra de fichas.";
    }
    if (error.message.includes("Ficha ja comprada.")) {
      return "Você já comprou essa ficha hoje.";
    }
    if (error.message.includes("Saldo insuficiente.")) {
      return "Valor insuficiente para realizar a compra.";
    }

    // Fallback: Mostra o erro original (útil para debugging)
    return "Erro na transação: " + (error.reason || error.message.slice(0, 100));
  }


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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
      </div>
      {fichas.some(ficha => ficha.available) && (
        <div className='confirm'>
          {fichas.filter(ficha => ficha.available).map((ficha, idx) => (
            <button key={idx} onClick={() => handleSubmit(ficha)}>
              Confirmar compra
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
