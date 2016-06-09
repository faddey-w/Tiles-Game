// I'm not a js pro,
// but my aim is to show the idea,
// not to make technically perfect thing.


function Game(options) {

    // parse game parameters and check them for correctness
    num_tiles = options.num_tiles || 16;
    num_types = options.num_types || 4;
    if (num_tiles % num_types) {
        throw "num_tiles should be divisible by num_types!";
    }
    if (num_tiles / num_types % 2) {
        throw "Must be even number of tiles for each type!";
    }
    // setup callbacks that allows to inform users about game events:
    on_showhide = options.on_showhide || function() {};
    on_remove = options.on_remove || function() {};
    on_gameover = options.on_gameover || function() {};
    on_mistake = options.on_mistake || function() {};

    // init game's current state
    // note that none of this fields should be touched by user code
    // all the interaction with Game instance is done
    // via pick() method, some inspector methods and callbacks
    // in fact, user code only inspects the tiles array to display which tiles are shown.
    this.tiles = [];
    this.removed_count = 0;
    this.former_tile_id = null;

    // fill the array of tiles and shuffle it
    for(var i = 0; i < num_tiles; i++) {
        this.tiles.push({
            type: Math.floor(i % num_types),
            shown: false,
            removed: false
        });
    }
    shuffle(this.tiles);

    // put game logic into one place
    // and make it abstract from used technology
    this.pick = function(tile_id) {
        if (this.is_over()) {
            throw "The game is already over";
        }

        if (this.former_tile_id === null) {
            this.former_tile_id = tile_id;
            this.tiles[tile_id].shown = true;
            on_showhide(tile_id, true);
        } else {
            var former_tile = this.tiles[this.former_tile_id],
                this_tile = this.tiles[tile_id];

            if (tile_id == this.former_tile_id) {
                // if the same tile was picked, unpick it
                former_tile.shown = false;
                on_showhide(this.former_tile_id, false);
            }

            if (former_tile.type == this_tile.type) {
                // tiles has the same type - remove both
                this_tile.removed = former_tile.removed = true;
                this.removed_count += 2;
                on_remove(tile_id, this.former_tile);
                if (this.is_over()) {
                    on_gameover();
                }
            } else {
                // tiles are of different type - mistake
                former_tile.shown = false;
                on_showhide(this.former_tile_id, false);
                on_mistake(tile_id, this.former_tile_id);
            }
            this.former_tile_id = null;
        }
    }
    this.is_over = function() {
        return this.removed_count == num_tiles;
    }

    // Shuffles an array in-place.
    // Source: http://stackoverflow.com/a/12646864
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}

