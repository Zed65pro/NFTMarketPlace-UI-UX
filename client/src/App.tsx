import { useEffect } from "react";
import {
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
import { getGlobalState } from "./store";

const App = () => {
  useEffect(() => {
    isWalletConnected();
    handleAccountOnRefresh();
    //  getAllNFTs();
  }, []);

  const account = getGlobalState("connectedAccount");
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <Hero />
      </div>
      {account && <MyNfts />}
      <Artworks />
      <Transactions />
      <CreateNFT />
      <ShowNFT />
      <UpdateNFT />
      <Footer />
      <Alert />
      <Loading />
    </div>
  );
};

export default App;
