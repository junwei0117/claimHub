const { EVMLC } = require('evm-lite-lib');
const { DataDirectory } = require('evm-lite-lib');

// Default from address
const from = '0X3CECAA0F2A6054022320A7C4C0C229A8D9062244';

// EVMLC object
const evmlc = new EVMLC('210.240.162.43', 8080, {
  from,
  gas: 1000000,
  gasPrice: 0,
});

// Keystore object
const dataDirectory = new DataDirectory('/Users/junwei/.evmlc/');
const password = 'password';

// Contract Object
const contractPath = 'contract/claimhub.sol';
const contractName = 'claimHub';
const contractAddress = '0x7ee1d718810015129cb09ccf0cc33753f04cf4ad';

// Claim Object
const claimOwner = 'Ender';
const claimContent = 'SZ9BFDNKYEPJPFNTDZWLMAKNXBCDUFUIXUIKA9GRYPYTTNCNKEWBBVPJXMLD9QPOHRXHMPRKLSBGMIHRL';

// Get keystore object from the keystore directory
// For the from address so we can decrypt and sign
const accountDecrypt = async () => {
  const account = await dataDirectory.keystore.decrypt(from, password);
  return account;
};

// Generate contract object with ABI and data
const generateContract = async () => {
  const compiled = evmlc.compileContract(contractName, contractPath);
  const contract = await evmlc.loadContract(compiled.abi, {
    data: compiled.bytecode,
    contractAddress,
  });
  return contract;
};

const setClaim = async (account, cfContract) => {
  const transaction = await cfContract.methods.setClaim(claimOwner, claimContent);
  await transaction.sign(account);
  await transaction.submit();
  return transaction;
};

const demo = async () => {
  const account = await accountDecrypt();
  const cfContract = await generateContract();
  const response = await setClaim(account, cfContract);
  return response;
};

demo()
  .then(res => console.log(res))
  .catch(error => console.log(error));
