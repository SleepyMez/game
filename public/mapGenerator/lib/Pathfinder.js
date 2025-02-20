import FloofMap from "./FloofMap.js";

export default class Pathfinder {
    /**
     * @param {FloofMap} maze The maze to pathfind
     */
    constructor(maze) {
        this.maze = maze;
        this.grid = [];
    }

    reset() {
        for (let y = 0; y < this.maze.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.maze.width; x++) {
                this.grid[y][x] = this.maze.at(x, y).type;
            }
        }
    }

    heuristicCostEstimate(x, y, x2, y2) {
        return Math.abs(x - x2) + Math.abs(y - y2);
    }

    findPath(x1, y1, x2, y2) {
        this.reset();

        const openSet = [];
        const closedSet = [];
        const startNode = { x: x1, y: y1, g: 0, h: this.heuristicCostEstimate(x1, y1, x2, y2), parent: null };
        openSet.push(startNode);

        while (openSet.length > 0) {
            let current = openSet[0];
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].g + openSet[i].h < current.g + current.h) {
                    current = openSet[i];
                }
            }

            if (current.x === x2 && current.y === y2) {
                let path = [];
                while (current.parent) {
                    path.push([current.x, current.y]);
                    current = current.parent;
                }
                return path.reverse();
            }

            openSet.splice(openSet.indexOf(current), 1);
            closedSet.push(current);

            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (closedSet.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    continue;
                }

                const tentativeGScore = current.g + 1;
                let newPath = false;

                if (!openSet.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    openSet.push(neighbor);
                    newPath = true;
                } else if (tentativeGScore < neighbor.g) {
                    newPath = true;
                }

                if (newPath) {
                    neighbor.parent = current;
                    neighbor.g = tentativeGScore;
                    neighbor.h = this.heuristicCostEstimate(neighbor.x, neighbor.y, x2, y2);
                }
            }
        }

        return []; // No path found
    }

    getNeighbors(node) {
        const neighbors = [];
        const { x, y } = node;

        if (x > 0 && this.grid[y][x - 1] !== 0) {
            neighbors.push({ x: x - 1, y: y, g: 0, h: 0, parent: null });
        }

        if (x < this.maze.width - 1 && this.grid[y][x + 1] !== 0) {
            neighbors.push({ x: x + 1, y: y, g: 0, h: 0, parent: null });
        }

        if (y > 0 && this.grid[y - 1][x] !== 0) {
            neighbors.push({ x: x, y: y - 1, g: 0, h: 0, parent: null });
        }

        if (y < this.maze.height - 1 && this.grid[y + 1][x] !== 0) {
            neighbors.push({ x: x, y: y + 1, g: 0, h: 0, parent: null });
        }

        return neighbors;
    }
}
