import { useEffect } from "react";
import {
  fetchNFTs,
  fetchTransactions,
  handleAccountOnRefresh,
  isWalletConnected,
} from "./Blockchain.services";
import Alert from "./components/Alert";
import Artworks from "./components/Artworks";
import CreateNFT from "./components/CreateNFT";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Loading from "./components/Loading";
import MyNfts from "./components/MyNfts";
import ShowNFT from "./components/ShowNFT";
import Transactions from "./components/Transactions";
import UpdateNFT from "./components/UpdateNFT";
import { useGlobalState } from "./store";

const App = () => {
  const [account] = useGlobalState("connectedAccount");
  useEffect(() => {
    isWalletConnected();
    handleAccountOnRefresh();
    if (account) fetchTransactions();
    if (account) fetchNFTs();
  }, [account]);

  return (
    <div className="min-h-screen">
      <div className={`gradient-bg-hero ${!account ? "min-h-screen" : ""}`}>
        <Header />
        <Hero />
        {!account && (
          <div className="flex justify-center items-center full-width py-24">
            <p className="font-bold  text-gradient text-6xl">
              Connect your wallet to preview the artworks
            </p>
          </div>
        )}
      </div>
      {account && <MyNfts />}
      {account && <Artworks />}
      {account && <Transactions />}
      {account && <CreateNFT />}
      {account && <ShowNFT />}
      {account && <UpdateNFT />}
      <Footer />
      <Alert />
      <Loading />
    </div>
  );
};

export default App;
