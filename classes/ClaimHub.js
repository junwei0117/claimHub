class ClaimHub {
  constructor(contract, account) {
    this.contract = contract;
    this.account = account;
  }

  async deploy() {
    await this.contract.deploy(this.account);
  }

  async setClaim(owner, claimContent) {
    const transaction = await this.contract.setClaim(owner, claimContent);

    await transaction.submit({}, this.account);

    const receipt = await transaction.receipt;

    return receipt;
  }

  async getClaim(owner) {
    const transaction = await this.contract.getClaim(owner);

    const response = await transaction.submit({}, this.account);

    return response;
  }
}

exports.ClaimHub = ClaimHub;