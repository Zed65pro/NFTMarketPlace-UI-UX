import { useEffect, useState } from "react";
import { useGlobalState } from "../store";
import { Card } from "./Card";

const MyNfts = () => {
  const [nfts] = useGlobalState("nfts");
  const [ownerNfts, setOwnerNfts] = useState<any[]>([]);
  const [account] = useGlobalState("connectedAccount");
  const [end, setEnd] = useState(4);
  const [count] = useState(4);
  const [collection, setCollection] = useState([]);
  const [key, setKey] = useState(0);

  const getCollection = () => {
    if (account) {
      const filteredNFTs = nfts.filter(
        (nft: any) => nft.owner.toLowerCase() === account.toLowerCase()
      );
      setOwnerNfts(filteredNFTs);
      return filteredNFTs.slice(0, end);
    }
  };

  useEffect(() => {
    setCollection(getCollection());
  }, [nfts, end, account, key]);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [account]);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [nfts]);

  if (!account) return <></>;

  return (
    <div className="bg-[#151c25] gradient-bg-artworks" id="myArtworks">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          {collection.length > 0 ? "My Artworks" : "No owned Artworks yet"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {collection.map((nft: any, i) => (
            <Card key={nft.id} nft={nft} />
          ))}
        </div>

        {collection.length > 0 && ownerNfts.length > collection.length ? (
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

export default MyNfts;
