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
    const breakdown = document.querySelector('#breakdown');
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
      let totalDice = world.dice.length;
      let numTags = "";
      let sum = 0;

      for (let i = 0; i < totalDice; i++) {
        let value = world.dice[i].getDieValue();

        if (totalDice === 1) {
          sum += value;
          numTags = "";
          break;
        }

        sum += value;
        numTags += `<strong class="number">${value}</strong>`;
        i < totalDice-1 ? numTags+="+" : numTags+="=";
      }

      breakdown.innerHTML = numTags;
      totalValue.innerHTML = sum;
    });
  }

  catch(error) {
    console.log(error);
  }
}

main();