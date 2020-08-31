import React from 'react';
import emptySquare from './assets/iconmonstr-square-4.svg';
import filledSquare from './assets/iconmonstr-square-1.svg';

class Square extends React.Component {

    render() {
        return(
            <img src={this.props.image === 'empty' ? emptySquare : filledSquare} alt='' className="Test" onClick = {(e) => this.props.onClick(e)}></img>
        );
        }
}


export default Square;