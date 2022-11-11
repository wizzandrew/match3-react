import * as _ from 'lodash'

export type Generator<T> = { next(): T } 

export function CyclicGenerator<String>(sequence: string) { 
    function next():string {
        const rand = Math.floor(Math.random() * sequence.length);
        return sequence.charAt(rand);
    }

    return { next }
} 

export type Position = Readonly<{
    row: number,
    col: number
}>

export type Match<T> = Readonly<{
    matched: T,
    positions: Position[]
}>

export type Board<T> = Readonly<{
    tiles: Array<Array<T>>;
    width: number;
    height: number;
    matchAfterMove: Match<T>[];
    matchAfterRefill: Match<T>[];
}>

export type MatchEffect<T> = Readonly<{
    kind: string;
    match?: Match<T>;
}>

export type RefillEffect<T> = Readonly<{
    kind: string;
    board?: Board<T>;
}>

export type Effect<T> = MatchEffect<T> & RefillEffect<T>;

export type MoveResult<T> = Readonly<{
    board: Board<T>,
    effects: Effect<T>[]
}    >

export type CanMoveAxis<T> = Readonly<{
    canMove: boolean,
    matches?: Match<T>[]
}>

export type CanMove<T> = Readonly<{
    canMove: boolean,
    board?: Board<T>
}>

export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
    if(generator && width && height) {
        
        // create empty array of length "height"
        const tiles = new Array(height);

        // insert into each index new array of length "width"
        for(let i:number=0; i<tiles.length; i++) tiles[i] = new Array(width);

        for(let i:number=0; i<tiles.length; i++) {
            for(let j:number=0; j<tiles[i].length; j++) {
                tiles[i][j] = generator.next();
            }
        }

        return {
            tiles: tiles,
            width: width,
            height: height,
            matchAfterMove: undefined,
            matchAfterRefill: undefined
        }

    }

    return undefined;
}    

export function piece<T>(board: Board<T>, p: Position): T | undefined {
    if(board && p) {
        // if row value of the p is invalid => undefined
        if(p.row < 0 || p.row > board.tiles.length - 1) return undefined;

        // if col value of the p is invalid => undefined
        if(p.col < 0 || p.col > board.tiles[p.row].length - 1) return undefined;

        // otherwise return
        return board.tiles[p.row][p.col];
    }
}    

export function canMove<T>(board: Board<T>, first: Position, second: Position): CanMove<T> {
    
    if(board && first && second) {
        //moves on different rows and columns are invalid
        if(first.row != second.row && first.col != second.col) return {canMove: false}

        //build tile1 with updated position
        const tile1 = {
            piece: piece(board, first),
            position: second
        }

        //build tile2 with updated position
        const tile2 = {
            piece: piece(board, second),
            position: first
        }

        // check if positions are valid
        if(tile1.piece === undefined || tile2.piece === undefined) return {canMove: false}

        //copy board
        let _board = copyBoard(board);

        // swap tiles
        const swappedTiles = swapTwoTiles(first, second, _board.tiles);

        //tile checkup
        //update poperty for matches
        _board = {
            tiles: _board.tiles,
            width: _board.width,
            height: _board.height,
            matchAfterMove: new Array(),
            matchAfterRefill: _board.matchAfterRefill
        }
        
        //loop twice(for each tile)
        for(let index:number = 0; index<2; index++) {

            //make value of service match default    
            let match:Match<T>;
            let currentTile;

            if(index == 0) {
                match = {matched:tile1.piece, positions: []};
                currentTile = tile1;
            }
            else if(index == 1) {
                match = {matched:tile2.piece, positions: []};
                currentTile = tile2;
            }


            //horizontal checkup--------------------------------------

            const moveHorizontally = canMoveHorizontally(swappedTiles, currentTile, match, _board.matchAfterMove);
            if(moveHorizontally.canMove) {

                _board = {
                    tiles: _board.tiles,
                    width: _board.width,
                    height: _board.height,
                    matchAfterMove: moveHorizontally.matches,
                    matchAfterRefill: _board.matchAfterRefill
                }
            }

            //horizontal checkup--------------------------------------

            //make value of service match default 
            match = {matched: match.matched, positions: []}


            //vertical chekup-----------------------------------------

            const moveVertically =  canMoveVertically(swappedTiles, currentTile, match, _board.matchAfterMove);
            if(moveVertically.canMove) {
                _board = {
                    tiles: _board.tiles,
                    width: _board.width,
                    height: _board.height,
                    matchAfterMove: moveVertically.matches,
                    matchAfterRefill: _board.matchAfterRefill
                }
            }

            //vertical chekup-----------------------------------------
        }

        return {
            canMove: _board.matchAfterMove.length > 0,
            board: _board
        }
    }
}

export function canMoveHorizontally<T>(tiles: T[][], currentTile: any, match: Match<T>, boardMatches: Match<T>[]): CanMoveAxis<T> {

    //copy variables
    let _match: Match<T> = copyMatchArray([match])[0];
    let _boardMatches: Match<T>[] = copyMatchArray(boardMatches);


    for(let i:number = 0; i<tiles[0].length; i++) {
                
        if(tiles[currentTile.position.row][i] === currentTile.piece) {

            const p = {
                row: currentTile.position.row,
                col: i
            }

            // push position of matched tile
            _match.positions.push(p);
        }
        else _match = {matched: _match.matched, positions: []}


        // check if there are 3 matches(positions)
        if(_match.positions.length === 3 ) { 

            // make sure to include 1 match only once
            if(_boardMatches.filter(m => m.matched === _match.matched && _.isEqual(m.positions, _match.positions)).length == 0) {
                _boardMatches.push({matched: _match.matched, positions: _match.positions});
            }

            return {
                canMove: true,
                matches: _boardMatches
            }
        }
    }

    return {
        canMove: false
    }
}

export function canMoveVertically<T>(tiles: T[][], currentTile: any, match: Match<T>, boardMatches: Match<T>[]): CanMoveAxis<T> {

    //copy variables
    let _match: Match<T> = copyMatchArray([match])[0];
    let _boardMatches: Match<T>[] = copyMatchArray(boardMatches);

    for(let i:number = 0; i<tiles.length; i++) {

        if(tiles[i][currentTile.position.col] === currentTile.piece) {

            const p = {
                row: i,
                col: currentTile.position.col
            }

            // push position of matched tile    
            _match.positions.push(p);
        }
        else _match = {matched: _match.matched, positions: []}


        // check if there are 3 matches(positions)
        if(_match.positions.length === 3) {
            
            // make sure to include 1 match only once
            if(_boardMatches.filter(m => m.matched === _match.matched && _.isEqual(m.positions, _match.positions)).length == 0) {
                _boardMatches.push({matched: _match.matched, positions: _match.positions});
            }

            return {
                canMove: true,
                matches: _boardMatches
            }
        }
    }

    return {
        canMove: false
    }
}

export function canMoveAfterRefill<T>(board: Board<T>, pieces:Array<T>, tiles:Array<Position>): CanMove<T> {

    //copy board
    let _board = copyBoard(board);

    //upd global state
    _board = {
        tiles: _board.tiles,
        width: _board.width,
        height: _board.height,
        matchAfterMove: _board.matchAfterMove,
        matchAfterRefill: new Array()
    }
    
    //construct necessery _tiles obj
    let _tiles = [];
    for(let i:number = 0; i<tiles.length; i++) {
        _tiles.push({
            piece: pieces[i],
            position: tiles[i]
        });
    } 

    //tile checkup
    _tiles.forEach(element => {

    //make value of service match default    
    let match:Match<T>  = {matched: element.piece, positions: []};

    //horizontal checkup--------------------------------------

    const moveHorizontally = canMoveHorizontally(_board.tiles, element, match, _board.matchAfterRefill);
    if(moveHorizontally.canMove) {
        _board = {
            tiles: _board.tiles,
            width: _board.width,
            height: _board.height,
            matchAfterMove: _board.matchAfterMove,
            matchAfterRefill: moveHorizontally.matches
        }
    }

    //horizontal checkup--------------------------------------


    //make value of service match default    
    match = {matched: element.piece, positions: []};
    
    //vertical chekup-----------------------------------------

    const moveVertically = canMoveVertically(_board.tiles, element, match, _board.matchAfterRefill);
    if(moveVertically.canMove) {
        _board = {
            tiles: _board.tiles,
            width: _board.width,
            height: _board.height,
            matchAfterMove: _board.matchAfterMove,
            matchAfterRefill: moveVertically.matches
        }
    }       

    //vertical chekup-----------------------------------------

    });

    return {
        canMove: _board.matchAfterRefill.length > 0,
        board: _board
    }

} 

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
    
    if(generator && board && first && second) {

        const _canMove = canMove(board, first, second);
        if(_canMove.canMove) {

            //use resulted board
            let _board = _canMove.board;

            //arr to store all matches regarding the move
            let positions: Position[] = new Array<Position>();
            //arr to store 'events'
            let effects: Effect<T>[] = new Array<Effect<T>>();

            //swap tiles on the board
            _board = {
                tiles: swapTwoTiles(first, second, _board.tiles),
                width: _board.width,
                height: _board.height,
                matchAfterMove: _board.matchAfterMove,
                matchAfterRefill: _board.matchAfterRefill
            }

            
            //fill up positions of 'match' tiles
            //fill up effects
            _board.matchAfterMove.forEach(element => {
                positions.push(...element.positions);
                effects.push({
                    kind: 'Match',
                    match: element
                });
            })

            //replace tiles
            let __tiles = replaceTiles(_board, generator, positions);
            _board = __tiles.board;

            //fill up effects
            effects.push({
                kind: 'Refill',
                board: _board
            });


            // canMoveAfterRefill property for while (condition == true)
            let _canMoveAfterRefill = canMoveAfterRefill(_board, __tiles.pieces, __tiles.pos)

            //!!!!
            //check "cascading" effect of refill
            while(_canMoveAfterRefill.canMove ) {
                //fill up positions of 'match' tiles
                //fill up effects

                //use resulted board
                _board = _canMoveAfterRefill.board;

                //reset properties
                let positions: Position[] = new Array<Position>();

                _board.matchAfterRefill.forEach(element => {
                    positions.push(...element.positions);
                    effects.push({
                        kind: 'Match',
                        match: element
                    });
                })


                //replace tiles
                __tiles = replaceTiles(_board, generator, positions);
                _board = __tiles.board;

                 //fill up effects
                effects.push({
                    kind: 'Refill',
                    board: __tiles.board
                });

                //update _canMoveAfterRefill property
                _canMoveAfterRefill = canMoveAfterRefill(_board, __tiles.pieces, __tiles.pos)

            }

            return {
                board:__tiles.board,
                effects: effects
            }
            
        }
    }

    // cannot move -> return provided board
    return {
        board: board,
        effects: []
    }
}

export function swapTwoTiles<T>(first: Position, second: Position, tiles: Array<Array<T>>): Array<Array<T>> {

    //copy tiles
    const _tiles = copyTwoDimensionalArray(tiles);

    //store tile1 value
    const tile1 = _tiles[first.row][first.col];

    //assign tile1 tile2's value
    _tiles[first.row][first.col] = _tiles[second.row][second.col];

    //assign tile2 old value of tile1 
    _tiles[second.row][second.col] = tile1;

    return _tiles;
}

export function copyBoard<T>(board: Board<T>): Board<T> {
    return {
        ...board,
        tiles: copyTwoDimensionalArray(board.tiles),
        matchAfterMove: copyMatchArray(board.matchAfterMove),
        matchAfterRefill: copyMatchArray(board.matchAfterRefill)
    }
}

export function copyTwoDimensionalArray<T>(arr: Array<Array<T>>) : Array<Array<T>> {
    const newArr: T[][] = [];

    if(arr && Array.isArray(arr)) {
        arr.map(val => {
            newArr.push([...val])
        });
    }
    
    return newArr;
}

export function copyMatchArray<T>(matches: Match<T>[]): Match<T>[] {
    const newArr: Match<T>[] = [];
    
    if(matches && Array.isArray(matches)) {
        matches.map(match => {
            newArr.push({
                matched: match.matched,
                positions: match.positions.map(position => {
                    return {
                        row: position.row,
                        col: position.col
                    }
                })
            })
        })
    } 
    return newArr;
}

export function replaceTiles<T>(board: Board<T>, generator: Generator<T>, positions: Position[]): any {

    //copy board
    let _board: Board<T> = copyBoard(board);

    //mark matched tiles "undefined"
    positions.forEach(position => {
        _board.tiles[position.row][position.col] = undefined;
    });

    //shift tiles
    for(let i:number =0; i<_board.tiles.length; i++) {
        for(let j:number =0; j<_board.tiles[i].length; j++) {
            if(_board.tiles[i][j] === undefined) {
                _board = {
                    tiles: shiftTilesRecurcisvely(_board.tiles,i,j),
                    width: _board.width,
                    height: _board.height,
                    matchAfterMove: _board.matchAfterMove,
                    matchAfterRefill: _board.matchAfterRefill
                }
            }
        }
    }

    
    //replace tiles with newly generated values
    //store pieces and positions of newly "refilled tiles"
    let pieces: Array<T> = [];
    let pos: Position[] = [];

    for(let i:number =0; i<_board.tiles.length; i++) {
        for(let j:number =0; j<_board.tiles[i].length; j++) {
            if(_board.tiles[i][j] === undefined) {
                _board.tiles[i][j] = generator.next();

                //store piece and position of newly "refilled tile"
                pieces.push(piece(_board, {row:i, col:j}));
                pos.push({row:i, col:j});
            }
        }
    }

    return {
        board: _board,
        pieces: pieces,
        pos: pos
    };
}

export function shiftTilesRecurcisvely<T>(arr: Array<Array<T>>, row: number, col: number): Array<Array<T>> {

    //copy arr
    let _arr = copyTwoDimensionalArray(arr);

    if(row > 0) {
        _arr[row][col] = _arr[row-1][col];
        _arr = shiftTilesRecurcisvely(_arr, row-1, col);
    }
    else if(row === 0) {
        _arr[row][col] = undefined;
    }

    return _arr;
}

export function toString<T>(board: Board<T>): string {

    let str = '';

    for(let i:number=0; i<board.height; i++) {
        for(let j:number=0; j<board.width; j++) {
            str+= piece(board, {row: i, col: j}) + ' ';
        }
        str+= ('\n');
    }

    return str;
}
