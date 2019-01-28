pragma solidity ^0.4.24;

contract claimHub {
    mapping(string => User) users;

    struct User{
        string owner;
        string[] claim;
    }

    function setClaim(string _owner, string _claim) public {
        users[_owner].owner = _owner;
        users[_owner].claim.push(_claim);
    }

    function getClaim(string _owner, uint256 _claimIndex) public view returns (string) {
        return users[_owner].claim[_claimIndex];
    }

}
