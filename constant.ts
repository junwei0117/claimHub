export const APIHost = 'localhost';
export const APIPort = 8080;
export const defaultPassword = 'password';
export const account = {
  address: '0x41de06d0ebe6430492a5c71b5301259c56b8fd30',
  keystore: {
      version: 3,
      id: 'cec84268-7192-413f-a795-90bbc6450a88',
      address: '41de06d0ebe6430492a5c71b5301259c56b8fd30',
      crypto: {
          ciphertext: 'cfa222147891cb373253bef2158e73f3dca4fff1cc58d20e8f6fb3af0012a289',
          cipherparams: {
              iv: 'f9fcb00fe7dc9a03883a54da41461455',
          },
          cipher: 'aes-128-ctr',
          kdf: 'scrypt',
          kdfparams: {
              dklen: 32,
              salt: 'dfd83809097714d0f2e47f47f983aae097cd4ff32595c7e4673b83dff6fcbd69',
              n: 8192,
              r: 8,
              p: 1,
          },
          mac: '580dbdd982917eb6e0fdcfb20deb7fd7bee8a8837abdeac2f24c5e040d1020f5',
      },
  },
};
export const claimHub = `
pragma solidity ^0.4.24;

contract claimHub {
    mapping(string => Claim) claims;

    struct Claim{
        string owner;
        string claimContent;
    }

    function setClaim(string _owner, string _claimContent) public {
        claims[_owner].owner = _owner;
        claims[_owner].claimContent = _claimContent;
    }

    function getClaim(string _owner) public view returns (string) {
        return claims[_owner].claimContent;
    }

}
`;
