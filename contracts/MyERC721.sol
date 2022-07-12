// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract MyERC721 is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    address private _minter;

    constructor(
        string memory name_, 
        string memory symbol_) 
        ERC721(name_, symbol_) {}


    function mint(address _to) public onlyOwner() returns (uint256)  {
        _tokenIds.increment();

        _mint(_to, _tokenIds.current());
        _setTokenURI(_tokenIds.current(), tokenURI(_tokenIds.current()));
        return _tokenIds.current();
    }
}