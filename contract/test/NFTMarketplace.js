const { expect } = require("chai");
// const { ethers } = require("ethers");
const { BigNumber } = require("ethers");

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("NFTMarketplace", function () {
  async function deployLoadingFixture() {
    const tokenURI =
      "https://ipfs.io/ipfs/QmUCJXcmfSdAARFwTg3oLVJtxxGUTMYg1kiJbApnwebvR5";
    const tokenTitle = "Token Title";
    const tokenDescription = "Token Description";
    // const tokenPrice = ethers.parseEther("0.01");
    // ethers.BigNumber.from(tokenPrice.toString())
    // const tokenPrice = "0.01";
    // const tokenPrice = ethers.parseUnits("0.01", 18); // Convert to BigNumber
    const tokenPrice = BigInt("1");

    const [owner, alice, bob] = await ethers.getSigners();
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy(
      "NFTMarketplace",
      "NFTM"
    );
    // await nftMarketplace.deployed();

    return {
      nftMarketplace,
      owner,
      alice,
      bob,
      tokenURI,
      tokenTitle,
      tokenDescription,
      tokenPrice,
    };
  }

  it("should mint a new token", async function () {
    const {
      nftMarketplace,
      owner,
      alice,
      tokenURI,
      tokenTitle,
      tokenDescription,
      tokenPrice,
    } = await loadFixture(deployLoadingFixture);

    await nftMarketplace
      .connect(owner)
      .mintToken(
        alice.address,
        tokenPrice,
        tokenURI,
        tokenTitle,
        tokenDescription
      );
    const tokenId = parseInt(await nftMarketplace.getTokenIds());
    const ownerof = await nftMarketplace.ownerOf(tokenId);

    console.log(ownerof);
    expect(ownerof).to.equal(alice.address);
    expect(await nftMarketplace.getTokenPrice(tokenId)).to.equal(tokenPrice);
  });

  it("should list a token for sale", async function () {
    const {
      nftMarketplace,
      owner,
      alice,
      tokenURI,
      tokenTitle,
      tokenDescription,
      tokenPrice,
    } = await loadFixture(deployLoadingFixture);

    await nftMarketplace
      .connect(owner)
      .mintToken(
        alice.address,
        tokenPrice,
        tokenURI,
        tokenTitle,
        tokenDescription
      );
    const tokenId = parseInt(await nftMarketplace.getTokenIds());
    await nftMarketplace.connect(alice).listForSale(tokenId, tokenPrice);

    expect(await nftMarketplace.getTokenPrice(tokenId)).to.equal(tokenPrice);
  });

  it("should cancel listing of a token", async function () {
    const {
      nftMarketplace,
      owner,
      alice,
      tokenURI,
      tokenTitle,
      tokenDescription,
      tokenPrice,
    } = await loadFixture(deployLoadingFixture);

    await nftMarketplace
      .connect(owner)
      .mintToken(
        alice.address,
        tokenPrice,
        tokenURI,
        tokenTitle,
        tokenDescription
      );
    const tokenId = parseInt(await nftMarketplace.getTokenIds());

    await nftMarketplace.connect(alice).listForSale(tokenId, tokenPrice);
    await nftMarketplace.connect(alice).cancelListing(tokenId);

    expect(await nftMarketplace.getTokenPrice(tokenId)).to.equal(0);
  });

  it("should buy a token", async function () {
    const {
      nftMarketplace,
      owner,
      alice,
      bob,
      tokenURI,
      tokenTitle,
      tokenDescription,
      tokenPrice,
    } = await loadFixture(deployLoadingFixture);

    await nftMarketplace
      .connect(owner)
      .mintToken(
        alice.address,
        tokenPrice,
        tokenURI,
        tokenTitle,
        tokenDescription
      );

    const tokenId = parseInt(await nftMarketplace.getTokenIds());
    await nftMarketplace.connect(alice).listForSale(tokenId, tokenPrice);

    const aliceBalanceBefore = await ethers.provider.getBalance(alice.address);
    const bobBalanceBefore = await ethers.provider.getBalance(bob.address);
    const buyTx = await nftMarketplace
      .connect(bob)
      .buyToken(tokenId, { value: tokenPrice });
    const aliceBalanceAfter = await ethers.provider.getBalance(alice.address);
    const bobBalanceAfter = await ethers.provider.getBalance(bob.address);

    // Convert balance to Ether for comparison and round to 4 decimal places
    const tokenPriceInEther = parseFloat(ethers.formatEther(tokenPrice));
    const aliceBalanceBeforeInEther = parseFloat(
      ethers.formatEther(aliceBalanceBefore)
    );
    const aliceBalanceAfterInEther = parseFloat(
      ethers.formatEther(aliceBalanceAfter)
    );
    const bobBalanceBeforeInEther = parseFloat(
      ethers.formatEther(bobBalanceBefore)
    );
    const bobBalanceAfterInEther = parseFloat(
      ethers.formatEther(bobBalanceAfter)
    );

    const expectedAliceBalanceAfter = (
      aliceBalanceBeforeInEther + tokenPriceInEther
    ).toFixed(2);
    const expectedBobBalanceAfter = (
      bobBalanceBeforeInEther - tokenPriceInEther
    ).toFixed(2);

    expect(await nftMarketplace.ownerOf(tokenId)).to.equal(bob.address);
    expect(await nftMarketplace.getTokenPrice(tokenId)).to.equal(0);
    expect(aliceBalanceAfterInEther.toFixed(2)).to.equal(
      expectedAliceBalanceAfter
    );
    expect(bobBalanceAfterInEther.toFixed(2)).to.equal(expectedBobBalanceAfter);
  });

  it("should approve a token transfer", async function () {
    const {
      nftMarketplace,
      owner,
      alice,
      bob,
      tokenURI,
      tokenTitle,
      tokenDescription,
      tokenPrice,
    } = await loadFixture(deployLoadingFixture);

    await nftMarketplace
      .connect(owner)
      .mintToken(
        alice.address,
        tokenPrice,
        tokenURI,
        tokenTitle,
        tokenDescription
      );
    const tokenId = parseInt(await nftMarketplace.getTokenIds());
    await nftMarketplace.connect(alice).approve(bob.address, tokenId);

    expect(await nftMarketplace.getApprovedAddress(tokenId)).to.equal(
      bob.address
    );
  });
});
