$(function(){
    // Création d'une grille 8x8
    const map = new Map(8, 8)    
    // Envoie les informations du joueur à afficher a la fonction showInfoCharacter dans grid.js
    $('#select-player1').change(function(){
        showInfoCharacter('1')
    })
    $('#select-player2').change(function(){
    showInfoCharacter('2')
    })
    // Le bouton begin devient actif lorsque l'utilisateur aura choisi deux personnages
    $('.select-player').change(function(e){
        if ($('#select-player1').val() != 'null' && $('#select-player2').val() != 'null') {
            $('.button-start').removeAttr("disabled")     
        } else {
            $('.button-start').attr("disabled", "disabled")            
        }
    })
    $('#startToPlay')[0].play()
    // Gère l'évènement du bouton start cliqué par l'utilisateur: Démarrage de la partie
    $('.button-start').click(function(){
        // Ajout des joueurs en premiers
        map.addPlayer($('#select-player1').val(), $('#select-player2').val())
        // Ajout des blocks
        map.addBlock(10)
         // Ajoute les pouvoirs
        map.addPower('PowerMushroom', 20)
        map.addPower('PowerEgg', 35)
        map.addPower('PowerPlant', 25)
        map.addPower('PowerStar', 30)
        // Supprime la possibilité de choisir les personnages
        $('select').remove()
        // Supprime la possibilité de recliquer sur commencer
        $('.button-start').remove()
        // Lecture des audios
        $('#mainMusic')[0].play()
        // Affichage des éléments dans la grille      
        displayElts(map)
        // Démarrage du jeu
        const game = new ManagGame()
        // Gestion des déplacements   
        move(map, game)
    })
    // Gestion de l'audio
    $('#audio').click(function(){
        if ($('#audio').attr('src') === '../pictures/speaker.png') {
            $('#audio').attr('src', '../pictures/mute.png')
            $('.son').prop('muted', true) // Mute les sons du jeu
        } else {
            $('#audio').attr('src', '../pictures/speaker.png')
            $('.son').prop('muted', false) // Mute les sons du jeu          
        }
    })
})