import {
  useGlobalState,
  setGlobalState,
  setLoadingMsg,
  setAlert,
  getGlobalState,
} from "../store";
import { updateNFT } from "../Blockchain.services";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const UpdateNFT = () => {
  const [modal] = useGlobalState("updateModal");
  const [nft] = useGlobalState("nft");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!price || parseFloat(price) <= 0) return;

    setGlobalState("modal", "scale-0");
    setGlobalState("loading", {
      show: true,
      msg: "Initiating price update...",
    });

    try {
      setLoadingMsg("Price updating...");
      setGlobalState("updateModal", "scale-0");

      const res = await updateNFT(nft.owner, nft.id, price);
      if (!res) throw new Error();
      setAlert("Price updated...", "green");

      const nfts = getGlobalState("nfts");
      const _updatedNFTs = nfts.map((item: any) =>
        item.id === nft.id ? { ...item, price } : item
      );
      setGlobalState("nfts", _updatedNFTs);
    } catch (error) {
      console.log("Error updating file: ", error);
      setAlert("Update failed...", "red");
    }
  };

  const handlePriceChange = (e: any) => {
    const enteredValue = e.target.value;
    const minValue = 0.01; // Minimum allowed value
    console.log(enteredValue);
    // Convert the entered value to a number and round it to three decimal places
    const roundedValue = parseFloat(parseFloat(enteredValue).toFixed(3));
    // If the entered value is less than the minimum allowed value, set the state to the minimum value
    if (enteredValue > 2000) {
      setPrice("1000");
      return;
    }

    if (roundedValue < minValue) {
      setPrice(minValue.toFixed(2));
    } else {
      setPrice(roundedValue.toString());
    }
  };
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 ${modal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">{nft?.title}</p>
            <button
              type="button"
              onClick={() => setGlobalState("updateModal", "scale-0")}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                alt={nft?.title}
                src={nft?.metadataURI}
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              value={price}
              placeholder="Price (MATIC)"
              onChange={handlePriceChange}
              required
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center
            w-full text-white text-md bg-[#e32970]
            hover:bg-[#bd255f] py-2 px-5 rounded-full
            drop-shadow-xl border border-transparent
            hover:bg-transparent hover:text-[#e32970]
            hover:border hover:border-[#bd255f]
            focus:outline-none focus:ring mt-5"
          >
            Update Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateNFT;
