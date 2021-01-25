const exampe_ship = {
    name: `examplery name`,
    length: `number between 1-5`,
    ship_parts: [], // contains all the parts of the ship, see below example of it
    direction: random_boolean() ? VERTICAL : HORIZONTAL,// string representing the direction of the ship
    is_sunk: false //boolean representing if the ship is sunk
}

const exampe_ship_part = {
    ship_index: `index of the containing ship object in the ships array`,
    x: `vertical index between 0-9`,
    y: `horizontal index between 0-9`,
    is_hit: false, // boolean representing wheather the part was hit
    value: SHIP_PART //used for view components
}

const example_sea_object = {
    x: `vertical index on the board`,
    y: `horizontal index on the board`,
    value: SEA, //used for view components
    around_ship: false // boolean used to represent if the square is around a ship - so no ships will be placed in its place
}

const example_sea_object_MISS = {
    x: `vertical index on the board`,
    y: `horizontal index on the board`,
    value: MISS, //used for view components, represents the fact this square was shot at
    around_ship: false //left over from the sea object
}

const example_sea_object_AROUND_SINK = {
    x: `vertical index on the board`,
    y: `horizontal index on the board`,
    value: AROUND_SINK, //used for view components, represents the fact this square is diagonal from a hit or around a sunken ship
    around_ship: false //left over from the sea object
}
