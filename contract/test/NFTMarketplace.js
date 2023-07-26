const { expect } = require("chai");

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("NFTMarketplace", function () {
  const tokenURI =
    "https://ipfs.io/ipfs/QmUCJXcmfSdAARFwTg3oLVJtxxGUTMYg1kiJbApnwebvR5";
  const tokenTitle = "Token Title";
  const tokenDescription = "Token Description";
  const tokenPrice = BigInt("1");
  let nftMarketplace;
  let owner;
  let alice;
  let bob;

  async function deployLoadingFixture() {
    [owner, alice, bob] = await ethers.getSigners();
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy("NFTMarketplace", "NFTM");
  }

  it("should mint a new token", async function () {
    await loadFixture(deployLoadingFixture);

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
    await loadFixture(deployLoadingFixture);

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
    await loadFixture(deployLoadingFixture);

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
    await loadFixture(deployLoadingFixture);

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
    await nftMarketplace.connect(bob).buyToken(tokenId, { value: tokenPrice });
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
    await loadFixture(deployLoadingFixture);

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
