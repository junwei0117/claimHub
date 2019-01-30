const { EVMLC } = require('evm-lite-lib');
const { DataDirectory } = require('evm-lite-lib');

const solc = require('solc');
const fs = require('fs');

// Default from address
const from = '0X3CECAA0F2A6054022320A7C4C0C229A8D9062244';

// EVMLC object
const evmlc = new EVMLC('210.240.162.43', 8080, {
  from,
  gas: 1000000,
  gasPrice: 0,
});

// Keystore object
const dataDirectory = new DataDirectory('/Users/junwei/.evmlc');
const password = 'password';

// Contract Object
const rawContractName = 'claimHub';
const contractPath = 'contract/claimhub.sol';
const contractAddress = '0xda22aa6ee1a8cce03837600d8a235f5a099c3ee7';

// Get keystore object from the keystore directory
// For the from address so we can decrypt and sign
const accountDecrypt = async () => {
  const account = await dataDirectory.keystore.decryptAccount(from, password);
  return account;
};

// Generate contract object with ABI and data
const loadContract = async () => {
  const contractFile = fs.readFileSync(contractPath, 'utf8');
  const contractName = `:${rawContractName}`;
  const compiledOutput = solc.compile(contractFile, 1);
  const data = compiledOutput.contracts[contractName].bytecode;
  const ABI = JSON.parse(compiledOutput.contracts[contractName].interface);
  const contract = await evmlc.loadContract(ABI, {
    data,
    contractAddress,
  });
  return contract;
};

const getClaim = async () => {
  const account = await accountDecrypt();
  const contract = await loadContract();

  const claimOwner = 'Junwei';

  const transaction = await contract.methods.getClaim(claimOwner);
  await transaction.sign(account);
  const claimContent = await transaction.submit();
  return claimContent;
};

getClaim()
  .then(res => console.log(res))
  .catch(error => console.log(error));
