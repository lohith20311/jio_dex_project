require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

// Polygon Amoy RPC URL
const RPC_URL = "https://rpc-amoy.polygon.technology";

// JIO Coin Contract Details
const CONTRACT_ADDRESS = "0x3081075617E13A3fd0B03d20A7a1bB6793E14BE4";
const ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

// Connect to Polygon Amoy
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// API Route: Get JIO Coin Balance
app.get("/balance/:address", async (req, res) => {
  try {
    const balance = await contract.balanceOf(req.params.address);
    res.json({ balance: ethers.formatUnits(balance, 18) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Route: Transfer JIO Coin
app.post("/transfer", async (req, res) => {
  try {
    const { to, amount } = req.body;
    const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
    await tx.wait();
    res.json({ txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`JIO DEX Backend running on port ${PORT}`);
});
