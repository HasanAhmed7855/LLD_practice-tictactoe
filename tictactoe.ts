import { stdin, stdout } from 'process'
import readline from 'readline/promises'

const rl = readline.createInterface(stdin, stdout)

class Player {
    name: string
    symbol: string

    constructor(name: string, symbol: string) {
        this.name = name
        this.symbol = symbol
    }

    validatePlayerInput(coordinates: number[]) {
        coordinates
    }

    async takeTurn(grid: Grid) {
        let isValidPlacement = false

        while (!isValidPlacement) {
            const playerInput = await rl.question(`What coordinate do you want to place your '${this.symbol}' symbol at? `)
            const coordinates = playerInput.split(',').map((item) => parseInt(item))

            /* IMPORTANT:
            - CURRENT ITERATION OF THIS PROGRAM WILL ASSUME THAT THE PLAYER HAS INPUTTED THE CORRECT COORDINATE FORMAT
            - DONT BELIEVE ITS WORTH THE INVESTMENT AT THIS STAGE OF THE PROGRAM TO ALLOCATE TIME TO THIS
            - MAY CONSIDER IT FOR FUTURE REVISIONS
            */

            if (grid.isValidPlacement(coordinates)) {
                isValidPlacement = true

                grid.placeSymbol(this.symbol, coordinates)
                grid.showGrid()
            }
        }
    }
}

// HARDCODED TO BE 3X3 GRID ALWAYS
// EXPAND ON OTHER ITERATIONS
class Grid {
    grid: Array<Array<string>> = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]
    availableGridPositions: number

    constructor() {
        this.availableGridPositions = this.calculateAvailableGridPositions()
    }

    showGrid() {
        console.log(this.grid)
    }

    calculateAvailableGridPositions() {
        return this.grid.flat().filter((cell) => cell === '').length
    }

    isValidPlacement(coordinates: number[]) {
        const [row, col] = coordinates

        if (row < 0 || col < 0 ||
            row >= this.grid.length ||
            col >= this.grid[0].length ||
            this.grid[row][col] != '') {
                return false
        }

        return true
    }

    placeSymbol(symbol: string, coordinates: number[]) {
        const [row, col] = coordinates
        
        this.grid[row][col] = symbol
        console.log(`The symbol '${symbol}' was placed at cell ${row},${col}`)
    }

    // CURRENT checkWinner FUNCTION IS INEFFICIENT
    // RUNS AT n2 TIME COMPLEXITY - OPTIMISE WITH FUTURE REVISIONS
    checkWinner(symbol: string) {
        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [-1, -1],
            [1, 1],
            [-1, 1],
            [1, -1]

        ]

        function dfs(this: Grid, row: number, col: number, dRow: number, dCol: number, count: number) {
            if (count === 3) { return true }
            if (
                row < 0 || col < 0 ||
                row == this.grid.length || col == this.grid[0].length ||
                this.grid[row][col] !== symbol
            ) {
                return false
            }
            
            if (dfs.call(this, row + dRow, col + dCol, dRow, dCol, count + 1)) {
                return true
            }
        }

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                if (this.grid[row][col] === symbol) {
                    for (const [dRow, dCol] of directions) {
                        if (dfs.call(this, row + dRow, col + dCol, dRow, dCol, 1)) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }

}


class Game {
    grid: Grid
    player1: Player
    player2: Player

    constructor(grid: Grid, player1: Player, player2: Player) {
        this.grid = grid
        this.player1 = player1
        this.player2 = player2
    }
    
    async startGame() {
        let curPlayer = this.player1

        while (this.grid.calculateAvailableGridPositions() != 0) {
            await curPlayer.takeTurn(this.grid)
            const isWinner = grid.checkWinner(curPlayer.symbol)

            if (isWinner) {
                console.log(`${curPlayer.name} has won the game! Thanks for playing!`)
                return
            }

            curPlayer = curPlayer == this.player1 ? this.player2 : this.player1
        }
        
        console.log("THE GAME IS DRAW! NO ONE WINS. THANKS FOR PLAYING!")
        return
    }
}


const player1 = new Player('Player1', 'X')
const player2 = new Player('Player2', 'O')

const grid = new Grid()
const game = new Game(grid, player1, player2)

game.startGame()

