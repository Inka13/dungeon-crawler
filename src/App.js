import React from 'react';
import './App.css';
import Map from './Map';
import $ from "jquery";

class App extends React.Component {
  constructor(props){
    super(props);
    this.tileSize = 30;
    this.weapons = ["Stick", "Knife", "Axe", "Sword", "Spear", "Gun", "Mashine Gun", "Laser Gun"];
    this.weaponsImg = ["stick2.png", "knife.png", "axe.png", "sword.png", "spear.png", "gun.png", "machine.png", "laser.png"];
    this.state = {
      mapLevel: 1, board: [], rows: 15, cols: 20,
      player: {x: 1, y: 1}, playerLevel: 1, playerHealth: 100, playerExp: 0, playerWeapon: "Stick",
      dead: false, win: false,
      exit: {x: 13, y: 18,}, enemies: 4, health: 6, weapons: 2,
      x: ((window.innerHeight-20)/2)-(this.tileSize),
      y: ((window.innerWidth-20)/2)-(this.tileSize),
      enemyHealth: 0
    }
    /*this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.createMap = this.createMap.bind(this);
    this.nextBoard = this.nextBoard.bind(this);
    this.showTiles = this.showTiles.bind(this);*/
    this.handleMove = this.handleMove.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleWin = this.handleWin.bind(this);
  }
  componentWillMount() {
    // start listening for keyboard input
    document.addEventListener('keydown', this.handleMove);
  }
  componentDidMount(){
    // get JSON with level 1 board data
    this.nextBoard(1);
  }
  nextBoard(level){
    let file = 'maps/map' + level + '.json';
    // properties of all 4 levels properties
    let levels = [{rows: 15, cols: 20, player: {x: 1, y: 1,}, exit: {x: 13, y: 18,}, enemies: 4, health: 6, weapons: 2},
                  {rows: 15, cols: 30, player: {x: 1, y: 1,}, exit: {x: 13, y: 28,}, enemies: 4, health: 7, weapons: 2},
                  {rows: 30, cols: 20, player: {x: 1, y: 1,}, exit: {x: 28, y: 18,}, enemies: 5, health: 8, weapons: 2},
                  {rows: 30, cols: 40, player: {x: 1, y: 1,}, exit: {x: 28, y: 38,}, enemies: 6, health: 13, weapons: 1}];
    // getting the JSON with board data
    $.getJSON(file, (result) => {
      let j = level-1;
      // changing state to accomoddate new board properties
      this.setState({
          mapLevel: level++, board: result, rows: levels[j].rows, cols: levels[j].cols,
          player: {
            x: levels[j].player.x,
            y: levels[j].player.y
          },
          exit: levels[j].exit, enemies: levels[j].enemies, health: levels[j].health, weapons: levels[j].weapons
      });
      // creating new map
      this.createMap(result);
    });
  }
  createMap(board) {
    let playerX = this.state.player.x,
        playerY = this.state.player.y;
        //enemyHealth;
    // setting visibility of tiles surrounding the player to visible
    this.showTiles(playerX, playerY, board);
    // setting player starting position
    board[playerX][playerY].contains.type = "player";
    // setting enemyBoss position if last level
    if(this.state.mapLevel === 4){
      board[this.state.exit.x][this.state.exit.y].contains.type = "enemyBoss";
      board[this.state.exit.x][this.state.exit.y].contains.health = 200;
      // else setting exit position
    } else board[this.state.exit.x][this.state.exit.y].contains.type = "exit";
    // placing enemies, health and weapon items randomly
    for(let i = 0; i < this.state.enemies; i++){
      let x = Math.floor(Math.random()* this.state.rows),
          y = Math.floor(Math.random()* this.state.cols);
      if(board[x][y].contains.type === "" && board[x][y].type !== "wall"){
        board[x][y].contains.type = "enemy";
        board[x][y].contains.health = Math.floor(99*(1+this.state.mapLevel/10));
        //enemyHealth = board[x][y].contains.health;
      } else i--;
    }
    for(let i = 0; i < this.state.health; i++){
      let x = Math.floor(Math.random()* this.state.rows),
          y = Math.floor(Math.random()* this.state.cols);
      if(board[x][y].contains.type === "" && board[x][y].type !== "wall"){
        board[x][y].contains.type = "health";
      } else i--;
    }
    for(let i = 0; i < this.state.weapons; i++){
      let x = Math.floor(Math.random()* this.state.rows),
          y = Math.floor(Math.random()* this.state.cols);
      if(board[x][y].contains.type === "" && board[x][y].type !== "wall"){
        board[x][y].contains.type = "weapon";
      } else i--;
    }
    // centering the player on the screen
    this.setState({
      board: board,
      x: ((window.innerHeight-20)/2)-(this.tileSize*playerX),
      y: ((window.innerWidth-20)/2)-(this.tileSize*playerY),
      enemyHealth: 0
    });
  }
  showTiles(x, y, board) {
    // setting visibility of tiles surrounding the player to visible
    for(let i = x - 3; i <= x + 3; i++){
      for(let j = y - 3; j <= y + 3; j++){
        if(i >= 0 && i < this.state.rows && j >= 0 && j<this.state.cols) {
          if(Math.sqrt(Math.pow(x - i, 2) + Math.pow(y - j, 2)) <= Math.sqrt(10)){
            board[i][j].visible = true;
          }
        }
      }
    }
    this.setState({
      board: board
    });
  }
  handleMove(e) {
    var board = [...this.state.board];
    let x, xp, y, yp,
        playerX = this.state.player.x,
        playerY = this.state.player.y,
        playerLevel = this.state.playerLevel,
        playerHealth = this.state.playerHealth,
        playerWeapon = this.state.playerWeapon,
        playerExp = this.state.playerExp,
        dead = false, win = false,
        enemyHealth = this.state.enemyHealth;
    // getting next field coordinates
    switch(e.code) {
      case "ArrowDown":
        x = -this.tileSize; xp = 1; y = 0; yp = 0;
        break;
      case "ArrowUp":
        x = this.tileSize; xp = -1; y = 0; yp = 0;
        break;
      case "ArrowLeft":
        x = 0; xp = 0; y = this.tileSize; yp = -1;
        break;
      case "ArrowRight":
        x = 0; xp = 0; y = -this.tileSize; yp = 1;
        break;
      default:
        return;
    }
    let next = board[playerX + xp][playerY + yp];
    // checking next field properties
    // limiting players movement ONLY to tiles fith type "field"
    if(next.type === "field"){
      // changing game properties depending on whether player collects health or a weapon, or encounters an enemy
      if(next.contains.type === "enemy" || next.contains.type === "enemyBoss"){
        // next field contains enemy
        // you can't win the game if your level is < 8
          if(next.contains.type === "enemyBoss" && playerLevel<8) dead = true;
          // taking health damage from enemy depending on his level(mapLevel) somewhat in a range
          else playerHealth -= Math.floor((next.contains.health/4*(1 + this.state.mapLevel/10) + Math.random()*4));
          if(playerHealth <= 0) dead = true;
          // doing damaging to the enemy depending on your level and weapons somewhat in a range
          board[playerX + xp][playerY + yp].contains.health -= Math.ceil(((35 + playerLevel)*(1 + this.weapons.indexOf(playerWeapon)/10) + Math.random()*10));
          enemyHealth = board[playerX + xp][playerY + yp].contains.health;
          // if enemy still alive don't move to the next field
          if(next.contains.health > 0) { xp=0; yp=0; x=0; y=0; }
          else {
            
            // gain experience depending on enemy level (mapLevel)
              playerExp += Math.ceil(40*(1 + this.state.mapLevel/10));
              // player level up if experience hits 100, and reset exsperience
              if(playerExp >= 100) { playerExp -= 100; playerLevel = playerLevel+1; }
              // enemy dead and was enemyBoss YOU WIN
              if(next.contains.type === "enemyBoss") win = true;
          }
      } else {
        if(next.contains.type === "health") playerHealth = playerHealth <= 55 ? playerHealth + 45 : 100;
        if(next.contains.type === "weapon") playerWeapon = this.weapons[this.weapons.indexOf(playerWeapon)+1];
        if(next.contains.type === "exit") this.nextBoard(this.state.mapLevel + 1);
      }
      // moving the player to the next field
      board[playerX][playerY].contains.type = "";
      board[playerX + xp][playerY + yp].contains.type = "player";
      if(xp!==0 || yp!==0) enemyHealth = 0;
      this.showTiles(playerX + xp, playerY + yp, board);
      this.setState({
        board: board,
        x: this.state.x + x,
        y: this.state.y + y,
        player: { x: playerX + xp, y: playerY + yp },
        playerLevel, playerHealth, playerExp, playerWeapon,
        dead, win,
        enemyHealth
      });
    }
  }
  handleWin() {
    this.setState({
      player: {x: 1, y: 1}, playerLevel: 1, playerHealth: 100, playerExp: 0, playerWeapon: "Stick",
      dead: false, win: false
    });
    this.nextBoard(1);
  }
  handleRestart() {
    this.setState({
      player: {x: 1, y: 1}, playerLevel: 1, playerHealth: 100, playerExp: 0, playerWeapon: "Stick",
      dead: false, win: false
    });
    this.nextBoard(1);
  }
  render() {
    if(!this.state.dead && !this.state.win) {
      //let barWidth = document.getElementById('bars').getBoundingClientRect().width;

      let plStyle = {
        width: ((400/200)*this.state.playerHealth) + "px"
      }
      let enStyle = {
        width: ((400/200)*this.state.enemyHealth) + "px"
      }
      let exStyle = {
        width: ((400/200)*this.state.playerExp) + "px"
      }
      let weapon = "images/" + this.weaponsImg[this.weapons.indexOf(this.state.playerWeapon)];
      console.log(this.playerWeapon);
      
    return (
      
      <div className="app">
        <div id="header">
          <h1>Dungeon Crawler</h1>
          <div className="stats" id="level">{this.state.playerLevel}</div>
          <div className="stats" ><img id="weapon" src={weapon} alt="weapon"/></div>
          
          <div id="stats">
            <div className="props">
              <div className="prop">Experience: </div>
              <div className="prop">Health:</div>
              <div className="prop">Enemy:</div>
            </div>
            <div className="props">
              <div className="prop" id="exp"  style={exStyle}>{this.state.playerExp}</div>
              <div className="prop" id="playerHealth" style={plStyle}>{this.state.playerHealth}</div>
              <div className="prop" id="enemyHealth" style={enStyle}>{this.state.enemyHealth}</div>
            </div>
          
        </div>
        </div>
        <div className="map-view">
          <Map board={this.state.board} x={this.state.x} y={this.state.y} rows={this.state.rows} cols={this.state.cols}/>
        </div>
      </div>
    );
    } else if(this.state.win){
    return (
      <div className="app">
        <div className="ending">
          <h1>You Win Win Win!</h1>
          <div onClick={this.handleRestart}>WEEEEEE!!!!</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="app">
        <div className="ending">
          <h1>You Lose!</h1>
          <div onClick={this.handleRestart}>Restart</div>
        </div>
      </div>
    );
  }
}
}
export default App;
