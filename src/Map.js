import React from 'react';
import Tile from './Tile';

class Map extends React.Component {
  render() {
    if(this.props.board.length > 0){
      var mapBoard = [];
      for(let i = 0; i < this.props.rows; i++){
        for(let j = 0; j < this.props.cols; j++){
          mapBoard.push(<Tile key={i.toString()+"_"+j.toString()} tile={this.props.board[i][j]}/>);
        }
      }
    }
    var style = {
      width: this.props.cols * 30,
      height: this.props.rows * 30,
      top: this.props.x,
      left: this.props.y,
    };
    return (
      <div className="map" style={style}>
        {mapBoard}
      </div>
    );
  }
}

export default Map;
