const { EVMLC } = require('evm-lite-lib');
const { DataDirectory } = require('evm-lite-lib');

const solc = require('solc');
const fs = require('fs');

// Default from address
const from = '0X11F61F522EDB273C4CC21F517BB1F0039B4671D0';

// EVMLC object
const evmlc = new EVMLC('127.0.0.1', 8080, {
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
const contractAddress = '0xd516362ff674a55d7e91fa746ff0350bc1b0b567';

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
  const abi = JSON.parse(compiledOutput.contracts[contractName].interface);
  const contract = await evmlc.loadContract(abi, {
    data,
    contractAddress,
  });
  return contract;
};

const setClaim = async () => {
  const account = await accountDecrypt();
  const contract = await loadContract();

  const claimOwner = 'Junwei';
  const claimContent = 'SZ9BFDNKYEPJPFNTDZWLMAKNXBCDUFUIXUIKA9GRYPYTTNCNKEWBBVPJXMLD9QPOHRXHMPRKLSBGMIHRL';

  const transaction = await contract.methods.setClaim(claimOwner, claimContent);
  await transaction.sign(account);
  await transaction.submit();
  return transaction;
};

setClaim()
  .then(res => console.log(res))
  .catch(error => console.log(error));
