import { useEffect, useState } from "react";
import { BiTransfer } from "react-icons/bi";
import { useGlobalState, shortenWalletAddress, setAlert } from "../store";
import copy from "clipboard-copy";

const COPY_ALERT_TIMER = 900;

const Transactions = () => {
  const [transactions] = useGlobalState("transactions");
  const [end, setEnd] = useState(3);
  const [count] = useState(3);
  const [collection, setCollection] = useState([]);

  const getCollection = () => {
    return transactions.slice(0, end);
  };

  const handleCopyToClipboard = (address: string) => {
    copy(address); // Copy the address to the clipboard
    setAlert("Copied Address to Clipboard", "green", COPY_ALERT_TIMER);
  };

  useEffect(() => {
    setCollection(getCollection());
  }, [transactions, end]);

  return (
    <div className="bg-[#151c25]" id="transactions">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          {collection.length > 0 ? "Latest Transactions" : "No Transaction Yet"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-2 py-2.5">
          {collection.map((tx: any) => (
            <div
              key={`${tx.id} ${tx.to} ${tx.from}`}
              className="flex justify-between items-center border border-pink-500 text-gray-400 w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3"
            >
              <div className="rounded-md shadow-sm shadow-pink-500 p-2">
                <BiTransfer />
              </div>

              <div>
                <h4 className="text-sm">{tx.title} Transfered</h4>
                <small className="flex flex-row justify-start items-center">
                  <span className="mr-1">Transferred by</span>
                  <p
                    className="text-pink-500 mr-2 cursor-pointer"
                    onClick={() => handleCopyToClipboard(tx.from)}
                  >
                    {shortenWalletAddress(tx.from, 4, 4, 11)}
                  </p>
                </small>
                <small className="flex flex-row justify-start items-center">
                  <span className="mr-1">Received by</span>
                  <p
                    className="text-pink-500 mr-2 cursor-pointer"
                    onClick={() => handleCopyToClipboard(tx.to)}
                  >
                    {shortenWalletAddress(tx.to, 4, 4, 11)}
                  </p>
                </small>
              </div>

              <p className="text-sm font-medium">{tx.price}MATIC</p>
            </div>
          ))}
        </div>

        {collection.length > 0 && transactions.length > collection.length ? (
          <div className="text-center my-5">
            <button
              className="shadow-xl shadow-black text-white
            bg-[#e32970] hover:bg-[#bd255f]
            rounded-full cursor-pointer p-2"
              onClick={() => setEnd(end + count)}
            >
              Load More
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Transactions;
