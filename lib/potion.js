function Potion(name) {
  this.types = ["strength", "agility", "health"];
  this.name = name || this.types[Math.floor(Math.random() * this.types.length)];

  if (this.name === "health") {
    this.value = Math.floor(Math.random() * 20 + 50);
  } else {
    this.value = Math.floor(Math.random() * 5 + 10);
  }
}

module.exports = Potion;
