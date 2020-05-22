function move(map, game) {
    // Création des flêches sur la tête des joueurs
    $('body').prepend('<img id="arrow-two" src="../pictures/arrow_down.png" alt="arrow_down">')   
    $('body').prepend('<img id="arrow-one" src="../pictures/arrow_down.png" alt="arrow_down">')
    // Anime les flèches au dessus des cartes des joueurs
    arrowAnimation()      
    // Choisi qui commencera aléatoirement
    let isPlayer1 = game.random()
    if (isPlayer1) {
        displayColorBox(map.player1, map)
        $('#arrow-one').css("display", "block")
    } else {
        displayColorBox(map.player2, map)
        $('#arrow-two').css("display", "block")      
    }
    // Lorsque l'utilisateur va cliquer sur une case
    $('.box').on('click', function(){
        // Converti l'id de la box cliqué afin de regarder dans le tableau à quelle index elle correspond
        let idBox = $(this).attr('id')         
        let x = parseInt(idBox[0], 10)
        let y = parseInt(idBox[2], 10) 
        if (map.grid[x][y].colored) { // Oblige l'utilisateur à cliquer sur une box colorée pour déplacer son joueur
            if (isPlayer1) {
                displayInfoPlayer(map, map.player1, x, y, isPlayer1) // change d'endroit les informations du personnage à déplacer
                displayColorBox(map.player2, map) // Colore les box du joueur adverse 
                $('#arrow-one').css("display", "none")
                $('#arrow-two').css("display", "block")
                isPlayer1 = game.switch(isPlayer1) // Change de joueur        
            } else {    
                displayInfoPlayer(map, map.player2, x, y, isPlayer1)                
                displayColorBox(map.player1, map)  // Colore les box du joueur adverse
                $('#arrow-one').css("display", "block")
                $('#arrow-two').css("display", "none")
                isPlayer1 = game.switch(isPlayer1) // Change de joueur 
            }
            // Gestion du combat
            fighting(map, game)           
        }      
    })
}

function displayInfoPlayer (map, player, x, y, isPlayer1) {
    // // Son au déplacement du joueur
    // if (player.name === 'Mario') {
    //     $('#displacementMario')[0].play()
    // } else {
    //     $('#displacementLuigi')[0].play()                  
    // }  
    $(`#${player.x}-${player.y} img`).remove() // Supprime l'image du personnage dans la box où il était
    map.grid[player.x][player.y].img = ''   // Supprime les informations du personnage dans la box où il était            
    map.grid[player.x][player.y].name = ''  // Supprime les informations du personnage dans la box où il était
    map.grid[player.x][player.y].type = ''  // Supprime les informations du personnage dans la box où il était 
    let oldX = player.x             
    let oldY = player.y           
    // Enregistre le pouvoir d'un des joueurs
    if (isPlayer1) {       
        var oldPower = stateModule.getPower1()
    } else {                       
        var oldPower = stateModule.getPower2()
    }
    // Vérifie si le joueur a échangé de pouvoir au précédent tour et si c'est le cas replace son ancien pouvoir dans la grille
    if(map.grid[oldX][oldY].powerDropped) {
        map.grid[oldX][oldY].img = oldPower.img
        map.grid[oldX][oldY].type = oldPower.type                     
        map.grid[oldX][oldY].name = oldPower.name
        $(`#${oldX}-${oldY}`).append(`<img src = "${map.grid[oldX][oldY].img}" alt = "${map.grid[oldX][oldY].name}">`)
    }   
    player.x = x // Nouvelle coordonnée x
    player.y = y // Nouvelle coordonnée y
    playerTransformation(player, map, isPlayer1) // Gère la transformation des joueurs après avoir obtenu un pouvoir    
    displayPlayer(player, map) // Affiche les éléments qui ont été déplacés
    $(`#${player.x}-${player.y} img`).remove() // Si il y'a un pouvoir potentiellement présent supprime son image
    $(`#${player.x}-${player.y}`).append(`<img src = "${map.grid[x][y].img}" alt = "${map.grid[x][y].name}">`)
    $('.box').css('background-color', 'rgba(189, 195, 199, ' + 0.0 + ')')             
}

function displayColorBox(player, map) {
    // reinitialise les couleurs dans la grille à false
    for (let x = 0; x < map.grid.length; x++) {
        for (let y = 0; y < map.grid.length; y++) {
            map.grid[x][y].colored = false
        }
    }
    const nbDisplacementMax = 3
    //affichage déplacement
    //Coloration du fond du personnage entre Mario et Luigi
    if (player.name === 'Mario') {
        $(`#${player.x}-${player.y}`).css('background-color', 'rgba(217, 30, 24, 1)')        
    } else {
        $(`#${player.x}-${player.y}`).css('background-color', 'rgba(46, 204, 113, 1)')          
    }
    //Colorisation du fond des cases où l'ont peut se déplacer
    for (let i = 1; i <= nbDisplacementMax; i++) {
        if (player.x-i >= 0) { // Up
            if (map.grid[player.x-i][player.y].type != 'block' && map.grid[player.x-i][player.y].type != 'player') {
                map.grid[player.x-i][player.y].colored = true
                $(`#${player.x-i}-${player.y}`).css('background-color', 'rgba(171, 183, 183, 1)')                
            } else {          
            break
            } 
        }
    }
    for (let i = 1; i <= nbDisplacementMax; i++) {
        if (player.y-i >= 0) { // left
            if (map.grid[player.x][player.y-i].type != 'block' && map.grid[player.x][player.y-i].type != 'player') {
                map.grid[player.x][player.y-i].colored = true
                $(`#${player.x}-${player.y-i}`).css('background-color', 'rgba(171, 183, 183, 1)')                
            } else {          
            break
            } 
        }
    }
    for (let i = 1; i <= nbDisplacementMax; i++) {
        if (player.y+i < 8) { // right
            if (map.grid[player.x][player.y+i].type != 'block' && map.grid[player.x][player.y+i].type != 'player') {
                map.grid[player.x][player.y+i].colored = true
                $(`#${player.x}-${player.y+i}`).css('background-color', 'rgba(171, 183, 183, 1)')                
            } else {          
            break
            } 
        }
    }
    for (let i = 1; i <= nbDisplacementMax; i++) {
        if (player.x+i < 8) { // down
            if (map.grid[player.x+i][player.y].type != 'block' && map.grid[player.x+i][player.y].type != 'player') {
                map.grid[player.x+i][player.y].colored = true
                $(`#${player.x+i}-${player.y}`).css('background-color', 'rgba(171, 183, 183, 1)')                
            } else {          
            break
            } 
        }
    }
}


// Anime les flèches au dessus des cartes des joueurs
function arrowAnimation() {
    $('#arrow-one').animate({top: '+=4'})
                   .animate({top: '-=4'})
    $('#arrow-two').animate({top: '+=4'})
                   .animate({top: '-=4'})
}
setInterval(arrowAnimation, 1000)