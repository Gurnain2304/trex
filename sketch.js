var PLAY = 1;
var END = 0;
var gameState = PLAY;



var trex, trex_running;

var ground, groundImage, invisibleground;

var cloud, cloudImage, cloudsGroup ;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup ;

var score = 0;

var gameOver, gameOverImg, restart, restartImg;

var jumpSound, dieSound, checkPointSound;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
groundImage = loadImage("ground2.png");
  trex_collided = loadImage("trex_collided.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  //create trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  
  
  
  
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50;
  
  //create ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  
  
  //create invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create obstacle and cloud Group
  obstaclesGroup = new Group();
  cloudsGroup = new Group(); 
  

  //trex.debug = true;
  trex.setCollider("circle",0,0,40);
  
  //for game over
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  //for restart
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  
 
}

function draw() {
  background(180);
  
  //adding score to the game
  text("score:" + score, 500,50);
  
  
  if (gameState == PLAY){
    // move the ground
    ground.velocityX = -6;
    
    //update the score
    score = score + Math.round(frameCount/100);
    
    if (score>0 && score%1000 == 0){
      checkPointSound.play();
    }
    
    //reseting the ground
    if(ground.x < 0){
    ground.x = ground.width/2;
  }
    //jump and gravity 
  if(keyDown("space") && trex.y > 120){
    trex.velocityY = -10;
    jumpSound.play();
  }
  
  //adding gravity to trex
  trex.velocityY = trex.velocityY + 0.5;
    
     
  //Spawn The Clouds
  spawnClouds();
  
  //Spawn Obstacles
  spawnObstacles();
  
    
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();
      gameState = END
    }
    gameOver.visible = false;
  restart.visible = false;
  } 
  else if (gameState == END){
    //stop the ground 
    ground.velocityX = 0;
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.velocityY = 0;
    
    //set lifetime to negative
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  if (mousePressedOver(restart)){
    reset();
  }
    
    gameOver.visible = true;
  restart.visible = true;
  }
  
  
  
  trex.collide(invisibleGround);
  
 
  
  drawSprites();
}

function spawnClouds(){
  //code to spawn clouds
  if (frameCount %80 == 0){
    cloud = createSprite(600,100,40,10);
    cloud.velocityX = -3;
    cloud.scale = 0.4;
    cloud.y = Math.round(random(40,90));
    cloud.addImage(cloudImage);
    
    //assigning lifetime to clouds 
    cloud.lifetime = 200;
    
    //adjust the depth of trex
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group 
    cloudsGroup.add(cloud);
    
  }
}
function  spawnObstacles(){
  if(frameCount % 80 == 0 ){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = ground.velocityX;
    
    //generate random number 
    var rand = Math.round(random(1,6));
    switch (rand){
      case 1:obstacle.addImage(obstacle1);
        break;
      case 2:obstacle.addImage(obstacle2);
        break;
      case 3:obstacle.addImage(obstacle3);
        break;
      case 4:obstacle.addImage(obstacle4);
        break;
      case 5:obstacle.addImage(obstacle5);
        break;
      case 6:obstacle.addImage(obstacle6);
        break;
        default:break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
     
    //add each obstacle to the group 
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  score = 0;
}