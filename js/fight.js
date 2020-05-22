function fighting(map, game) {
    let isTrue = false
    let isPlayer1 = game.random()
    // Afin d'éviter les hors de portées
    // !!!! Essayer une function anynome directement dans une variable !!!!!
    if (map.player1.x+1 <= 7) {
        if (map.grid[map.player1.x+1][map.player1.y].type === 'player') {
            isTrue = true
        }
    }
    if (map.player1.x-1 >= 0) {
        if (map.grid[map.player1.x-1][map.player1.y].type === 'player') {
            isTrue = true
        }
    }
    if (map.player1.y+1 <= 7) {
        if (map.grid[map.player1.x][map.player1.y+1].type === 'player') {
            isTrue = true
        }
    }
    if (map.player1.y-1 >= 0) {
        if (map.grid[map.player1.x][map.player1.y-1].type === 'player') {
            isTrue = true
        }
    }
    //Si une des conditions du dessus est vérifiée
    if (isTrue === true) {
        // Arrête la musique principale
        $('#mainMusic')[0].pause()
        // Charge l'audio des combats
        $('#battleMusic')[0].play()
        $('.box').off() // Empêche les joueurs de se déplacer (supprimer l'event clique)
        $('.box').css('background-color', 'rgba(189, 195, 199, ' + 0.0 + ')') // Supprime les couleurs autour des personnages
        // fonction anonyme qui se charge d'afficher les informations supplémentaires du joueur qui doit jouer
        var instruction = function() {
            if (isPlayer1 === true) {
                isPlayer1 = game.switch(isPlayer1) // Change de joueur 
                $('#button-player1').css("display", "block") // Fait apparaitre les boutons attaque et defense
                $('#button-player2').css("display", "none") // Fait apparaitre les boutons attaque et defense
                $('#arrow-one').css("display", "block")  // Affiche la flêche au dessus de la carte du joueur
                $('#arrow-two').css("display", "none")  // cache la flêche au dessus de la carte du joueur
                return false
            } else {
                isPlayer1 = game.switch(isPlayer1) // Change de joueur 
                $('#button-player2').css("display", "block") // Fait apparaitre les boutons attaque et defense
                $('#button-player1').css("display", "none") // Fait apparaitre les boutons attaque et defense
                $('#arrow-one').css("display", "none")
                $('#arrow-two').css("display", "block")
                return true
            }
        }
        // Appelle la fonction instruction lors de la première fois
        instruction()
        //Déclenche l'event du combat
        $('button').on('click', function(){
            if (instruction() === true) {
                if ($(this).attr('id') === 'attack-player1') {
                    managFight(map.player1, map.player2, $('#life-player2'), $('#bloc-player2'))
                } else if ($(this).attr('id') === 'defend-player1') {
                    map.player1.isShield = true
                    $('#defendPower')[0].play()
                }
            } else {
                if ($(this).attr('id') === 'attack-player2') {
                    managFight(map.player2, map.player1, $('#life-player1'), $('#bloc-player1'))
                } else if ($(this).attr('id') === 'defend-player2') {
                    map.player2.isShield = true
                    $('#defendPower')[0].play()
                }
            }
            if (map.player1.health <= 0) {
                displayFight(map.player1, map.player2, $('#life-player1'), $('#name-player1'), $('#name-player2'), $('#name-player1 + img'), $('#name-player2 + img'), map)
            }
            if (map.player2.health <= 0) {
                displayFight(map.player2, map.player1, $('#life-player2'), $('#name-player2'), $('#name-player1'), $('#name-player2 + img'), $('#name-player1 + img'),  map)              
            }   
        })
        // Recommencer une partie
        $('.button-restart').on('click', function(){
            location.reload()            
        })
    }  
}
// Gère l'attaque et la défense des joueurs pendant le combat
function managFight(playerFirstCall, playerSecondCall, opponentLifeId, opponentBlocId) {
    let damage
    if (playerSecondCall.isShield === true) { // Si le joueur adverse à activer une protection réduit les dégats du pouvoir du joueur actuel par 2
        damage = playerFirstCall.power.damage / 2
        playerSecondCall.isShield = false
    } else {
        damage = playerFirstCall.power.damage
    }
    playerFirstCall.attack(playerSecondCall, damage, opponentLifeId, opponentBlocId)
}
// Gère la fin du combat et evite de passer la vie d'un joueur dans le négatif
function displayFight(playerFirstCall, playerSecondCall, playerFirstCallLife, namePlayerFirstCall, namePlayerSecondCall, imgPlayerFirstCall, imgPlayerSecondCall, map) {
    playerFirstCall.health = 0
    playerFirstCallLife.text(0)
    // Change l'image du logo du joueur ayant perdu et celles représentant les joueurs dans la grille
    //Logo defaite
    imgPlayerFirstCall.remove()
    $(`<img src="../pictures/${playerFirstCall.name}LogoDefeat.png">`).insertAfter(namePlayerFirstCall)
    //Logo victoire
    imgPlayerSecondCall.remove()
    $(`<img src="../pictures/${playerSecondCall.name}LogoWinner.png">`).insertAfter(namePlayerSecondCall)
    playerFirstCall.img =  `../pictures/${playerFirstCall.name}Defeat.png`
    playerSecondCall.img = `../pictures/Victory${playerSecondCall.name}.png`
    map.grid[playerFirstCall.x][playerFirstCall.y].img = `../pictures/${playerFirstCall.name}Defeat.png`
    map.grid[playerSecondCall.x][playerSecondCall.y].img = `../pictures/Victory${playerSecondCall.name}.png`
    $(`#${playerFirstCall.x}-${playerFirstCall.y} img`).remove() // Si il y'a un pouvoir potentiellement présent supprime son image
    $(`#${playerFirstCall.x}-${playerFirstCall.y}`).append(`<img src = "${map.grid[playerFirstCall.x][playerFirstCall.y].img}" alt = "${map.grid[playerFirstCall.x][playerFirstCall.y].name}">`)
    $(`#${playerSecondCall.x}-${playerSecondCall.y} img`).remove() // Si il y'a un pouvoir potentiellement présent supprime son image
    $(`#${playerSecondCall.x}-${playerSecondCall.y}`).append(`<img src = "${map.grid[playerSecondCall.x][playerSecondCall.y].img}" alt = "${map.grid[playerSecondCall.x][playerSecondCall.y].name}">`)                                    
    $('.button').css("display", "none") // Cache les boutons attaque et defense
    $('#arrow-one').remove() // Cache les boutons attaque et defense
    $('#arrow-two').remove() // Cache les boutons attaque et defense
    $('.button-restart').css("display", "block") // Fait apparaitre le bouton recommencer
    $('#victory')[0].play()
    $('#battleMusic')[0].pause()            
}