// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Post is ERC721 {

  mapping(string => uint256) public likes;
  uint256 public commentCount;
  mapping(address => mapping (string => string)) public comments;
  mapping(address => mapping (string => bool)) public commentAccounts;
  mapping(address => mapping (string => bool)) public likedAccoounts;
  uint256 like = 0;

  constructor() ERC721("Post", "POST") public  {
  }

  event NFTCreated (
    uint tokenId,
    string imageURL,
    uint date,
    address payable from
  );

  event commentEvent (
    string comment,
    uint256 commentCount
  );

  function likeIncrement(string memory postName) public {
    require(likedAccoounts[msg.sender][postName]==false);
    likes[postName]++;
    // uint length = likedAccoounts.length;
    likedAccoounts[msg.sender][postName] = true;
  }

  function likeDecrement(string memory postName) public {
    require(likedAccoounts[msg.sender][postName]==true);
    likes[postName]--;
    likedAccoounts[msg.sender][postName] = false;
  }

  function addressToString(address _pool) public pure returns (string memory _uintAsString) {
    uint _i = uint256(_pool);
    if (_i == 0) {
        return "0";
    }
    uint j = _i;
    uint len;
    while (j != 0) {
        len++;
        j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint k = len - 1;
    while (_i != 0) {
        bstr[k--] = byte(uint8(48 + _i % 10));
        _i /= 10;
    }
    return string(bstr);
  }

  function commentOperation(string memory _comment, string memory postName) public {
    require(commentAccounts[msg.sender][postName]==false);
    commentCount += 1;
    comments[msg.sender][postName] = _comment;
    // comments[addressToString(msg.sender)] = _comment;

    emit commentEvent(_comment, commentCount);
  }

  function mintNFT(string memory _tokenURI) external {
    uint _tokenId = totalSupply().add(1);
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _tokenURI);

    emit NFTCreated(_tokenId, _tokenURI, now, msg.sender);
  }

}