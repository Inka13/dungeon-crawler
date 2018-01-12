import React from 'react';

class Tile extends React.Component {
  constructor(props){
    super(props);
    this.shouldComponentUpdate=this.shouldComponentUpdate.bind(this);
    }
  shouldComponentUpdate(nextProps) {
    return (this.props.tile.type !== nextProps.type) || (this.props.tile.contains.type !== nextProps.contains.type);
  }
  render() {
    var background, tileBackground;
    if(this.props.tile.type === "wall"){
      tileBackground = "url('images/wall.png')";
    } else {
      tileBackground = "url('images/floor.png')";
      switch(this.props.tile.contains.type) {
        case "player":
          background = "url('images/knight.png')";
          break;
        case "enemy":
          background = "url('images/dragon.png')";
          break;
        case "enemyBoss":
            background = "url('images/dragonBoss.png')";
            break;
        case "health":
          background = "url('images/health3.png')";
          break;
        case "weapon":
          background = "url('images/weapons.png')";
          break;
        case "exit":
            background = "url('images/exit.png')";
            break;
        default:
          background = "url('images/floor.png')";
        }
    }
    let style={
      visibility: this.props.tile.visible ? "visible" : "hidden",
      background: tileBackground,
    }
    let spriteStyle = {
      background: background
    }
    if (this.props.tile.contains.type !== "") {

      return (
        <div className="tile" style={style}>
          <div id="plImg"><div id="plImage" style={spriteStyle}></div></div>
        </div>
      );
    } else {
      return (
        <div className="tile" style={style}>
        </div>
      );
    }
  }
}

export default Tile;
