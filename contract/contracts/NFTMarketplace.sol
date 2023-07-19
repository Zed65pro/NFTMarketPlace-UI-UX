// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    mapping(uint256 => uint256) private _tokenPrices;
    mapping(uint256 => address) private _tokenOwners;
    mapping(uint256 => address) private _tokenApprovals;
    
    event TokenListed(uint256 tokenId, uint256 price);
    event TokenSold(uint256 tokenId, address buyer, uint256 price);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function mintToken(address _to, uint256 _price) external {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(_to, newTokenId);
        _setTokenPrice(newTokenId, _price);
        _tokenOwners[newTokenId] = _to;
    }

    function listForSale(uint256 _tokenId, uint256 _price) external {
        require(_exists(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Only token owner can list for sale");
        _setTokenPrice(_tokenId, _price);
        emit TokenListed(_tokenId, _price);
    }
    
    function cancelListing(uint256 _tokenId) external {
        require(_exists(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Only token owner can cancel listing");
        _removeTokenPrice(_tokenId);
    }
    
    function buyToken(uint256 _tokenId) external payable {
        require(_exists(_tokenId), "Token does not exist");
        address tokenOwner = ownerOf(_tokenId);
        uint256 tokenPrice = _tokenPrices[_tokenId];
        require(tokenOwner != address(0), "Invalid token owner");
        require(msg.value >= tokenPrice, "Insufficient funds");
        
        _transfer(tokenOwner, msg.sender, _tokenId);
        _removeTokenPrice(_tokenId);
        
        if (msg.value > tokenPrice) {
            payable(msg.sender).transfer(msg.value - tokenPrice);
        }
        
        emit TokenSold(_tokenId, msg.sender, tokenPrice);
    }
    
    function getTokenPrice(uint256 _tokenId) external view returns (uint256) {
        return _tokenPrices[_tokenId];
    }
    
    function getOwnerOfToken(uint256 _tokenId) external view returns (address) {
        return ownerOf(_tokenId);
    }
    
    function approve(address _to, uint256 _tokenId) override public {
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner == msg.sender || isApprovedForAll(tokenOwner, msg.sender), "Not approved to transfer");
        _approve(_to, _tokenId);
        emit Approval(tokenOwner, _to, _tokenId);
    }
    
    function getApprovedAddress(uint256 _tokenId) external view returns (address) {
        return getApproved(_tokenId);   
    }
    
    function _setTokenPrice(uint256 _tokenId, uint256 _price) internal {
        _tokenPrices[_tokenId] = _price;
    }
    
    function _removeTokenPrice(uint256 _tokenId) internal {
        delete _tokenPrices[_tokenId];
    }

    function getTokenIds() external view returns (Counters.Counter memory) {
        return _tokenIds;
    }
}
