(function(){
    const $canvas = document.querySelector('.canvas');
    const $clearAction = document.querySelector('.clear-action');
    const $chatForm = document.querySelector('.chat-form');
    const $chatList = document.querySelector('.message-container');
    const context = $canvas.getContext('2d');
    const socket = io()
    let dots = [];

    $clearAction.addEventListener('click', e =>{
        e.preventDefault()

        dots = []
        socket.emit('clear')
    })

    const drawPoint = (x, y, clicked) => {
        dots.push({x, y, clicked})
    }

    const reDraw = (x, y) => {
        context.clearRect(0,0, $canvas.width, $canvas.height);
        if(dots.length < 2) return requestAnimationFrame(reDraw);

        dots.forEach(({x,y, clicked}, index) => {
            if(!clicked || !index) return;
            const { x: previousX, y: previousY} = dots[index - 1]
            context.strokeStyle = "purple";
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.beginPath();
            context.moveTo(previousX, previousY)
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        })
        requestAnimationFrame(reDraw)
    }
    requestAnimationFrame(reDraw)

    $canvas.addEventListener('mousemove', e=>{
        //if(e.buttons !==1) return;
        
        
        const{ top, left} = $canvas.getBoundingClientRect();
        const y = e.pageY - top
        const x = e.pageX - left
        const clicked = e.buttons === 1

        socket.emit('draw', { x, y, clicked})
        drawPoint(x,y, clicked)
       
    })

    fetch('/points')
        .then(res => res.json())
        .then(points=> points.forEach(({x, y, clicked}) => drawPoint(x,y, clicked)))

    socket.on('chat', ({message}) => {
        const newMessage = document.createElement('li')
        newMessage.innerText = message
        $chatList.appendChild(newMessage)
    })
    
    $chatForm.addEventListener('submit', e => {
        e.preventDefault()
        const currentValue = document.querySelector('[name=message]').value;
        const currentNick = document.querySelector('[name=nick]').value;
        if(currentValue === '') return;
    
        socket.emit('chat', { message: `${currentNick}: ${currentValue}` })
    
    })

})()