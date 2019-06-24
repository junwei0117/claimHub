import { composeAPI } from 'evm-engine-lib';
import { claimHub, defaultPassword, account, APIHost, APIPort } from './constant';

const engineAPI = composeAPI(APIHost, APIPort, account.address);

const deployContract = async (keystore: any) => {
  const contractName = 'claimHub';
  const compilerVersion = 'v0.4.25+commit.59dbf8f1';

  const contract = await engineAPI.deployContract(
    keystore,
    defaultPassword,
    claimHub,
    contractName,
    compilerVersion,
  );

  return contract;
}

const interactContract = async (keystore: any, method: string, contract: any, parameters: any) => {
  const responce = await engineAPI.interactContract(
    keystore,
    defaultPassword,
    contract.address,
    contract.abi,
    method,
    parameters,
  );

  return responce;
}

const demo = async () => {
  // Step 1
  // Deploy cthe ontract
  const contract = await deployContract(account.keystore);
  console.log(`\nContract Address : ${contract.address}\n`)

  // Step 2
  // Interact with the contract
  const setClaimMethod = 'setClaim';
  const claimOwner = 'Junwei';
  const claimContent = 'SZ9BFDNKYEPJPFNTDZWLMAKNXBCDUFUIXUIKA9GRYPYTTNCNKEWBBVPJXMLD9QPOHRXHMPRKLSBGMIHRL';
  const setClaimParameters = [claimOwner, claimContent];
  await interactContract(account.keystore, setClaimMethod, contract, setClaimParameters);

  const getClaimMethod = 'getClaim';
  const getClaimParameters = [claimOwner];
  const getClaimResponse = await interactContract(account.keystore, getClaimMethod, contract, getClaimParameters);
  console.log(`Claim Owner : ${claimOwner}\nClaim content : ${getClaimResponse}`);
};

demo();
