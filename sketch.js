//Global Variables
var scene, jungle;
var player, monkey;
var banana, bananaImg, obstacle, rock, bananas, obstaclesGroup;
var ground;
var score = 0;
var play = 0;
var risk = 1;
var end = 2;
var gameState = play;


function preload(){
  //scene image
  jungle = loadImage("jungle.jpg");
  
  //player image
  monkey = loadAnimation("Monkey_01.png","Monkey_02.png","Monkey_03.png","Monkey_04.png","Monkey_05.png","Monkey_06.png","Monkey_07.png","Monkey_08.png","Monkey_09.png","Monkey_10.png");
  
  //food image
  bananaImg = loadImage("Banana.png");
  
  //obstacle image
  rock = loadImage("stone.png");
}


function setup() {
  createCanvas(600,300);
  
  //background loading image and movement
  scene = createSprite(0,50);
  scene.addImage("jungle",jungle);
  scene.x=scene.width/2;
  scene.velocityX=-3;
  
  //player image
  player = createSprite(200,250);
  player.addAnimation("monkey",monkey);
  player.scale=0.1;
  
  //invisible ground
  ground = createSprite(300,280,600,10);
  ground.visible=false;
  
  //food and obstacles group
  bananas = new Group();
  obstaclesGroup = new Group();
}


function draw(){
  background(225);
  
  if (gameState==play) {
    //infinite scene
    if (scene.x<100) {
      scene.x=scene.width/2;
    }
    
    //monkey's jump
    if (keyDown("space")&&player.y>220) {
      player.velocityY=-15;
    }
    //gravity for monkey
    player.velocityY=player.velocityY+0.7;

    //spawns bananas
    spawnFood();

    //spawns obstacles
    spawnObstacles();

    //scoring
    if (bananas.isTouching(player)) {
      score = score+2;
      bananas.destroyEach();
    }
    
    //makes monkey larger as it eats bananas
    scaleChange();
    
    //makes monkey smaller when it hits a rock, and loses a point
    if (obstaclesGroup.isTouching(player)) {
      player.scale=0.1;
      score = score-1;
      obstaclesGroup.destroyEach();
      gameState=risk;
    }
  } else if (gameState==risk) {
      //infinite scene
      if (scene.x<100) {
        scene.x=scene.width/2;
      }

      //monkey's jump
      if (keyDown("space")&&player.y>220) {
        player.velocityY=-15;
      }
      //gravity for monkey
      player.velocityY=player.velocityY+0.7;

      //spawns bananas
      spawnFood();

      //spawns obstacles
      spawnObstacles();

      //scoring
      if (bananas.isTouching(player)) {
        score = score+2;
        bananas.destroyEach();
        gameState=play;
      }

      //makes monkey larger as it eats bananas
      scaleChange();

      //makes monkey smaller when it hits a rock, and loses a point
      if (obstaclesGroup.isTouching(player)) {
        player.scale=0.1;
        score = score-1;
        gameState=end;
      }
    } else if (gameState==end) {
      scene.velocityX=0;
      bananas.destroyEach();
      obstaclesGroup.setLifetimeEach(-1);
      obstaclesGroup.setVelocityXEach(0);
    }
  //stops monkey from falling
  player.collide(ground);
  console.log(gameState);
  drawSprites();

  //displays score
  showScore();
  
  //shows risk warning and game over text
  instructions();
}

function spawnFood(){
  if (frameCount%100==0) {
    banana = createSprite(620,150);
    banana.addImage("food", bananaImg);
    banana.scale=0.05;
    banana.y=random(120,200);
    banana.velocityX=-5;
    banana.lifetime=200;
    banana.setCollider("rectangle",0,0,1000,500);
    bananas.add(banana);
  }
}

function spawnObstacles() {
  if (frameCount%140==0) {
    obstacle = createSprite(620,250);
    obstacle.addImage("obstacle",rock);
    obstacle.scale=0.15;
    obstacle.velocityX=-5;
    obstacle.lifetime=200;
    obstacle.setCollider("circle",0,0,190);
    obstaclesGroup.add(obstacle);
  }
}

function showScore() {
  stroke("white");
  fill("white");
  textSize(20);
  text("Score: "+ score, 260,50);
}

function scaleChange() {
  switch (score) {
    case 10: player.scale = 0.12;
            break;
    case 20: player.scale = 0.14;
            break;
    case 30: player.scale = 0.16;
            break;
    case 40: player.scale = 0.18;
            break;
      default: break;
  }
}

function instructions() {
  stroke("white");
  fill("white");
  textSize(20);
  if (gameState==risk) {
    text("You're at risk! If you hit one more rock, then game over.", 50,80);
    text("Eat a banana, then you're out of risk.",135,100);
  }
  if (gameState==end) {
    text("Game Over", 250,80);
  }
}