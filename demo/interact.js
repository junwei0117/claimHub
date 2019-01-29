const { EVMLC } = require('evm-lite-lib');
const { DataDirectory } = require('evm-lite-lib');

// Default from address
const from = '0x83B150E3D355B65AA443EBE19327AD368086D649';

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
const contractAddress = '0x1b7d22445c409e82b274fa98339c395cc5c27a3f';

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
  const claimOwner = 'Junwei';
  const claimContent = 'SZ9BFDNKYEPJPFNTDZWLMAKNXBCDUFUIXUIKA9GRYPYTTNCNKEWBBVPJXMLD9QPOHRXHMPRKLSBGMIHRL';
  const transaction = await cfContract.methods.setClaim(claimOwner, claimContent);
  await transaction.sign(account);
  await transaction.submit();
  return transaction.receipt;
};

const demo = async () => {
  const account = await accountDecrypt();
  const cfContract = await generateContract();
  const response = setClaim(account, cfContract);
  return response;
};

demo()
  .then(res => console.log(res))
  .catch(error => console.log(error));
