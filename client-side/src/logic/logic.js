import { VERTICAL, HORIZONTAL, RUSSIAN, FRENCH, SEA, MISS, HIT, AROUND_SINK, SHIP_PART, AROUND_SHIP } from "../stateManager/stateManager";
const random = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
const random_boolean = () => Math.random() < 0.5;
//updates a square on the board after a ship part was hit or sunk
const update_board_square_around_sink = (board, x, y) => {
    const new_board = [...board];
    if (x >= 0 && y >= 0 && x <= new_board.length-1 && y <= new_board.length-1) {//!= undefined
        if (new_board[x][y].value !== MISS && new_board[x][y].value !== SHIP_PART) { //we want to keep miss visual, also not to change a sunken ship to a aroung sink bc of how loop works
            new_board[x][y].value = AROUND_SINK;
        }
    }
    return new_board;
};
//updates a square as one that is on the border of a ship, for placement purposes
const update_board_square_around_ship = (board, x, y) => {
    const new_board = [...board];
    if (x >= 0 && y >= 0 && x <= new_board.length-1 && y <= new_board.length-1) {//!= undefined
        if (new_board[x][y].value !== SHIP_PART) { //making sure we aren't changing the value of a ship part to be an around ship bc of how loop works
            new_board[x][y].around_ship = true;
        }
    }
    return new_board;
}
//used to update all the squares around a ship for placement and sinking
const update_board_around_a_ship = (board, ship, new_value) => {
    let new_board = [...board];
    const updater = (x, y) => {// used to update the relevant value in the same line, since both need to be around the entire ship
        if (new_value === AROUND_SINK) {//when ship is sunk
            new_board = update_board_square_around_sink(board, x, y);
        }
        else if (new_value === AROUND_SHIP) {//when ship is placed so no ships will be placed 1 square around it
            new_board = update_board_square_around_ship(board, x, y);
        }
    }
    const startX = ship.ship_parts[0].x - 1;// using the diagonal top left and bootom right squares to the ship
    const startY = ship.ship_parts[0].y - 1;// allows to iterate over all the surounding squares of a ship
    const endX = ship.ship_parts[ship.length - 1].x + 1;
    const endY = ship.ship_parts[ship.length - 1].y + 1;
    for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
            updater(i, j);// iteration over all surounding squares
        }
    }
    return new_board
}
// used when a turn is used to attack to get the result of the attack attempt
export const inspect_hit = (board, x, y) => {
    if (board[x][y].value === SHIP_PART) {
        return HIT;
    }
    return MISS;
}
// activated when inspect_hit's result is HIT
export const update_board_hit = (x, y, ship_index, board, ships) => {
    let new_ships = [...ships];
    let new_board = [...board];
    const part_index = new_ships[ship_index].ship_parts.findIndex((part) => part.x === x && part.y === y);
    new_ships[ship_index].ship_parts[part_index].is_hit = true; // updating the ship part in the ships array as hit
    new_board[x][y].is_hit = true; // updating the ship part on the board as hit

    const is_ship_sunk = new_ships[ship_index].ship_parts.every((ship_part) => ship_part.is_hit);//checking if all parts of the ship are hit

    if (is_ship_sunk) {
        new_ships[ship_index].is_sunk = is_ship_sunk; // updating the ship in the ships array as sunk
        new_board = update_board_around_a_ship(new_board, new_ships[ship_index], AROUND_SINK); // updating the board around the ship as sunk
    }
    const is_win = new_ships.every((ship) => ship.is_sunk); // checking if all ships are sunk

    for (let loopX = (x - 1); loopX <= x + 1; loopX++) {
        for (let loopY = (y - 1); loopY <= y + 1; loopY++) {
            if ((loopX + loopY) % 2 === (x + y) % 2) {      // this condition allows us to adress only squares diagonal to the square in [x][y]
                new_board = update_board_square_around_sink(new_board, (loopX), (loopY)); // updating diagonal squares to not reveal the ship's direction
            }
        }
    }
    return { board: new_board, ships: new_ships, is_win };
}
//used when inspect_hit's result is MISS
export const update_board_miss = (board, x, y) => {
    const new_board = [...board];
    new_board[x][y].value = MISS;
    return new_board;
}
// used at the start of the game to place the ships of the board randomly.
export const place_ships = (board, ships) => {
    let new_board = [...board];
    let new_ships = [...ships];
    new_ships.forEach((ship, index_of_ship) => { // iterates over every ship until it is placed
        let needs_placing = true;
        const directional_adder = (limited, unlimited , num) => {// will be used to adress both vertical and horizontal facing ships in the same placement
            if (ship.direction === VERTICAL) {
                return {ship_part_x: limited + num ,ship_part_y: unlimited}
            }
            if (ship.direction === HORIZONTAL) {
                return { ship_part_x: unlimited, ship_part_y: limited + num}
            }
        }
        
        re_place_ship: while (needs_placing) { // looks for a place for the ship until it finds it
            let unlimited = random(9);              //generation of a random number not limited by the ships length
            let limited = random(9 - ship.length);  //generation of a random number limited by the ships length so as not to place a ship out of bounds

            for (let i = 0; i < ship.length; i++) { // iterates over the generated place for the ship to check if its viable
                let {ship_part_x} = directional_adder(limited, unlimited, i);// activation of the adder that adds a value to the direction that we need to iterate over
                let {ship_part_y} = directional_adder(limited, unlimited, i);
                if (new_board[ship_part_x][ship_part_y].around_ship !== false) {
                    continue re_place_ship; // if is not viable, restarts the while loop and finds othe random spot on board
                }
            }            
            for (let i = 0; i < ship.length; i++) { // actualy placing the ship
                let {ship_part_x} = directional_adder(limited, unlimited, i);
                let {ship_part_y} = directional_adder(limited, unlimited, i);
                const new_ship_part = {
                    ship_index: index_of_ship,
                    x: ship_part_x,
                    y: ship_part_y,
                    is_hit: false,
                    value: SHIP_PART
                }
                ship.ship_parts.push(new_ship_part); // updating the ships array
                new_board[ship_part_x][ship_part_y] = new_ship_part; // updating the board
            }            
            new_board = update_board_around_a_ship(new_board, ship, AROUND_SHIP); // updating around the ship to not place other ships there
            needs_placing = false;
        }
    });

    return { board: new_board, ships: new_ships };
}
// creates an empty board for placement
export const initial_game_board = (board = [[], [], [], [], [], [], [], [], [], []]) => {
    const new_board = [...board]
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            new_board[j].push({
                x: j,
                y: i,
                value: SEA,
                around_ship: false
            })
        }
    }
    return new_board;
}
// creates the ships structure without any parts in it
export const initial_ships = (game_type = RUSSIAN) => {
    const ship_names = ['S10', 'S9', 'S8', 'S7', 'S6', 'S5', 'S4', 'S3', 'S2', 'S1'];//names of the ships in reverse order of giving them
    const ships = [];//the soon to be returned ships array
    const make_ship = (length, name = ship_names.pop()) => { // default name is the last object of the mane array
        return {
            name,
            length,
            ship_parts: [],
            direction: random_boolean() ? VERTICAL : HORIZONTAL,
            is_sunk: false
        }
    }
    if (game_type === FRENCH) {
        ships.push(make_ship(5)); // the ships unique to french var
    }
    ships.push(make_ship(4)); // the ships that are overlapping with both variations
    ships.push(make_ship(3));
    ships.push(make_ship(3));
    ships.push(make_ship(2));

    if (game_type === RUSSIAN) { // the ships unique to russian var
        ships.push(make_ship(2));
        ships.push(make_ship(2));
        for (let i = 0; i < 4; i++) {
            ships.push(make_ship(1));
        }
    }
    return ships;
}