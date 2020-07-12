class Text {
    constructor(canvas, x, y, str, params) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.params = params;
        this.str = str;
        this.x = x;
        this.y = y;
    };

    draw() {
        const {size, font, color, textAlign} = this.params;
        const {str, ctx} = this;
        ctx.fillStyle = `${color}`;
        ctx.textAlign = textAlign ? textAlign : 'left';
        ctx.font = `${size}px ${font}`;
        if(this.x === 'left' || this.x === 'center' || this.x === 'right') {
            this.x = this.center();
        };

        ctx.fillText(str, this.x, this.y);
    };

    getWidth() {
        const {str, ctx} = this;
        const {size, font} = this.params;
        // Resetting the font size is necessary in order to get an accurate representation of the current width
        this.ctx.font = `${size}px ${font}`;
        let strMeasurements = ctx.measureText(str);
        return strMeasurements.width;
    };

    getHeight() {
        const {str, ctx} = this;
        const {size, font} = this.params;
        // Resetting the font size is necessary in order to get an accurate representation of the current height
        this.ctx.font = `${size}px ${font}`;
        let strMeasurements = ctx.measureText(str);
        return strMeasurements.actualBoundingBoxAscent;
    };

    setPosition(x, y=this.y) {
        this.x = x;
        this.y = y;
    };

    center() {
        const {x, canvas} = this;

        if(x === 'left') {
            return (canvas.width/2) - (canvas.width/2/2) - this.getWidth()/2;
        } else if (x === 'right') {
            return (canvas.width/2) + (canvas.width/2/2) - this.getWidth()/2;
        } else if (x === 'center') {
            return (canvas.width/2) - this.getWidth()/2;
        };
    };
};