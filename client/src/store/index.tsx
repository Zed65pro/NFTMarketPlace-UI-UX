import { createGlobalState } from "react-hooks-global-state";

interface GlobalState {
  modal: string;
  updateModal: string;
  showModal: string;
  alert: any;
  loading: any;
  connectedAccount: string | null;
  nft: any;
  nfts: any;
  transactions: any;
  contract: any;
  artworkCount: number;
  artistCount: number;
  transactionCount: number;
}

const { setGlobalState, useGlobalState, getGlobalState } =
  createGlobalState<GlobalState>({
    modal: "scale-0",
    updateModal: "scale-0",
    showModal: "scale-0",
    alert: { show: false, msg: "", color: "" },
    loading: { show: false, msg: "" },
    connectedAccount: null,
    nft: null,
    nfts: [],
    transactions: [],
    contract: null,
    artworkCount: 0,
    artistCount: 0,
    transactionCount: 0,
  });

const setAlert = (msg: string, color = "green", timer = 4500) => {
  setGlobalState("loading", { show: false, msg: "" });
  setGlobalState("alert", { show: true, msg, color });
  setTimeout(() => {
    setGlobalState("alert", { show: false, msg: "", color });
  }, timer);
};

const setLoadingMsg = (msg: string) => {
  const loading = getGlobalState("loading");
  setGlobalState("loading", { ...loading, msg });
};

// TODO: ADD DOCUMENTATION
const shortenWalletAddress = (
  text: string,
  startChars: number,
  endChars: number,
  maxLength: number
) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + ".";
    }
    return start + end;
  }
  return text;
};

export {
  useGlobalState,
  setGlobalState,
  getGlobalState,
  setAlert,
  setLoadingMsg,
  shortenWalletAddress,
};
