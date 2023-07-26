import { getGlobalState, setGlobalState } from "../store";

export const Card = ({ nft }: any) => {
  const setNFT = () => {
    const account = getGlobalState("connectedAccount");
    if (!account) return alert("Metamask not connected amk");
    setGlobalState("nft", nft);
    setGlobalState("showModal", "scale-100");
  };

  return (
    <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3">
      <img
        src={nft.metadataURI}
        alt={nft.title}
        className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
      />
      <h4 className="text-white font-semibold">{nft.title}</h4>
      <p className="text-gray-400 text-xs my-1">{nft.description}</p>
      <div className="flex justify-between items-center mt-3 text-white">
        <div className="flex flex-col">
          <small className="text-xs">Current Price</small>
          {nft?.price > 0 ? (
            <p className="text-sm font-semibold">{nft?.price} MATIC</p>
          ) : (
            <p className="text-sm font-semibold text-red-600">Not listed</p>
          )}
        </div>

        <button
          className="shadow-lg shadow-black text-white text-sm bg-[#e32970]
              hover:bg-[#bd255f] cursor-pointer rounded-full px-1.5 py-1"
          onClick={setNFT}
        >
          View Details
        </button>
      </div>
    </div>
  );
};
