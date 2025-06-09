import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import abi from '../abi.json';
import App from './App';

import './scanner.css';

import { LuScanBarcode } from "react-icons/lu";

const CONTRACT_ADDRESS = '0x01330446DC6E17550B3F1F70C67d4E29438ee836';

function ScannerStudent() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [studentName, setStudentName] = useState(null);
    const [studentAccount, setStudentAccount] = useState(null);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!showVideo) return;

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });

                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.onloadedmetadata = () => {
                        video.play();
                    };
                } else {
                    setError("Vídeo não montado ainda.");
                }
            } catch (err) {
                setError('Erro ao acessar a câmera: ' + err.message);
            }
        }

        startCamera();
    }, [showVideo]);

    const captureAndScan = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');

        try {
            const response = await fetch('http://localhost:5000/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData }),
            });

            const data = await response.json();

            if (data.status === 'success' && data.data) {
                const matricula = data.data;

                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
                const allStudents = await contract.methods.listStudents().call();

                const found = allStudents.find((s) => s.id === matricula);

                if (found) {
                    setStudentName(found.name);
                    setStudentAccount(found.account);
                    setScanning(false);

                    localStorage.setItem('authName', found.name);
                    localStorage.setItem('authAddress', found.address);
                    localStorage.setItem('isAuthenticated', 'true');

                    video.srcObject.getTracks().forEach(track => track.stop());
                } else {
                    setError('Estudante não encontrado na blockchain.');
                }
            } else {
                //console.log('Detectando...');
            }
        } catch (err) {
            setError('Erro ao buscar matrícula: ' + err.message);
        }
    };
    useEffect(() => {
        if (!scanning || !showVideo) return;

        const interval = setInterval(() => {
            captureAndScan();
        }, 2500); // escaneia a cada 2.5s

        return () => clearInterval(interval);
    }, [scanning, showVideo]);

    if (error) {
        console.log(error);
    }

    if (studentName) {
        navigate(`/app?name=${encodeURIComponent(studentName)}&account=${encodeURIComponent(studentAccount)}`);
    }

    return (
        <div style={{ padding: 20 }}>
            {!showVideo ? (
                <button className='scan' onClick={() => setShowVideo(true)}>
                    <LuScanBarcode className='icon' />Escanear Carteirinha
                </button>
            ) : (
                <>
                    <video ref={videoRef} autoPlay playsInline />
                    <canvas ref={canvasRef} />
                </>
            )}
        </div>
    );
}

export default ScannerStudent;
