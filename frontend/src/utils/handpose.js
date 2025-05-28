export const colorOptions = [
    { name: 'Black', color: '#000000' },
    { name: 'Pink', color: '#ffc0cb' },
    { name: 'Red', color: '#FF0000' },
    { name: 'Yellow', color: '#FFFF00' },
    { name: 'Blue', color: '#0000FF' },
    { name: 'Green', color: '#00FF00' },
    { name: 'Purple', color: '#800080' },
    { name: 'Cyan', color: '#00FFFF' },
    { name: 'Orange', color: '#FFA500' }
];

export const sizeOptions = [
    { name: 'Small', size: 4 },
    { name: 'Medium', size: 8 },
    { name: 'Large', size: 12 }
];

export const calculateDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const isHandOpen = (landmarks) => {
    if (!landmarks) return false;
    
    const wrist = landmarks[0];
    const fingerTips = [8, 12, 16, 20]; 
    
    let totalDistance = 0;
    for (const tipIdx of fingerTips) {
        const tip = landmarks[tipIdx];
        totalDistance += calculateDistance(wrist, tip);
    }
    
    const avgDistance = totalDistance / fingerTips.length;
    return avgDistance > 120;
};

export const drawHandLandmarks = (ctx, landmarks, handType) => {
    if (!landmarks) return;


    const connections = [
        // Thumb
        [0, 1], [1, 2], [2, 3], [3, 4],
        // Index finger
        [0, 5], [5, 6], [6, 7], [7, 8],
        // Middle finger
        [0, 9], [9, 10], [10, 11], [11, 12],
        // Ring finger
        [0, 13], [13, 14], [14, 15], [15, 16],
        // Pinky
        [0, 17], [17, 18], [18, 19], [19, 20],
        // Palm
        [0, 5], [5, 9], [9, 13], [13, 17]
    ];
    
    ctx.strokeStyle = handType === 'right' ? 'white' : 'lightblue';
    ctx.lineWidth = 2;
    

    for (const [i, j] of connections) {
        const from = landmarks[i];
        const to = landmarks[j];
        
        if (from && to) {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }
    }
    
    for (let i = 0; i < landmarks.length; i++) {
        const keypoint = landmarks[i];
        

        let pointColor = handType === 'right' ? 'blue' : 'cyan';
        let pointSize = 4;
        
        if (i === 4) { // Thumb tip
            pointColor = handType === 'right' ? 'red' : 'pink';
            pointSize = 6;
        } else if (i === 8) { // Index tip
            pointColor = handType === 'right' ? 'green' : 'lightgreen';
            pointSize = 6;
        }
        
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, pointSize, 0, 2 * Math.PI);
        ctx.fillStyle = pointColor;
        ctx.fill();
    }
};

export const drawMenu = (ctx, menuItems, menuHoverItem, drawColor, lineWidth, canvasWidth, canvasHeight) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    menuItems.forEach(item => {
        const isHovered = (item === menuHoverItem);
        
        ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(item.x, item.y, item.width, item.height);
        
        ctx.strokeStyle = isHovered ? 'white' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.strokeRect(item.x, item.y, item.width, item.height);
        
        if (item.type === 'color') {
            ctx.fillStyle = item.value;
            ctx.fillRect(item.x + 5, item.y + 5, item.width - 10, item.height - 20);
            
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.name, item.x + item.width / 2, item.y + item.height - 5);
            
            if (item.value === drawColor) {
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 2;
                ctx.strokeRect(item.x + 3, item.y + 3, item.width - 6, item.height - 6);
            }
        } else if (item.type === 'size') {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = item.value;
            ctx.beginPath();
            ctx.moveTo(item.x + 10, item.y + item.height / 2);
            ctx.lineTo(item.x + item.width - 10, item.y + item.height / 2);
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.name, item.x + item.width / 2, item.y + item.height - 5);
            
            if (item.value === lineWidth) {
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 2;
                ctx.strokeRect(item.x + 3, item.y + 3, item.width - 6, item.height - 6);
            }
        } else {
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.name, item.x + item.width / 2, item.y + item.height / 2);
        }
    });
};

export const checkMenuHover = (x, y, menuItems) => {
    for (const item of menuItems) {
        if (x >= item.x && x <= item.x + item.width &&
            y >= item.y && y <= item.y + item.height) {
            return item;
        }
    }
    return null;
};


export const createMenuItems = (canvasWidth, canvasHeight) => {
    const menuItems = [];
    const startX = canvasWidth * 0.5 - 150; 
    const startY = canvasHeight * 0.25;
    
    colorOptions.forEach((color, index) => {
        menuItems.push({
            x: startX + (index % 3) * 80,
            y: startY + Math.floor(index / 3) * 50,
            width: 60,
            height: 40,
            type: 'color',
            name: color.name,
            value: color.color,
            action: (setColor) => setColor(color.color)
        });
    });
    
    sizeOptions.forEach((size, index) => {
        menuItems.push({
            x: startX + index * 80,
            y: startY + 200,
            width: 60,
            height: 40,
            type: 'size',
            name: size.name,
            value: size.size,
            action: (setLineWidth) => setLineWidth(size.size)
        });
    });
    
    menuItems.push({
        x: startX + 240,
        y: startY + 200,
        width: 80,
        height: 40,
        type: 'action',
        name: 'Clear All',
        action: (clearCanvas) => clearCanvas()
    });
    
    return menuItems;
};
