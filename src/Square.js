import React from 'react';
import emptySquare from './assets/iconmonstr-square-4.svg';
import filledSquare from './assets/iconmonstr-square-1.svg';
import filledX from './assets/iconmonstr-x-mark-1.svg';

class Square extends React.Component {

    imageSelect(image) {
        var newImage;

        switch (image) {
            case "empty": newImage = emptySquare;
                break;
            case "filled": newImage = filledSquare;
                break;
            case "X": newImage = filledX;
                break;
            default:
                break;
        }

        return newImage;
    }

    render() {
        return(
            <img draggable="false" src={this.imageSelect(this.props.image)} alt='' className="Test" xpos={this.props.xpos} ypos={this.props.ypos} sqnum={this.props.sqnum} onMouseDown={(e) => this.props.onMouseDown(e)} onContextMenu={(e) => this.props.onContextMenu(e)} onMouseEnter={(e) => this.props.onMouseEnter(e)}></img>
        );
        }
}


export default Square;