class InfoScreen extends Container {
    constructor(Pokemon, ...args) {
        super(...args);
        if(Pokemon) {
            this.Pokemon = Pokemon;
            this.name = `Name: ${formatText(this.Pokemon.name)}`;
            this.ability = `Ability: ${formatText(this.Pokemon.ability)}`;
            this.statStr = this.Pokemon.getStatInfo();
            this.moveStr = this.Pokemon.getMoveInfo();
        };

        this.margin = this.canvas.width/40;
    };

    refresh() {
        this.createContainer();
    };

    createInfoScreen() {
        const {margin, canvas, ability, moveStr, statStr, name} = this;
        const textOptions = {
            font: 'Arial',
            size: this.canvas.width/64,
            color: '#333'
        };
        
        this.nameText = new Text(canvas, 'right', margin, name, textOptions);
        this.nameText.draw();
        
        // Image centered between the name and the move and stat data
        let imageWidth = canvas.height/2/2;
        let imageHeight = imageWidth;
        let generatedTextY = canvas.height-canvas.height/10;
        let imageY = margin + (generatedTextY - margin)/2 - imageHeight;
        this.Pokemon.drawImage(canvas.width/2 + canvas.width/2/2 - imageWidth/2, imageY, imageWidth, imageHeight);

        this.generateText([ability, ...moveStr], canvas.width/2 + margin, generatedTextY, textOptions, 'left');
        this.generateText(statStr, canvas.width - margin, generatedTextY, textOptions, 'right');
    };

    generateText(textArr, x, y, textOptions, direction="left") {
        // We are getting the maxWidth in order to align the object to the left or right of the container without it overflowing
        let maxWidth = Number.NEGATIVE_INFINITY;
        let maxHeight = 0;
        this.generatedText = [];

        textArr.forEach((str, index) => {
            let yCalc = (index * this.margin + y);
            let textObj = new Text(this.canvas, x, yCalc, str, textOptions);
            // Get the height and the width of the current Text class and afterwards subtract it from the current position
            let textWidth = textObj.getWidth();
            let textHeight = textObj.getHeight();
            maxHeight += textHeight;
            if(textWidth > maxWidth) maxWidth = textWidth;
            this.generatedText.push(textObj);
        });

        this.generatedText.forEach(textObj => {
            if(direction === 'right') textObj.setPosition(textObj.x - maxWidth);
            textObj.setPosition(textObj.x, textObj.y - maxHeight*2);
            textObj.draw();
        });
    };
};