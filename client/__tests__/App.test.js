import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import {
  isWalletConnected,
  handleAccountOnRefresh,
  fetchTransactions,
  fetchNFTs,
} from "../src/Blockchain.services";

jest.mock("./Blockchain.services", () => ({
  isWalletConnected: jest.fn(),
  handleAccountOnRefresh: jest.fn(),
  fetchTransactions: jest.fn(),
  fetchNFTs: jest.fn(),
}));

describe("App component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call isWalletConnected and handleAccountOnRefresh once when the component mounts", () => {
    render(<App />);
    expect(isWalletConnected).toHaveBeenCalledTimes(1);
    expect(handleAccountOnRefresh).toHaveBeenCalledTimes(1);
  });

  it("should call fetchTransactions and fetchNFTs when account is set", () => {
    const mockAccount = "mock-account";
    render(<App />);
    expect(fetchTransactions).toHaveBeenCalledTimes(1);
    expect(fetchNFTs).toHaveBeenCalledTimes(1);
  });

  it("should have useEffect with account in the dependency array", () => {
    const useEffectSpy = jest.spyOn(React, "useEffect");
    render(<App />);
    expect(useEffectSpy).toHaveBeenCalledWith(expect.any(Function), [
      expect.any(String),
    ]);
  });

  it("should render MyNfts component when account is set", () => {
    const mockAccount = "mock-account";
    render(<App />);
    const myNftsElement = screen.getByTestId("my-nfts");
    expect(myNftsElement).toBeInTheDocument();
  });

  it("should not render MyNfts component when account is not set", () => {
    render(<App />);
    const myNftsElement = screen.queryByTestId("my-nfts");
    expect(myNftsElement).toBeNull();
  });
});
