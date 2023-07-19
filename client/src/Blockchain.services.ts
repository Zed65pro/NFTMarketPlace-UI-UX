import { ethers } from "ethers";
import { SESSION_STORAGE_KEY } from "./lib/constants";
import { getGlobalState, setGlobalState } from "./store";
import { contractAddress, contractAbi } from "./lib/constants";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      sessionStorage.setItem(SESSION_STORAGE_KEY, address);
      setGlobalState("connectedAccount", address);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Metamask not detected in the browser");
    return alert("Metamask not detected in the browser");
  }
};

export const isWalletConnected = async () => {
  const account = getGlobalState("connectedAccount");
  const handleAccountChange = (accounts: string[]) => {
    if (accounts.length > 0 && account !== accounts[0]) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, accounts[0]);
      setGlobalState("connectedAccount", accounts[0]);
    } else {
      setGlobalState("connectedAccount", null);
    }
  };

  if (!window.ethereum) {
    return alert("Metamask not detected in the browser");
  }

  window.ethereum.on("accountsChanged", handleAccountChange);

  return () => {
    window.ethereum.removeListener("accountsChanged", handleAccountChange);
  };
};

export const handleAccountOnRefresh = async () => {
  const account = getGlobalState("connectedAccount");
  if (account === null && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
    const storedAccount = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (storedAccount) {
      setGlobalState("connectedAccount", storedAccount);
    }
  }
};

const getContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  return contract;
};

// Mint a new token
export async function mintToken(price: string) {
  const account = getGlobalState("connectedAccount");

  try {
    const contract = await getContract();
    const mintTx = await contract.mintToken(
      account,
      ethers.utils.parseEther(price)
    );
    await mintTx.wait();

    console.log("Token minted successfully");
    return true;
  } catch (error) {
    console.error("Error minting token:", error);
    return false;
  }
}

export const getTotalSupply = async () => {
  const contract = await getContract();
  const supply = await contract.getTokenIds();
  return parseInt(supply);
};

// // Get the price of a token
// async function getTokenPrice(contract, tokenId) {
//   try {
//     const tokenPrice = await contract.getTokenPrice(tokenId);
//     console.log('Token price:', ethers.utils.formatEther(tokenPrice));
//   } catch (error) {
//     console.error('Error getting token price:', error);
//   }
// }

// // Get the owner of a token
// async function getOwnerOfToken(contract, tokenId) {
//   try {
//     const owner = await contract.getOwnerOfToken(tokenId);
//     console.log('Token owner:', owner);
//   } catch (error) {
//     console.error('Error getting token owner:', error);
//   }
// }

// // Approve token transfer
// async function approveTokenTransfer(contract, to, tokenId) {
//   try {
//     const approveTx = await contract.approve(to, tokenId);
//     await approveTx.wait();
//     console.log('Token transfer approved successfully');
//   } catch (error) {
//     console.error('Error approving token transfer:', error);
//   }
// }

//setprice
export async function updateNFT(tokenId: number, price: string) {
  const account = getGlobalState("connectedAccount");

  try {
    const contract = await getContract();
    const mintTx = await contract._setTokenPrice(tokenId, price);
    await mintTx.wait();

    console.log("updated succesfuly");
  } catch (error) {
    console.error("Error updating nft:", error);
  }
}

//setprice
export async function buyNFT(tokenId: number, price: string) {
  try {
    const contract = await getContract();
    const buyTx = await contract.buyToken(tokenId, {
      value: ethers.utils.parseEther(price),
    });
    await buyTx.wait();
    console.log("Token purchased successfully");
  } catch (error) {
    console.error("Error buying token:", error);
  }
}
