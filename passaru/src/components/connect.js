import React from 'react'
import './connect.css'
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { IoLogInSharp } from "react-icons/io5";
import { MdOutlineSync } from "react-icons/md";

import abi from '../abi.json';
const CONTRACT_ADDRESS = "0x611f46872b31B3b490158A45A9919E498eE25Dec"; 

function Connect() {
    const [account, setAccount] = useState(null);
    const [web3, setWeb3] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111

            // Tenta trocar para Sepolia
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: SEPOLIA_CHAIN_ID }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    // Se Sepolia ainda não estiver adicionada
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: SEPOLIA_CHAIN_ID,
                                chainName: 'Sepolia Test Network',
                                nativeCurrency: {
                                    name: 'SepoliaETH',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                                rpcUrls: ['https://rpc.sepolia.org'],
                                blockExplorerUrls: ['https://sepolia.etherscan.io']
                            }],
                        });
                    } catch (addError) {
                        console.error("Erro ao adicionar Sepolia:", addError);
                        return;
                    }
                } else {
                    console.error("Erro ao trocar para Sepolia:", switchError);
                    return;
                }
            }

            // Caso clique na opção de trocar de conta
            try {
                await window.ethereum.request({
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }],
                });

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const _web3 = new Web3(window.ethereum);
                setWeb3(_web3);
                setAccount(accounts[0]);
            } catch (err) {
                console.error("Erro ao conectar à MetaMask:", err);
            }

        } else {
            alert("MetaMask não encontrada. Instale a extensão.");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setWeb3(null);
    };

    useEffect(() => {
        if (window.ethereum) {
            const _web3 = new Web3(window.ethereum);
            setWeb3(_web3);
            window.ethereum
                .request({ method: 'eth_accounts' })
                .then((accounts) => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    }
                });

            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    disconnectWallet();
                }
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const id = e.target.matricula.value;

        if (!web3 || !account) {
            alert("Conecte-se à MetaMask primeiro.");
            return;
        }

        try {
            const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

            await contract.methods.addStudent(id, name, account).send({ from: account });

            alert("Aluno cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar aluno:", error);
        }
    };

    return (
        <>
            <form className='connect-form' onSubmit={handleSubmit}>
                <h1>Conecte sua conta Metamask</h1>
                <fieldset>
                    <legend>
                        <label htmlFor="name">Nome</label>
                    </legend>
                    <input type="text" id="name" name="name" placeholder="Digite seu nome" required />
                </fieldset>
                <fieldset>
                    <legend>
                        <label htmlFor="matricula">Matrícula</label>
                    </legend>
                    <input type="text" id="matricula" name="matricula" placeholder="Digite sua matrícula" required />
                </fieldset>
                <fieldset>
                    <legend>
                        <label htmlFor="metamask">Carteira MetaMask</label>
                    </legend>
                    <div className='metamask'>
                        <div className='buttons'>
                            {account ? (
                                <>
                                    <span className='account'>{account}</span>
                                    <button id="metamask" className='sync' type="button" onClick={(e) => { e.preventDefault(); connectWallet(); }}><MdOutlineSync className='icon' /></button>
                                </>
                            ) : (
                                <button id="metamask" type="button" className='conect' onClick={(e) => { e.preventDefault(); connectWallet(); }}> <IoLogInSharp className='icon' /> Conectar com MetaMask</button>
                            )}
                        </div>
                    </div>
                </fieldset>
                <button id="submit" type="submit" className='conect-submit' disabled={!account}>Conectar</button>
            </form >
        </>
    )
}

export default Connect