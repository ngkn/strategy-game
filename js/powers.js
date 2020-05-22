function playerTransformation (player, map, isPlayer1) {
    if (isPlayer1 === true) {
        stateModule.changePower1(player.power) // Enregistre l'ancien pouvoir
    } else {
        stateModule.changePower2(player.power) // Enregistre l'ancien pouvoir       
    }
    // Si le joueur attéri sur une case contenant un pouvoir
    if (map.grid[player.x][player.y].type === 'power') {
        $('#takePower')[0].play()
        let namePower = map.grid[player.x][player.y].name // récupère le nom du pouvoir
        let damagePower = map.grid[player.x][player.y].damage // récupère les dégats du pouvoir
        map.grid[player.x][player.y].damage = player.power.damage  // Remplace les dégats du pouvoir actuel par les dégats du pouvoir drop
        player.img = `../pictures/${player.name}${namePower}.png`
        player.power = new Power(namePower, damagePower) // Ajoute le nouveau pouvoir au personnage
        map.grid[player.x][player.y].powerDropped = true
    } 
    // Met à jour l'affichage pouvoir dans la carte des joueurs
    if (isPlayer1 === true) {
        $(`#player1 .img-power img`).remove()
        $(`#player1 .img-power`).prepend(`<img src="${player.power.img}" alt="${player.power.name}" />`)
        $(`#player1 .power-damage`).text(`(${player.power.damage})`)          
    } else {
        $(`#player2 .img-power img`).remove()
        $(`#player2 .img-power`).prepend(`<img src="${player.power.img}" alt="${player.power.name}" />`)
        $(`#player2 .power-damage`).text(`(${player.power.damage})`)           
    }
}
// Evite les variables globales - Permet de stocker les précédents pouvoirs des joueurs
var stateModule = (function () {
    var power1 = {}
    var power2 = {} 

    var pub = {}
    pub.changePower1 = function (newstate) {
        power1 = newstate
    }
    pub.getPower1 = function() {
        return power1
    }
    pub.changePower2 = function (newstate) {
        power2 = newstate
    }
    pub.getPower2 = function() {
        return power2
    }
    return pub
}())