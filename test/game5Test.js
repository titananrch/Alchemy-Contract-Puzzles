const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    // Find a wallet whose address starts with 0x00...
    let wallet;
    do {
      wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    } while (!wallet.address.startsWith('0x00'));

    console.log(`Winning address found: ${wallet.address}`);

    // Fund it so it can pay gas
    const funder = (await ethers.getSigners())[0];
    await funder.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther('1'),
    });

    return { game, winningWallet: wallet };
  }
  it('should be a winner', async function () {
    const { game, winningWallet } = await loadFixture(deployContractAndSetVariables);

    // good luck

    await game.connect(winningWallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
