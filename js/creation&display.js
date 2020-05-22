// <---------------------------------------------- Classes ---------------------------------------------->
// Classe Map
class Map {
    constructor(nbBoxX, nbBoxY) {
        this.boxX = nbBoxX
        this.boxY = nbBoxY
        this.grid = []
        this.build()
    }
    // Création du tableau (grille de jeu) - Directement
    build () {
        this.grid = []
        for (let x = 0; x < this.boxX; x++) {
            const rows = []
            for (let y = 0; y < this.boxY; y++) {
                rows.push({
                    img: '',
                    type: 'empty',
                    name: '',
                    x: x,
                    y: y,
                    nbX: this.boxX,
                    nbY: this.boxY,
                    colored: false,
                    powerDropped: false
                })
            }
            this.grid.push(rows)
        }
    }
    // Ajout des joueurs dans la grille
    addPlayer (player1, player2) {
        this.player1 = new Character(player1)
        this.player2 = new Character(player2)
        // Appelle à la fonction qui va éviter que les joueurs apparaissent côte à côte
        randomPlayer(this.player1, this.player2)
        // Ajoute dans la grille les informations des personnages
        displayPlayer(this.player1, this)
        displayPlayer(this.player2, this)
    }
    // Ajout des blocks dans la grille
    addBlock (nbBlocks) {
        while (nbBlocks > 0) {
            let randomX = Math.floor(Math.random()*7)
            let randomY = Math.floor(Math.random()*7)
            let eltGrid = this.grid[randomX][randomY]
            if (eltGrid.type === 'empty') {
                    eltGrid.img = '../pictures/Block.png'                    
                    eltGrid.type = 'block'
                    eltGrid.name = 'block'
                    nbBlocks -= 1
            }
        }        
    }
    // Ajout des pouvoirs dans la grille
    addPower (nameOfPower, damage) {
        this.power = new Power(nameOfPower, damage) // Création du pouvoir demandé grâce au nom et aux dégats renseignés par l'utilisateur
        let isPlaced = false
        while (isPlaced === false) { // Tant que le programme n'a pas trouvé une case vide pour placer le pouvoir la boucle redémarre
            let randomX = Math.floor(Math.random()*7)
            let randomY = Math.floor(Math.random()*7)
            let eltGrid = this.grid[randomX][randomY] 
            if (eltGrid.type === 'empty') {
                this.grid[randomX][randomY].img = this.power.img                    
                this.grid[randomX][randomY].type = this.power.type
                this.grid[randomX][randomY].name = this.power.name
                this.grid[randomX][randomY].damage = this.power.damage
                isPlaced = true
            }   
        }

    }
}

// Classe personnage
class Character {
    constructor(name) {
        this.logo = `../pictures/${name}Logo.png`
        this.img = `../pictures/${name}PowerInitialPlayer.png`
        this.name = name
        this.health = 150
        this.power = new Power('PowerInitialPlayer', 10)
        this.type = 'player'
        this.isShield = false
        this.x = Math.floor(Math.random()*7)
        this.y = Math.floor(Math.random()*7)
    }
    //-- Rajouter ici les méthodes attaquer et defendre lors de la gestion des combats
    attack(opponent, damage, opponentLifeId, opponentBlocId) {
        $('#attackPower')[0].play()
        let reduceLife = parseInt($(opponentBlocId).css('width')) - damage      
        // Si le joueur adverse à activer une protection réduit les dégats du pouvoir du joueur actuel par 2
        opponent.health -= damage
        // Réduit la barre et le nombre de vie du joueur 1
        $(opponentLifeId).text(opponent.health)
        $(opponentBlocId).css('width', reduceLife + 'px')
    }
}

// Classe Pouvoir
class Power {
    constructor(name, damage) {
        this.name = name
        this.img = `../pictures/${name}.png` 
        this.type = 'power' 
        this.damage = damage
    }
}

// Créer une classe pour gérer les éléments autour de la map
class ManagGame {
    constructor() {
        this.playerMove = Math.floor(Math.random()*2)+1
    }
    random () {
        if (this.playerMove === 1) {
            return true
        } else {
            return false           
        }
    }
    switch (switchPlayer) {
       if (switchPlayer === false) {
            return true
       } else {
           return false
       }
    }
}

// <---------------------------------------------- Fonctions ---------------------------------------------->

// Fonction qui gère l'affichage des informations des joueurs dans les box
function showInfoCharacter(nb) {
    // Vide les informations potientiellement présentent dans les box
    $(`#name-player${nb}`).text('')
    $(`#name-player${nb} + img`).remove()
    $(`#bloc-player${nb}`).css('background-color', 'white')
    // Affiche les informations du joueur  sélectionné dans une des box
    if($(`#select-player${nb}`).val() === 'Mario') {
        $(`#name-player${nb}`).text('Mario')
        $('<img src="../pictures/MarioLogo.png" alt="mario_logo">').insertAfter(`#name-player${nb}`)
        $(`#bloc-player${nb}`).css('background-color', 'red')
    } else if ($(`#select-player${nb}`).val() === 'Luigi') {
        $(`#name-player${nb}`).text('Luigi')
        $('<img src="../pictures/LuigiLogo.png" alt="luigi_logo">').insertAfter(`#name-player${nb}`)
        $(`#bloc-player${nb}`).css('background-color', 'green')
    }    
}
// Fonction appelé par la méthode addPlayer
function randomPlayer (player1, player2) {
    // Condition X - Eviter que les joueurs apparaissent côte à côte
    if (player1.x > player2.x) { // Evite de tomber dans le négatif en ayant par ex: 1-6 
        if (player1.x-player2.x === 1) {
            if (player1.x > 6) player2.x -= 1  // Evite de dépasser 7
            else if (player2.x <= 1) player1.x += 1  // Evite de dépasser 0 
            else player1.x += 1
        }
    } else if (player1.x < player2.x) { // Evite de tomber dans le négatif en ayant par ex: 1-6
        if (player2.x-player1.x === 1) {
            if (player2.x > 6) player1.x -= 1  // Evite de dépasser 7
            else if (player1.x <= 1) player2.x += 1  // Evite de dépasser 0
            else player2.x += 1                     
        }
    } else {
        if (player1.x > 5) player1.x -= 2  // Evite de dépasser 7
        else if (player1.x <= 1) player1.x += 2  // Evite de dépasser 0 
        else player1.x += 2 
    }
    // Condition Y - Eviter que les joueurs apparaissent côte à côte
    if (player1.y > player2.y) {
    if (player1.y-player2.y === 1) { // Evite de tomber dans le négatif en ayant par ex: 1-6
        if (player1.y > 6) player2.y -= 1  // Evite de dépasser 7
        else if (player2.y <= 1) player1.y += 1  // Evite de dépasser 0 
        else player1.y += 1
    }
    } else if (player1.y < player2.y) { // Evite de tomber dans le négatif en ayant par ex: 1-6
    if (player2.y-player1.y === 1) {
        if (player2.y > 6) player1.y -= 1  // Evite de dépasser 7
        else if (player1.y <= 1) player2.y += 1  // Evite de dépasser 0
        else player2.y += 1                     
    }
    } else {
        if (player1.y > 5) player1.y -= 2  // Evite de dépasser 7
        else if (player1.y <= 1) player1.y += 2  // Evite de dépasser 0 
        else player1.y += 2 
    }
    
}
//Affichage de tous les éléments de la grille
function displayElts (map) {
    for (let i = 0; i < map.grid.length; i++) {
        $('.grid-map').append('<tr class="rows-map">')
        for (let n = 0; n < map.grid.length; n++) {
            if (map.grid[i][n].type === 'block' || map.grid[i][n].type === 'power' || map.grid[i][n].type === 'player') {
                $(`tr:last`).append(`<td id=${i}-${n} class="box"><img src = "${map.grid[i][n].img}" alt = "${map.grid[i][n].name}"></td>`)
            } else {
                $(`tr:last`).append(`<td id=${i}-${n} class="box"></td>`)                
            }
        }
    }
}
// Ajoute dans la grille les informations des personnages après déplacement
function displayPlayer(player, map) {
     map.grid[player.x][player.y].img = player.img   
     map.grid[player.x][player.y].type = player.type
     map.grid[player.x][player.y].name = player.name 
 }

