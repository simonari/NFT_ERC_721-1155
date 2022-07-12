// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract MyERC721 is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public baseTokenURI;

    constructor(
        string memory _name, 
        string memory _symbol) 
        ERC721(_name, _symbol) {
        }

    function mintNFT(address _to, string memory _tokenURI) public onlyOwner {
        _tokenIds.increment();

        uint256 newTokenID = _tokenIds.current();

        _mint(_to, newTokenID);
        _setTokenURI(newTokenID, _tokenURI);
    }
}