const path = require('path');
const os = require('os');

const { EVMLC, DataDirectory } = require('evm-lite-lib');

const compile = require('./classes/compile');
const ClaimHub = require('./classes/ClaimHub');

let evmlc;
let claimHub;

const initEVMConnection = async () => {
  try {
    evmlc = new EVMLC('evm0.capjupiter.com', 8080, {
      from: '0X3F9D41ECEA757FC4E2B44BE3B38A788DE2F11AD7',
      gas: 100000000,
      gasPrice: 0,
    });
  } catch (error) {
    console.log(`\x1b[31m${error}\x1b[0m\n`);
  }
};

const assignEvmlcDirectory = () => {
  const evmlcDirectory = new DataDirectory(
    path.join(os.homedir(), '.evmlc'),
  );
  return evmlcDirectory;
};

const decryptAccount = async (password, evmlcDirectory) => {
  try {
    const account = await evmlcDirectory.keystore.decryptAccount(
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

const genClaimHubClass = (contract, account) => {
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

const demo = async () => {
  // Step1
  initEVMConnection();
  console.log(
    'Step 1 ) \n'
    + 'At the very beginning, we specify the host of the EVM-Lite and our default account.\n'
    + `EVM-Lite Address : ${evmlc.host}\n`
    + `Default Account : ${evmlc.defaultFrom}\n`,
  );

  // Step2
  const evmlcDirectory = await assignEvmlcDirectory();
  console.log(
    'Step 2 ) \n'
    + 'The private keys reside directly on our own device, so we need to specify \n'
    + 'the location in order to decrypt the account later.\n'
    + `Default EVMLC Location : ${os.homedir()}/.evmlc\n`,
  );

  // Step3
  const password = 'password';
  const account = await decryptAccount(password, evmlcDirectory);
  console.log(
    'Step 3 ) \n'
    + 'Get account from keystore and decrypt the account.\n'
    + 'Decrypt Account :',
  );
  console.log(account);

  // Step 4
  const contractName = 'claimHub';
  const filename = 'claimHub';
  const contract = await loadContract(contractName, filename);
  await genClaimHubClass(contract, account);
  console.log(
    '\n'
    + 'Step 4 ) \n'
    + 'Compiled the Claimhub SmartContract. \n'
    + 'The contract was written in the high-level Solidity language which compiles \n'
    + 'down to EVM bytecode.'
    + 'Smart Contract Object : ',
  );
  console.log(contract);

  // Step 5
  const receipt = await deploySmartContract();
  console.log(
    '\n'
  + 'Step 5 ) \n'
  + 'To deploy the SmartContract we created an EVM transaction \n'
  + 'with a data field containing the bytecode. After going through consensus, the \n'
  + 'transaction is applied on every node, so every participant will run a copy of \n'
  + 'the same code with the same data.\n'
  + 'Receipt: ',
  );
  console.log(receipt.receipt);

  // Step 6
  const claimOwner = 'Junwei';
  const claimContent = 'SZ9BFDNKYEPJPFNTDZWLMAKNXBCDUFUIXUIKA9GRYPYTTNCNKEWBBVPJXMLD9QPOHRXHMPRKLSBGMIHRL';
  const setResponce = await setClaim(claimOwner, claimContent);
  console.log(
    '\n'
  + 'Step 6 ) \n'
  + 'We created an EVM transaction to call the setClaim method of the SmartContract. \n'
  + 'This will create a combination of claims in the contract, \n'
  + 'in this claim will explain the ownership of the claim and the corresponding content.\n'
  + 'Transaction Responce : ',
  );
  console.log(setResponce);

  // Step 7
  const getResponce = await getClaim(claimOwner);
  console.log(
    '\n'
  + 'Step 7 ) \n'
  + `Junwei's claim content : ${getResponce}`,
  );
};

demo();
