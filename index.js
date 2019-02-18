const path = require('path');
const { EVMLC, DataDirectory } = require('evm-lite-lib');
const os = require('os');

const compile = require('./classes/compile');
const ClaimHub = require('./classes/ClaimHub');
/**
 * Generate EVMLC interaction object.
 */
const evmlc = new EVMLC('210.240.162.43', 8080, {
  from: '0X11F61F522EDB273C4CC21F517BB1F0039B4671D0',
  gas: 100000000,
  gasPrice: 0,
});

const directory = new DataDirectory(
  path.join(os.homedir(), '.evmlc'),
);

const demo = async () => {
  /**
  * Compiled contract and get `data` and `abi`.
  */
  const compiled = compile.compile('claimHub', 'claimHub');

  /**
  * Get account from keystore and decrypt the account.
  */
  const account = await directory.keystore.decryptAccount(
    evmlc.defaultFrom,
    'password',
  );

  /**
  * Generate contract abstraction object.
  */
  const contract = await evmlc.contracts.load(compiled.abi, {
    data: compiled.bytecode,
  });

  /**
  * Generate `claimHub` class.
  */
  const claimHub = new ClaimHub.ClaimHub(contract, account);

  /**
  * Deploy the `claimHub` to `EVM-Lite`
  */
  await claimHub.deploy();

  /**
  * Set claim to the `claimHub`.
  */
  const claimOwner = 'Junwei';
  const claimContent = 'SZ9BFDNKYEPJPFNTDZWLMAKNXBCDUFUIXUIKA9GRYPYTTNCNKEWBBVPJXMLD9QPOHRXHMPRKLSBGMIHRL';

  await claimHub.setClaim(claimOwner, claimContent);

  /**
  * Get claim from the `claimHub`.
  */
  console.log(await claimHub.getClaim(claimOwner));
};

demo();
