'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.Example = function()
{
	this.name = "Example";
	this.title = "Example system";

	this.sampleSolution = "function controlFunction(block)\n{\n  // Idea: If the block is on the left (negative x)\n  // it should be pushed to the right (positive force),\n  // and vice versa. The farther away the block is from\n  // its target, the harder it should be pushed.\n  // This is called a 'proportional controller'.\n  \n  return -3*block.x;\n}";
	this.boilerPlateCode = "function controlFunction(block)\n{\n  return 5*Math.sin(10*block.T);\n}";
	this.description = "Push the block under the arrow (x=0) and make it stop there. Write a <u>JavaScript</u> function that calculates the horizontal force on the block necessary to achieve this.";
	this.model = new Models.Example({g: 0,x: -2,dx: 0,slope: 0,friction: 1});
}


Levels.Example.prototype.levelComplete = function()
{
	return false;
}

Levels.Example.prototype.levelFailed = function()
{
	return false;
}


Levels.Example.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.Example.prototype.getSimulationTime = function() {return this.model.T;}

Levels.Example.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.Example.prototype.infoText = function(ctx, canvas){return this.model.infoText();}