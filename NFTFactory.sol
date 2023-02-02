// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTFactory {
    struct Owner{
        NFT nft;
        address owner;
        bool valid;
    }

    mapping(address => Owner) nftOwners;
    NFT[] nftContracts;

    modifier onlyOnePerOwner (){
        require(nftOwners[msg.sender].valid != true, "Only One per Owner !");
        _;
    }

    function createNFT(string memory _name, string memory _symbol) public onlyOnePerOwner{
        
        NFT newNFT = new NFT(_name, _symbol, msg.sender);
        nftOwners[msg.sender] = Owner({nft: newNFT, owner: msg.sender, valid:true});
        nftContracts.push(newNFT);
    }

    function getNFTs() public view returns (NFT[] memory){
        return nftContracts;
    }

    function checkIfOwner() public view returns (bool){
        return nftOwners[msg.sender].valid;
    }

    function nftName() public view returns (string memory){
        return nftOwners[msg.sender].nft.name();
    }

    function nftSymbol() public view returns (string memory){
        return nftOwners[msg.sender].nft.symbol();
    }

    function nftContract() public view returns (NFT){
        return nftOwners[msg.sender].nft;
    }
}

contract NFT is ERC721URIStorage {
    address public owner;

    string[] public collection;

    event NewQuote(string tokenURI);

    modifier OnlyOwner() {
        require(msg.sender == owner, "Only owner can mint");
        _;
    }

    constructor(string memory _name, string memory _symbol, address _owner) ERC721(_name, _symbol){
        owner = _owner;
    }

    function _mint(uint256 id, string memory tokenURI) internal OnlyOwner{
        _mint(owner, id);
        _setTokenURI(id, tokenURI);
    }

    function mint(string memory tokenURI) public {
        _mint(collection.length + 1, tokenURI);
        collection.push(tokenURI);
        emit NewQuote(tokenURI);
    }

    function getCollection() public view returns(string[] memory){
        return collection;
    }
}