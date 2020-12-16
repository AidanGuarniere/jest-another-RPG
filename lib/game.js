const inquirer = require("inquirer");
const Enemy = require("./Enemy");
const Player = require("./Player");

function Game() {
  this.roundNumber = 0;
  this.isPlayerTurn = false;
  this.enemies = [];
  this.currentEnemy;
  this.player;
}

Game.prototype.initializeGame = function () {
  //populate enemies array
  this.enemies.push(new Enemy("goblin", "sword"));
  this.enemies.push(new Enemy("orc", "club"));
  this.enemies.push(new Enemy("skeleton", "axe"));

  this.currentEnemy = this.enemies[0];

  // ask for player name
  inquirer
    .prompt({
      type: "text",
      name: "name",
      message: "What is your name?",
    })
    // destructure name from the prompt object
    .then(({ name }) => {
      this.player = new Player(name);

      this.startNewBattle();
    });
};

Game.prototype.startNewBattle = function () {
  // player stats
  console.log("Your stats are as follows:");
  console.table(this.player.getStats());

  // enemy description
  console.log(this.currentEnemy.getDescription());

  if (this.player.agility > this.currentEnemy.agility) {
    this.isPlayerTurn = true;
  } else {
    this.isPlayerTurn = false;
  }

  this.battle();
};

Game.prototype.battle = function () {
  // if player turn, ask if they'd like to attack or use a potion
  if (this.isPlayerTurn) {
    inquirer
      .prompt({
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: ["Attack", "Use potion"],
      })
      // if potion,
      .then(({ action }) => {
        if (action === "Use potion") {
          if (!this.player.getInventory()) {
            console.log("You don't have any potions!");
            return this.checkEndOfBattle();
          }

          inquirer
            .prompt({
              type: "list",
              message: "Which potion would you like to use?",
              name: "action",
              choices: this.player
                .getInventory()
                .map((item, index) => `${index + 1}: ${item.name}`),
            })
            .then(({ action }) => {
              const potionDetails = action.split(": ");
              console.log(`You used a ${potionDetails[1]} potion`);

              this.checkEndOfBattle();
            });
        } else {
          // attack enemy, reducing health by your attack value
          const damage = this.player.getAttackValue();
          this.currentEnemy.reduceHealth(damage);

          console.log(`You attacked the ${this.currentEnemy.name}`);
          console.log(this.currentEnemy.getHealth());

          this.checkEndOfBattle();
        }
      });
  } else {
    const damage = this.currentEnemy.getAttackValue();
    this.player.reduceHealth(damage);

    console.log(`You were attacked by the ${this.currentEnemy.name}`);
    console.log(this.player.getHealth());

    this.checkEndOfBattle();
  }
};

Game.prototype.checkEndOfBattle = function () {
  if (this.player.isAlive() && this.currentEnemy.isAlive()) {
    this.isPlayerTurn = !this.isPlayerTurn;
    this.battle();
  } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
    console.log(`You've defeated the ${this.currentEnemy.name}`);

    this.player.addPotion(this.currentEnemy.potion);
    console.log(
      `${this.player.name} found a ${this.currentEnemy.potion.name} potion`
    );

    this.roundNumber++;

    if (this.roundNumber < this.enemies.length) {
      this.currentEnemy = this.enemies[this.roundNumber];
      this.startNewBattle();
    } else {
      console.log(`${this.player.name} wins!`);
    }
  } else {
      console.log(`The ${this.currentEnemy.name} defeated ${this.player.name} on Round ${this.roundNumber + 1}!`);
  }
};

module.exports = Game;
