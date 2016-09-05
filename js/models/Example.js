'use strict';
if (typeof Models === 'undefined') var Models = {};

Models.Example = function(params)
{
	var nVars = Object.keys(this.vars).length;
	for(var i = 0; i < nVars; i++)
	{
		var key = Object.keys(this.vars)[i];
		this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
	}
}

Models.Example.prototype.vars = 
{
	g: 9.81,
	x: 0,
	dx: 0,
	slope: 1,
	F: 0,
	friction: 0,
	T: 0,
};

Models.Example.prototype.simulate = function (dt, controlFunc)
{
	var copy = new Models.Example(this);
	var state = [this.x, this.dx];
	copy.F = controlFunc(new Models.Example(this));
	copy.F = Math.max(-50,Math.min(50,copy.F));
	if(typeof copy.F != 'number' || isNaN(copy.F)) throw "Error: The controlFunction must return a number.";
	var soln = numeric.dopri(0,dt,state,function(t,x){ return Models.Example.ode(copy,x); },1e-4).at(dt);	
	
	copy.x = soln[0];
	copy.dx = soln[1];
	copy.T = this.T + dt;
	return copy;	
}

Models.Example.ode = function (_this, x)
{
	return[x[1],_this.F-Math.sin(_this.slope)*_this.g-_this.friction*x[1]];
}

Models.Example.prototype.drawBackground = function(canvasElement)
{
    // todo: clear canvas

    var rectCoords = [
        { x: 100, y: 100, height: 100, width: 200 },
        { x: 100, y: 400, height: 100, width: 200 },
    ];

    var canvas = d3.select(canvasElement)
      .append("svg:svg")
      .attr("width", 800)
      .attr("height", 600);

    var rects = canvas
        .selectAll("g")
        .data(rectCoords)
        .enter()
        .append("g");

    rects.append("rect")
        .attr("x", function(d) { return d.x } )
        .attr("y", function(d) { return d.y } )
        .attr("width", function (d) { return d.width } )
        .attr("height", function (d) { return d.height } );
}

Models.Example.prototype.draw = function(canvas)
{

}

Models.Example.prototype.infoText = function ()
{
	return  "/* Position        */ block.x  = " + round(this.x,2)
		+ "\n/* Velocity        */ block.dx = " + round(this.dx,2)
		+ "\n/* Simulation time */ block.T  = " + round(this.T,2);	
}
