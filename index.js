const path = require('path');
const os = require('os');

const { EVMLC, DataDirectory } = require('evm-lite-lib');

const compile = require('./classes/compile');
const ClaimHub = require('./classes/ClaimHub');

let evmlc;
let evmlcDirectory;
let claimHub;
let account;

const initEVMConnection = async () => {
  evmlc = new EVMLC('evm0.capjupiter.com', 8080, {
    from: '0X3F9D41ECEA757FC4E2B44BE3B38A788DE2F11AD7',
    gas: 100000000,
    gasPrice: 0,
  });
};

const assignEvmlcDirectory = () => {
  evmlcDirectory = new DataDirectory(
    path.join(os.homedir(), '.evmlc'),
  );
};

const decryptAccount = async (password) => {
  try {
    account = await evmlcDirectory.keystore.decryptAccount(
      evmlc.defaultFrom,
      password,
    );
    return account;
  } catch (error) {
    console.log(`\x1b[31m${error}\x1b[0m\n`);
  }
};

const loadContract = async (contractName, filename) => {
  try {
    const compiled = await compile.compile(contractName, filename);
    const contract = await evmlc.contracts.load(compiled.abi, {
      data: compiled.bytecode,
    });
    return contract;
  } catch (error) {
    console.log(`\x1b[31m${error}\x1b[0m\n`);
  }
};

const genClaimHubClass = (contract) => {
  try {
    claimHub = new ClaimHub.ClaimHub(contract, account);
  } catch (error) {
    console.log(`\x1b[31m${error}\x1b[0m\n`);
  }
};

const deploySmartContract = async () => {
  try {
    const responce = await claimHub.deploy();
    return responce;
  } catch (error) {
    console.log(`\x1b[31m${error}\x1b[0m\n`);
  }
};

const setClaim = async (claimOwner, claimContent) => {
  try {
    const responce = await claimHub.setClaim(claimOwner, claimContent);
    return responce;
  } catch (error) {
    console.log(`\x1b[31m${error}\x1b[0m\n`);
  }
};

const getClaim = async (claimOwner) => {
  try {
    const responce = await claimHub.getClaim(claimOwner);
    return responce;
  } catch (error) {
    console.log(`\x1b[31m${error}\x1b[0m\n`);
  }
};

initEVMConnection()
  .then(() => console.log(
    'Step 1 ) \n'
    + 'At the very beginning, we specify the host of the EVM-Lite and our default account.\n',
  ))
  .then(() => {
    assignEvmlcDirectory();
  })
  .then(() => console.log(
    'Step 2 ) \n'
    + 'The private keys reside directly on our own device, so we need to specify \n'
    + 'the location in order to decrypt the account later.\n',
  ))
  .then(() => {
    const password = 'password';
    decryptAccount(password);
  })
  .then(() => console.log(
    'Step 3 ) \n'
    + 'Get account from keystore and decrypt the account.\n',
  ))
  .then(() => {
    const contractName = 'claimHub';
    const filename = 'claimHub';
    loadContract(contractName, filename);
  })
  .then((contract) => {
    genClaimHubClass(contract);
  })
  .then(() => console.log(
    'Step 4 ) \n'
    + 'Compiled the Claimhub SmartContract. \n'
    + 'The contract was written in the high-level Solidity language which compiles \n'
    + 'down to EVM bytecode.\n',
  ))
  .then(() => {
    deploySmartContract();
  })
  .then(responce => console.log(
    'Step 5 ) \n'
    + `Receipt : ${responce}\n`
    + 'To deploy the SmartContract we created an EVM transaction \n'
    + 'with a data field containing the bytecode. After going through consensus, the \n'
    + 'transaction is applied on every node, so every participant will run a copy of \n'
    + 'the same code with the same data.\n',
  ))
  .then(() => {
    const claimOwner = 'Junwei';
    const claimContent = 'SZ9BFDNKYEPJPFNTDZWLMAKNXBCDUFUIXUIKA9GRYPYTTNCNKEWBBVPJXMLD9QPOHRXHMPRKLSBGMIHRL';
    setClaim(claimOwner, claimContent);
  })
  .then(responce => console.log(
    'Step 6 ) \n'
    + `Transaction Responce : ${responce}\n`
    + 'We created an EVM transaction to call the setClaim method of the SmartContract. \n'
    + 'This will create a combination of claims in the contract, \n'
    + 'in this claim will explain the ownership of the claim and the corresponding content.\n',
  ))
  .then(() => {
    const claimOwner = 'Junwei';
    getClaim(claimOwner);
  })
  .then(responce => console.log(
    'Step 7 ) \n'
    + `Junwei's claim content : ${responce}`,
  ));
