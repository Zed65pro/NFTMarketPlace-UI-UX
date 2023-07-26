import Identicon from "react-identicons";
import { FaTimes } from "react-icons/fa";
import {
  useGlobalState,
  setGlobalState,
  shortenWalletAddress,
  setAlert,
  getGlobalState,
} from "../store";
import { buyNFT, updateNFT } from "../Blockchain.services";

const ShowNFT = () => {
  const [showModal] = useGlobalState("showModal");
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [nft] = useGlobalState("nft");

  const onUnlistToken = async () => {
    setGlobalState("showModal", "scale-0");
    setGlobalState("loading", {
      show: true,
      msg: "unlisting your token...",
    });
    try {
      const res = await updateNFT(nft.owner, nft.id, "0");
      if (!res) throw new Error();

      setAlert("Unlisted successfuly...", "green");
      const nfts = getGlobalState("nfts");
      const _updatedNFTs = nfts.map((item: any) =>
        item.id === nft.id ? { ...item, price: 0.0 } : item
      );
      setGlobalState("nfts", _updatedNFTs);
    } catch (error) {
      console.log("Error transfering NFT: ", error);
      setAlert("Unlisting failed...", "red");
    }
  };

  const onChangePrice = () => {
    setGlobalState("showModal", "scale-0");
    setGlobalState("updateModal", "scale-100");
  };

  const handleNFTPurchase = async () => {
    setGlobalState("showModal", "scale-0");
    setGlobalState("loading", {
      show: true,
      msg: "Initializing NFT transfer...",
    });

    try {
      const res = await buyNFT(nft.id, nft.price);
      if (!res) throw new Error();
      setAlert("Transfer completed...", "green");

      //Update NFT owner
      const account = getGlobalState("connectedAccount");
      const nfts = getGlobalState("nfts");
      const _updatedNFTs = nfts.map((item: any) =>
        item.id === nft.id ? { ...item, price: 0.0, owner: account } : item
      );
      setGlobalState("nfts", _updatedNFTs);

      //Add a transaction
      const _transaction = {
        id: nft.id,
        from: nft.owner,
        to: account,
        title: nft.title,
        price: nft.price,
      };
      const transactions = getGlobalState("transactions");
      setGlobalState("transactions", [...transactions, _transaction]);
    } catch (error) {
      console.log("Error transfering NFT: ", error);
      setAlert("Purchase failed...", "red");
    }
  };

  const priceCheck = () => {
    return nft?.price > 0 ? (
      <button
        className="flex flex-row justify-center items-center
          w-full text-white text-md bg-[#e32970]
          hover:bg-[#bd255f] py-2 px-5 rounded-full
          drop-shadow-xl border border-transparent
          hover:bg-transparent hover:text-[#e32970]
          hover:border hover:border-[#bd255f]
          focus:outline-none focus:ring mt-5"
        onClick={handleNFTPurchase}
      >
        Purchase Now
      </button>
    ) : (
      <button
        className="flex flex-row justify-center items-center
        w-full text-white text-md bg-[#e4241d]
        hover:bg-[#bd255f] py-2 px-5 rounded-full
        drop-shadow-xl border border-transparent
        hover:bg-transparent hover:text-[#f45d42]
        hover:border hover:border-[#bd255f]
        focus:outline-none focus:ring mt-5"
        onClick={handleNFTPurchase}
        disabled={true}
      >
        Token is not listed yet
      </button>
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
          justify-center bg-black bg-opacity-50 transform
          transition-transform duration-300 ${showModal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Buy NFT</p>
            <button
              type="button"
              onClick={() => setGlobalState("showModal", "scale-0")}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40">
              <img
                className="h-full w-full object-cover cursor-pointer"
                src={nft?.metadataURI}
                alt={nft?.title}
              />
            </div>
          </div>

          <div className="flex flex-col justify-start rounded-xl mt-5">
            <h4 className="text-white font-semibold">{nft?.title}</h4>
            <p className="text-gray-400 text-xs my-1">{nft?.description}</p>

            <div className="flex justify-between items-center mt-3 text-white">
              <div className="flex justify-start items-center">
                <Identicon
                  string={nft?.owner}
                  size={50}
                  className="h-10 w-10 object-contain rounded-full mr-3"
                />
                <div className="flex flex-col justify-center items-start">
                  <small className="text-white font-bold">@owner</small>
                  <small className="text-pink-800 font-semibold">
                    {nft?.owner
                      ? shortenWalletAddress(nft.owner, 4, 4, 11)
                      : "..."}
                  </small>
                </div>
              </div>

              <div className="flex flex-col">
                <small className="text-xs">Current Price</small>
                {nft?.price > 0 ? (
                  <p className="text-sm font-semibold">{nft?.price} MATIC</p>
                ) : (
                  <p className="text-sm font-semibold text-red-600">
                    Not listed
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center space-x-2">
            {connectedAccount?.toLowerCase() === nft?.owner.toLowerCase() ? (
              <>
                <button
                  className="flex flex-row justify-center items-center
                w-full text-[#e32970] text-md border-[#e32970]
                py-2 px-5 rounded-full bg-transparent 
                drop-shadow-xl border hover:bg-[#bd255f]
                hover:bg-transparent hover:text-white
                hover:border hover:border-[#bd255f]
                focus:outline-none focus:ring mt-5"
                  onClick={onChangePrice}
                >
                  {nft.price > 0 ? "Change Price" : "List token"}
                </button>
                {nft?.price > 0 && (
                  <button
                    className="flex flex-row justify-center items-center
                w-full text-[#e32970] text-md border-[#e32970]
                py-2 px-5 rounded-full bg-transparent 
                drop-shadow-xl border hover:bg-[#bd255f]
                hover:bg-transparent hover:text-white
                hover:border hover:border-[#bd255f]
                focus:outline-none focus:ring mt-5"
                    onClick={onUnlistToken}
                  >
                    Unlist Token
                  </button>
                )}
              </>
            ) : (
              priceCheck()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowNFT;
