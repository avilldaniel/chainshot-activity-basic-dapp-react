import { useState } from "react";
import "./App.css";
import { Contract, ethers } from "ethers";
import JSONcontract from "./utils/Greeter.json";

const contractAddress = "0x5A8d8342aE6a1F6A96cA7Ba73e1325b0c8a5ec47";

function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [greetSet, newGreetSet] = useState(false);

  // 1. connect MetaMask & declare provider
  const { ethereum } = window;
  let contractInstance, provider, signer;
  if (ethereum) {
    ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(ethereum);
    displayUserDetails();

    contractInstance = new ethers.Contract(
      contractAddress,
      JSONcontract.abi,
      signer
    );
  } else {
    // tell user to install MetaMask
  }

  // 2. create an Ethers.js contract instance
  // new ethers.Contract( address , abi , signerOrProvider )

  async function displayUserDetails() {
    // getSigner() will return whoever is connected on MetaMask
    signer = await provider.getSigner();
    let addr1 = await signer.getAddress();
    let userBalance = await provider.getBalance(addr1);
    setAddress(addr1);
    setBalance(ethers.utils.formatEther(userBalance));
  }

  const getGreeting = async () => {
    let greeter = new ethers.Contract(
      contractAddress,
      JSONcontract.abi,
      signer
    );
    let msg = await greeter.greet();
    setGreeting(msg);
  };

  const setGreet = async () => {
    let setGreeter = await new Contract(
      contractAddress,
      JSONcontract.abi,
      signer
    );
    await setGreeter.setGreeting("ok new greet set");
    newGreetSet(true);
  };

  return (
    <div className="App">
      <h2>Addy connected:</h2>
      <div className="user-details">
        <p className="addy">{address}</p>
        <p>Balance: {balance}</p>
      </div>
      <button className="btn" onClick={getGreeting}>
        Get current greeting
      </button>
      <p>{greeting}</p>
      <button className="btn" onClick={setGreet}>
        Set greeting
      </button>
      {greetSet && (
        <p>
          click <span>Get current greeting</span> to view new greeting
        </p>
      )}
    </div>
  );
}

export default App;
