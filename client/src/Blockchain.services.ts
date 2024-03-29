import { ethers } from "ethers";
import { getGlobalState, setGlobalState } from "./store";
import {
  contractAddress,
  contractAbi,
  SESSION_STORAGE_KEY,
} from "./lib/constants";

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

const setNumberOfArtists = (nftData: any[]) => {
  const allOwners = nftData.map((item: any) => item.owner);
  const uniqueOwners = new Set(allOwners);
  setGlobalState("artistCount", uniqueOwners.size);
};

export const fetchNFTs = async () => {
  // Fetch NFT metadata for each token ID
  const contract = await getContract();
  const supply = await contract.getTokenIds();
  const tokenIds = Array.from(Array(parseInt(supply)), (_, index) => index + 1);

  const nftPromises = tokenIds.map(async (tokenId) => {
    const tokenData = await contract.getNFTData(tokenId);
    return {
      id: tokenId,
      owner: tokenData[0],
      price: ethers.utils.formatEther(tokenData[1]),
      metadataURI: tokenData[2],
      title: tokenData[3],
      description: tokenData[4],
    };
  });

  // Wait for all promises to resolve
  const nftData = await Promise.all(nftPromises);
  // Set the NFTs in state
  setNumberOfArtists(nftData);
  setGlobalState("artworkCount", nftData.length);
  setGlobalState("nfts", nftData);
};

export const fetchTransactions = async () => {
  // Fetch NFT metadata for each token ID
  const contract = await getContract();

  let _transactions = await contract.getTransactions();
  _transactions = _transactions.map((transaction: any) => ({
    ...transaction,
    price: ethers.utils.formatEther(transaction.price),
  }));
  console.log(_transactions);
  // Set the NFTs in state
  setGlobalState("transactionCount", _transactions.length);
  setGlobalState("transactions", _transactions);
};

// Mint a new token
export async function mintToken(nft: any) {
  const account = getGlobalState("connectedAccount");

  try {
    const contract = await getContract();
    const mintTx = await contract.mintToken(
      account,
      ethers.utils.parseEther(nft.price),
      nft.metadataURI,
      nft.title,
      nft.description
    );
    await mintTx.wait();

    console.log("Token minted successfully");
    return true;
  } catch (error) {
    console.error("Error minting token:", error);
    return false;
  }
}

//total supply
export const getTotalSupply = async () => {
  const contract = await getContract();
  const supply = await contract.getTokenIds();
  return parseInt(supply);
};

//setprice
export async function updateNFT(
  tokenOwner: string,
  tokenId: number,
  price: string
) {
  try {
    const contract = await getContract();
    const mintTx = await contract.updateTokenPrice(
      tokenOwner,
      tokenId,
      ethers.utils.parseEther(price)
    );
    await mintTx.wait();

    console.log("updated succesfuly");
    return true;
  } catch (error) {
    console.error("Error updating nft:", error);
    return false;
  }
}

//purchase token
export async function buyNFT(tokenId: number, price: string) {
  try {
    const contract = await getContract();
    const buyTx = await contract.buyToken(tokenId, {
      value: ethers.utils.parseEther(price),
    });
    await buyTx.wait();

    console.log("Token purchased successfully");
    return true;
  } catch (error) {
    console.error("Error buying token:", error);
    return false;
  }
}

// Get the owner of a token
export async function getOwnerOfToken(tokenId: string) {
  try {
    const contract = await getContract();
    const owner = await contract.getOwnerOfToken(tokenId);
    console.log("Token owner:", owner);
  } catch (error) {
    console.error("Error getting token owner:", error);
  }
}
