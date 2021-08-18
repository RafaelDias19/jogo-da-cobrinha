let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let score = 0
let direction = "right";
let pause = false;
let box = 32;
let snake = [{
    x: 8 * box,
    y: 8 * box
}];

let jogo

let food ={
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

function criarBG(){
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16*box, 16*box);
}

function criarCobrinha (){
    for(i = 0; i < snake.length; i++){
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood (){
    context.fillStyle = "brown";
    context.fillRect(food.x, food.y, box, box);
}

//quando um evento acontece, detecta e chama uma função
document.addEventListener('keydown', update);

function update(event){
    if(event.keyCode == 37 && direction != 'right') direction = 'left';
    if(event.keyCode == 38 && direction != 'down') direction = 'up';
    if(event.keyCode == 39 && direction != 'left') direction = 'right';
    if(event.keyCode == 40 && direction != 'up') direction = 'down';

    if(event.keyCode === 80){
        pauseGame()
    }

}

function atualizaCanvas(){    

    if(snake[0].x > 15*box && direction == "right") snake[0].x = 0;
    if(snake[0].x < 0 && direction == 'left') snake[0].x = 16 * box;
    if(snake[0].y > 15*box && direction == "down") snake[0].y = 0;
    if(snake[0].y < 0 && direction == 'up') snake[0].y = 16 * box;
    
    for(i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            gameOver()
        }
    }

    criarBG();
    criarCobrinha();
    drawFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction == "right") snakeX += box;
    if(direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if(direction == "down") snakeY += box;

    if(snakeX != food.x || snakeY != food.y){
        snake.pop(); //pop tira o último elemento da lista
    }else{
        score += 10
        food.x = Math.floor(Math.random() * 15 +1) * box;
        food.y = Math.floor(Math.random() * 15 +1) * box;
        $('.pontuacao-topo').html(score)
    }
    
    let newHead ={
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead); //método unshift adiciona como primeiro quadradinho da cobrinha
}

function iniciarJogo() {
    resetarJogo()
    jogo = setInterval(atualizaCanvas, 100);
}

function popUp(titulo, acao, classe = '', descricao = '') {
    $('.pop-up-titulo').html(titulo)
    $('.pop-up-descricao').html(descricao)
    $('.pop-up-botao').html(acao)
    $('.pop-up-botao').addClass(classe)
}

function navegacao(antigoLocal, novoLocal = '.tela-inicial') {
    $(antigoLocal).hide()
    $(novoLocal).css('display', 'flex')
}

function exibirTelaInicial() {
    navegacao('.tela-pontuacao')
}

function pauseGame() {
    if(!jogo) return
    if (pause) {
        jogo = setInterval(atualizaCanvas, 100);
        document.querySelector('.pop-up').style.display = 'none';

    }else{
        document.querySelector('.pop-up').style.display = 'flex';
        clearInterval(jogo);
    }
    pause = !pause
    popUp('Jogo pausado', 'Retomar jogo', 'btn-pause')

}

function exibirControles(params) {
    console.log('controles')
}

function exibirPontuacao(params) {
    $.ajax({
        url: "./score.jsona",
        success: function(result){
            let pontuacao = JSON.parse(result)
            pontuacao.sort(function(a, b){return b.pontuacao - a.pontuacao});
            $('.pontuacoes').html('')
            pontuacao.forEach(function (value, index) {
                $('.pontuacoes').append(`
                    <li><span class="nome">${value.nome}:</span> <span class="pontuacao">${value.pontuacao}</span></li>
                `)
            })
            $('.tela-inicial').hide()
            $('.tela-pontuacao').css('display', 'flex')
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    })
}

$(".pop-up-botao").on("click", function(e){
    let classes = e.target.className.split(' ')
    let classe = classes[classes.length - 1]
    switch (classe) {
        case 'btn-gameover':
            iniciarJogo()
            break;
        case 'btn-pause':
            pauseGame()
            break;
    
        default:
            break;
    }
});



function gameOver() {
    document.querySelector('.pop-up').style.display = 'flex';
    popUp('Game over', 'jogar novamente', 'btn-gameover', 'Sua pontuacao: ' + score)
    $('.pontuacao').html(score)
    clearInterval(jogo);
    jogo = undefined
}

function resetarJogo() {
    clearInterval(jogo);
    document.querySelector('.pop-up').style.display = 'none';
    document.querySelector('.tela-inicial').style.display = 'none';
    document.querySelector('.jogo').style.display = 'flex';
    score = 0
    snake = [{
        x: 8 * box,
        y: 8 * box
    }];
    food ={
        x: Math.floor(Math.random() * 15 + 1) * box,
        y: Math.floor(Math.random() * 15 + 1) * box
    }
}