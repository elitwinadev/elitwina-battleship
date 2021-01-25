import { VERTICAL, HORIZONTAL, RUSSIAN, FRENCH, SEA, MISS, HIT, AROUND_SINK, SHIP_PART, AROUND_SHIP } from "../stateManager/stateManager";
const random = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomBoolean = () => Math.random() < 0.5;
//updates a square on the board after a ship part was hit or sunk
const aroundSinkUpdate = (board, x, y) => {
    const newBoard = [...board];
    if (x >= 0 && y >= 0 && x <= newBoard.length - 1 && y <= newBoard.length - 1) {//!= undefined
        if (newBoard[x][y].value !== MISS && newBoard[x][y].value !== SHIP_PART) { //we want to keep miss visual, also not to change a sunken ship to a aroung sink bc of how loop works
            newBoard[x][y].value = AROUND_SINK;
        }
    }
    return newBoard;
};
//updates a square as one that is on the border of a ship, for placement purposes
const aroundShipUpdate = (board, x, y) => {
    const newBoard = [...board];
    if (x >= 0 && y >= 0 && x <= newBoard.length - 1 && y <= newBoard.length - 1) {//!= undefined
        if (newBoard[x][y].value !== SHIP_PART) { //making sure we aren't changing the value of a ship part to be an around ship bc of how loop works
            newBoard[x][y].aroundShip = true;
        }
    }
    return newBoard;
}
//used to update all the squares around a ship for placement and sinking
const aroundShipBoardUpdate = (board, ship, newValue) => {
    let newBoard = [...board];
    const updater = (x, y) => {// used to update the relevant value in the same line, since both need to be around the entire ship
        if (newValue === AROUND_SINK) {//when ship is sunk
            newBoard = aroundSinkUpdate(board, x, y);
        }
        else if (newValue === AROUND_SHIP) {//when ship is placed so no ships will be placed 1 square around it
            newBoard = aroundShipUpdate(board, x, y);
        }
    }
    const startX = ship.shipParts[0].x - 1;// using the diagonal top left and bootom right squares to the ship
    const startY = ship.shipParts[0].y - 1;// allows to iterate over all the surounding squares of a ship
    const endX = ship.shipParts[ship.length - 1].x + 1;
    const endY = ship.shipParts[ship.length - 1].y + 1;
    for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
            updater(i, j);// iteration over all surounding squares
        }
    }
    return newBoard
}
// used when a turn is used to attack to get the result of the attack attempt
export const inspectHit = (board, x, y) => {
    if (board[x][y].value === SHIP_PART) {
        return HIT;
    }
    return MISS;
}
// activated when inspect_hit's result is HIT
export const hitBoardUpdate = (x, y, shipIndex, board, ships) => {
    let newShips = [...ships];
    let newBoard = [...board];
    const partIndex = newShips[shipIndex].shipParts.findIndex((part) => part.x === x && part.y === y);
    newShips[shipIndex].shipParts[partIndex].isHit = true; // updating the ship part in the ships array as hit
    newBoard[x][y].isHit = true; // updating the ship part on the board as hit

    const isShipSunk = newShips[shipIndex].shipParts.every((shipPart) => shipPart.isHit);//checking if all parts of the ship are hit

    if (isShipSunk) {
        newShips[shipIndex].isSunk = isShipSunk; // updating the ship in the ships array as sunk
        newBoard = aroundShipBoardUpdate(newBoard, newShips[shipIndex], AROUND_SINK); // updating the board around the ship as sunk
    }
    const isWin = newShips.every((ship) => ship.isSunk); // checking if all ships are sunk

    for (let loopX = (x - 1); loopX <= x + 1; loopX++) {
        for (let loopY = (y - 1); loopY <= y + 1; loopY++) {
            if ((loopX + loopY) % 2 === (x + y) % 2) {      // this condition allows us to adress only squares diagonal to the square in [x][y]
                newBoard = aroundSinkUpdate(newBoard, (loopX), (loopY)); // updating diagonal squares to not reveal the ship's direction
            }
        }
    }
    return { board: newBoard, ships: newShips, isWin };
}
//used when inspect_hit's result is MISS
export const missBoardUpdate = (board, x, y) => {
    const newBoard = [...board];
    newBoard[x][y].value = MISS;
    return newBoard;
}
// used at the start of the game to place the ships of the board randomly.
export const placeShips = (board, ships) => {
    let newBoard = [...board];
    let newShips = [...ships];
    newShips.forEach((ship, index) => { // iterates over every ship until it is placed
        let needsPlacing = true;
        const directionalAdder = (limited, unlimited, num) => {// will be used to adress both vertical and horizontal facing ships in the same placement
            if (ship.direction === VERTICAL) {
                return { shipPartX: limited + num, shipPartY: unlimited }
            }
            if (ship.direction === HORIZONTAL) {
                return { shipPartX: unlimited, shipPartY: limited + num }
            }
        }

        re_placeShips: while (needsPlacing) { // looks for a place for the ship until it finds it
            let unlimited = random(9);              //generation of a random number not limited by the ships length
            let limited = random(9 - ship.length);  //generation of a random number limited by the ships length so as not to place a ship out of bounds

            for (let i = 0; i < ship.length; i++) { // iterates over the generated place for the ship to check if its viable
                let { shipPartX } = directionalAdder(limited, unlimited, i);// activation of the adder that adds a value to the direction that we need to iterate over
                let { shipPartY } = directionalAdder(limited, unlimited, i);
                if (newBoard[shipPartX][shipPartY].aroundShip !== false) {
                    continue re_placeShips; // if is not viable, restarts the while loop and finds othe random spot on board
                }
            }
            for (let i = 0; i < ship.length; i++) { // actualy placing the ship
                let { shipPartX } = directionalAdder(limited, unlimited, i);
                let { shipPartY } = directionalAdder(limited, unlimited, i);
                const newShipPart = {
                    shipIndex: index,
                    x: shipPartX,
                    y: shipPartY,
                    isHit: false,
                    value: SHIP_PART
                }
                ship.shipParts.push(newShipPart); // updating the ships array
                newBoard[shipPartX][shipPartY] = newShipPart; // updating the board
            }
            newBoard = aroundShipBoardUpdate(newBoard, ship, AROUND_SHIP); // updating around the ship to not place other ships there
            needsPlacing = false;
        }
    });

    return { board: newBoard, ships: newShips };
}
// creates an empty board for placement
export const initialGameBoard = (board = [[], [], [], [], [], [], [], [], [], []]) => {
    const newBoard = [...board]
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            newBoard[j].push({
                x: j,
                y: i,
                value: SEA,
                aroundShip: false
            })
        }
    }
    return newBoard;
}
// creates the ships structure without any parts in it
export const initialShips = (gameType = RUSSIAN) => {
    const shipNames = ['S10', 'S9', 'S8', 'S7', 'S6', 'S5', 'S4', 'S3', 'S2', 'S1'];//names of the ships in reverse order of giving them
    const ships = [];//the soon to be returned ships array
    const shipCreator = (length, name = shipNames.pop()) => { // default name is the last object of the mane array
        return {
            name,
            length,
            shipParts: [],
            direction: randomBoolean() ? VERTICAL : HORIZONTAL,
            isSunk: false
        }
    }
    if (gameType === FRENCH) {
        ships.push(shipCreator(5)); // the ships unique to french var
    }
    ships.push(shipCreator(4)); // the ships that are overlapping with both variations
    ships.push(shipCreator(3));
    ships.push(shipCreator(3));
    ships.push(shipCreator(2));

    if (gameType === RUSSIAN) { // the ships unique to russian var
        ships.push(shipCreator(2));
        ships.push(shipCreator(2));
        for (let i = 0; i < 4; i++) {
            ships.push(shipCreator(1));
        }
    }
    return ships;
}