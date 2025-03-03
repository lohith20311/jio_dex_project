import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = "http://localhost:5000"; // Backend API URL

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      fetchBalance(accounts[0]);
      toast.success("Wallet Connected!");
    } catch (error) {
      toast.error("Connection Failed!");
    }
  };

  // Fetch JIO Coin Balance
  const fetchBalance = async (userAddress) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/balance/${userAddress}`);
      setBalance(res.data.balance);
    } catch (error) {
      toast.error("Failed to fetch balance");
    }
  };

  // Transfer JIO Coin
  const sendTokens = async () => {
    const recipient = prompt("Enter recipient address:");
    const amount = prompt("Enter amount:");

    if (!recipient || !amount) return;
    
    try {
      const res = await axios.post(`${BACKEND_URL}/transfer`, { to: recipient, amount });
      toast.success(`Transaction Sent! TX: ${res.data.txHash}`);
    } catch (error) {
      toast.error("Transaction Failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>JIO Coin DEX</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <h2>Account: {account || "Not Connected"}</h2>
      <h2>Balance: {balance} JIO</h2>
      <button onClick={sendTokens} disabled={!account}>Send JIO Coin</button>
      <ToastContainer />
    </div>
  );
}

export default App;
