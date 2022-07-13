// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract MyERC1155 is ERC1155URIStorage, Ownable {
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC1155("") {
    }

    function mintNFT(
        address _to, 
        uint256 _tokenId, 
        uint256 _amount, 
        string memory _tokenURI) 
    public onlyOwner {
        _mint(_to, _tokenId, _amount, "");
        setTokenURI(_tokenId, _tokenURI);
    }

    function mintBatchNFT(
        address _to,
        uint256[] memory _tokenId,
        uint256[] memory _amount,
        string[] memory _tokenURI) 
    public onlyOwner {
        _mintBatch(_to, _tokenId, _amount, "");
        
        for (uint256 i; i < _tokenId.length; i++) {
            setTokenURI(_tokenId[i], _tokenURI[i]);
        }
    }

    function burnNFT(
        address _to,
        uint256 _tokenId,
        uint256 _amount
    )
    public onlyOwner {
        _burn(_to, _tokenId, _amount);
    }

    function burnBatchNFT(
        address _to,
        uint256[] memory _tokenId,
        uint256[] memory _amount
    )
    public onlyOwner {
        _burnBatch(_to, _tokenId, _amount);
    }

    function uri(uint256 _tokenId) 
    public override view 
    returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    function setTokenURI(uint256 _tokenId, string memory _tokenURI) 
    private {
        _tokenURIs[_tokenId] = _tokenURI;
        emit URI(uri(_tokenId), _tokenId);
    }
}
