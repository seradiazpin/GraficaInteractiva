
/*
*------------------------------------------------------------------------------
* Sergio Alejandro Diaz Pinilla - 1032458183
* Para la creacion del juego se uso Phaser una libreria de Java Script para
* la creacion de videojuegos.
* ------------------------------------------------------------------------------
*/

/*
* Vatiables globales que se usan en el juego.
* worldScale -> variable para el manejo del zoom.
* player -> variable para el jugador.
* bgGroup -> variable para guardar el fondo generado.
* viewRect -> Pantalla.
* boundsPoint -> limites.
* nObjects -> Objerivo inicializado en 5 por defecto.
* group-> grupo de frutas.
* cursors-> para poner el teclado.
* game -> para reiniciar el juego
* */

var worldScale = 1;
var player;
var bgGroup;
var viewRect;
var boundsPoint;
var nObjects = 5;
var group;
var cursors;
var game;

//Funcion que nos pide el numero de objetivos y inicia el objeto game de Phaser
function iniciarJuego() {
    nObjects = prompt("El numero de objetivos a buscar", 5);
    if (nObjects != null && nObjects<=30) {
        document.getElementById("demo").innerHTML =
            "Numero de objetivos "+ nObjects +"!";
        alert("Consigue el numero de chiles que pusiste!");
        /*
         * Para reiniciar el juego se hace la confirmacion de que no este ya creado
         * Si ya existe lo destrulle y lo crea de nuevo.
         * */

        if(game != null){
            game.destroy();
            game = new Phaser.Game(window.innerWidth-110, 500, Phaser.AUTO, 'dogSpace', { preload: preload, create: create, update: update, render: render });
        }else{
            game = new Phaser.Game(window.innerWidth-110, 500, Phaser.AUTO, 'dogSpace', { preload: preload, create: create, update: update, render: render });
        }

    }else{
        alert("Pon un numero menor a 30!!!");
    }
}

/*
* Phaser usa tres funciones que tiene definidas en su Objeto Game
* preload() -> Se ejecuta de primeras, se usa normalmente para cargar los componentes del juego
* create() ->Se llama despues de preload, si no existe preload este es el primero, se usa para inicializar elementos.
* update() ->Se llama despues de create y se ejecuta como un loop por toda el tiempo de ejecucion
* render() ->Aunque casi todos los componentes se renderiza automaticamente, este se ejecuta al final.
* */

//Cargamos los assets que nesesitamos.
var preload = function(game) {
    game.time.advancedTiming = true;
    /*
     * Phaser permite cargar spritesheets que son varias imagenes en un mismo archivo.
     * Aca cargamos las verduras y el personaje con un tamano de 32X32
     * */
    game.load.spritesheet('ship', './assets/humstar.png', 32, 32);
    game.load.spritesheet('veggies', './assets/fruitnveg32wh37.png', 32, 32);
}

//Creamos  lo que nesesitamos para nuestro juego
var create = function(game) {
    //Usamos estas fisicas para las coliciones con los alimentos
	game.physics.startSystem(Phaser.Physics.P2JS);
    // Creamos un punto para mirar los limites
    boundsPoint = new Phaser.Point(0, 0);
    // Creamos la pantalla del juego
    viewRect = new Phaser.Rectangle(0, 0, game.width, game.height);
    
    // Creamos un grupo de objetos que se puedan sobreponer para el fondo
    bgGroup = game.add.group();
    
    // Creamos los cuadrados del mapa, sqr es un cuadrado, size es el tamano de los cuadrados estos son aleatorios.
    var sqr, size;
    for (var i = 0; i < 2500; i++) {
        //Tamano es aleatorio entre 5 y 20, se ubica en un lugar aleatorio y se agrega en el grupo de fondo.
        size = game.rnd.integerInRange(5, 20);
        sqr = game.add.graphics(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), bgGroup);
        sqr.beginFill(0x666666);
        sqr.drawRect(size * -0.5, size * -0.5, size, size); // Se centra el cuadrado
        sqr.endFill();
    }


    //Agrrgamos las caracteristicas de nuestro jugador
    player = game.add.sprite(-15, -15, 'ship');
    //Fisicas de coliciones al jugador
    game.physics.arcade.enable(player);
    player.smoothed = false;
    //Animaciones del spiresheet y le ponemos el nombre a esta
    player.animations.add('fly', [0,1,2,3,4,5], 10, true);
    player.play('fly');



    //Agregamos que el grupo tenga fisica.
    group = game.add.physicsGroup();


    //Creamos 70 objetos que son los que mataran al jugador son aleatorios, los sacamos de la spiresheer de los vegetales.
    for (var i = 0; i < 70; i++) {
        var c = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'veggies', game.rnd.between(0, 35));
        c.body.mass = -100;
    }
    //Creamos nObjects objetos que son los que busca el jugados, los sacamos de la spiresheer de los vegetales.
    for (var i = 0; i < nObjects; i++) {
        var c = group.create(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), 'veggies', 17);
    }

    //Para poder movernos con las flechas
    cursors = game.input.keyboard.createCursorKeys();

    // Tamaño del mundo, mas grande para poder movernos mejor la camara.
    game.world.setBounds(-1000, -1000, 3000, 3000);
    
    // Pone la camara en la mitad del mundo
    game.camera.x = (game.width * -0.5);
    game.camera.y = (game.height * -0.5);
}

//Lo que se ejecutara en un loop, el juego.
var update = function(game) {    
    //Movimiento de el jugador y el mapa.
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      game.world.pivot.y -= 5;  
      player.y -= 5;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      game.world.pivot.y += 5;    
      player.y += 5;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      game.world.pivot.x -= 5;
      player.x -= 5;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      game.world.pivot.x += 5;    
      player.x += 5;
    }
    
    // zoom
    if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
        worldScale += 0.05;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        worldScale -= 0.05;
    }
    
    // Recalculamos la escala del mundo en caso de que se colocara zoom.
    worldScale = Phaser.Math.clamp(worldScale, 0.25, 2);
    
    // Se rescala el mundo si es nesesario.
    game.world.scale.set(worldScale);


    bgGroup.forEachExists(function(circ) {
        boundsPoint.setTo(
            ((circ.x - game.world.pivot.x) * game.world.scale.x) + (game.width * 0.5),
            ((circ.y - game.world.pivot.y) * game.world.scale.y) + (game.height * 0.5)
        );
        if (Phaser.Rectangle.containsPoint(viewRect, boundsPoint)) {
            circ.visible = true;
        }
        else {
            circ.visible = false;
        }
    });
    //Miramos si hacemos colicion con el objetivo y hacemos un print.
    if (game.physics.arcade.collide(player, group, collisionHandler, processHandler, this)) {
        console.log('boom');
    }

}

//Esta funcion es para el manejo de coliciones entre los objetos
function collisionHandler (player, veg) {
    //Si se etrella con el 17 que es el objetivo disminuimos uno y actualizamos el objetivo
    if (veg.frame == 17)
    {
        veg.kill();
        nObjects--;
        if (nObjects != null) {
            document.getElementById("demo").innerHTML =
                "Numero de objetivos "+ nObjects +"!";
        }
        if(nObjects == 0){
            reload(1);
        }
    //En otro caso matamos al jugador
    }else{
        player.kill();
        reload(2);
    }
}

//Para que haga algo.
function processHandler (player, veg) {
    return true;
}

//Para renderizar una opcion de debugin que es el renderizado de los FPS del juego en color verde
var render = function(game) {
  game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");    
}

//Funcion para recargar la pagina al perder o al morir
function reload(status) {
    if(status == 1) {
        window.location.assign("game.html");
        alert("Toda los objetos an sido recuperado as ganado");
    }else{
        //window.location.assign("../../index.html");
        window.location="game.html";
        alert("As muerto por consumo de alimentos no picantes, te faltaron"+nObjects+" Chiles");
    }
}

