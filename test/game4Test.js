const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game4", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game4");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
    const signer0 = ethers.provider.getSigner(0);
    const signer1 = ethers.provider.getSigner(1);

    const addr0 = await signer0.getAddress();
    const addr1 = await signer1.getAddress();

    // signer1 writes to create nested[addr0][addr1] = true
    await game.connect(signer1).write(addr0);

    // signer0 wins by referencing addr1
    await game.connect(signer0).win(addr1);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
