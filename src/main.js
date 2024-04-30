import { World } from './world/World.js';

async function main() {
  try {
    const container = document.querySelector('#scene-container');
    const world = new World(container);
    await world.init();

    world.start();

    const diceNumber = document.querySelector('#dice-num');
    const colorSelect = document.querySelector('#dice-color');
    const rollBtn = document.querySelector('#roll-btn');
    const totalValue = document.querySelector('#total-value');

    colorSelect.addEventListener('change', (e) => {
      world.setDieColor(e.target.value);
    });

    diceNumber.addEventListener('change', (e) => {
      world.setDiceNumber(e.target.value);
    });

    rollBtn.addEventListener('click', () => {
      world.rollDice();
    });

    world.container.addEventListener("diceStopped", () => {
      totalValue.innerHTML = world.totalValue;
    });
  }

  catch(error) {
    console.log(error);
  }
}

main();