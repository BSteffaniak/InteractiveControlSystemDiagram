jQuery.fn.cleanWhitespace = function() {
    textNodes = this.contents().filter(
        function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
        .remove();
    return this;
}

function resizeCanvas() {
	canvas.width = $('#cas').width();
	canvas.height = $('#cas').height();
}

function loadCodeAndReset()
{
	level.resetModel();
	$('#userscript').remove();
	try {
		var e = $('<script id="userscript">'+editor.getValue() +'</script>');	
		$('body').append(e);
		level.model.setControlFunction(controlFunction)
	}
	catch(e){
		pauseSimulation();
		alert(e);
	}
	playSimulation();
}

function loadLevelToDOM(level)
{
	$('#levelDescription').text(level.description);
	$('#levelTitle').text(level.title);
	document.title = level.title +': Control Challenges';
	var savedCode = localStorage.getItem(level.name+"Code");
	if(typeof savedCode == 'string' && savedCode.length > 10)
		editor.setValue(savedCode);
	else 
		editor.setValue(level.boilerPlateCode);
}

function showSampleSolution()
{
	var lines = editor.getValue().split(/\r?\n/);
	editor.setValue(level.sampleSolution + "\n\n//"+lines.join("\n//")+"\n");
	loadCodeAndReset();
}

function pauseSimulation()
{
	$('#pauseButton').hide();
	$('#playButton').show();
	runSimulation = false;
}
function playSimulation()
{
	$('#pauseButton').show();
	$('#playButton').hide();
	runSimulation = true;
}

function drawLine(ctx,x1,y1,x2,y2,width)
{
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = width;
	ctx.stroke();
}

function round(x,d)
{
	var shift = Math.pow(10, d);
	return Math.round(x*shift)/shift;
}

function toggleVariableInfo()
{
	$('#variableInfo').toggle();
	$('#toggleVariableInfoButtonShow').toggle();
	$('#toggleVariableInfoButtonHide').toggle();
}

function animate() {
	
	var dt = (new Date().getTime()-T)/1000.0;
	T = new Date().getTime();
	
	if(runSimulation)
	{
		try { if(!isNaN(dt)) level.model.simulate(Math.min(0.2,dt)); }
		catch(e){
			pauseSimulation();
			alert(e);
		}
	}
	
	level.model.draw(context);
	
	$('#variableInfo').text(level.model.infoText());
	
	requestAnimationFrame(animate);
}



function hideAllPopups()
{
	$('#levelCompletePopup').hide();
	$('#levelStartPopup').hide();
	$('#levelMenuPopup').hide();
}

function showPopup(p)
{
	hideAllPopups();
	$(p).show();
	pauseSimulation();
}




var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById('cas');
var context = canvas.getContext('2d');
var level = new Levels.StabilizeSinglePendulum();
//var level = new Levels.RocketLandingNormal();
var runSimulation = false;
$(document).ready(function(){$('[data-toggle="tooltip"]').tooltip();});
$('#toggleVariableInfoButtonShow').hide();
var editor = CodeMirror.fromTextArea(document.getElementById("CodeMirrorEditor"), {lineNumbers: true, mode: "javascript", matchBrackets: true, lineWrapping:true});
editor.on("change", function () {localStorage.setItem(level.name+"Code", editor.getValue());});
shortcut.add("Alt+Enter",function() {loadCodeAndReset();},{'type':'keydown','propagate':true,'target':document});
$( window ).resize(resizeCanvas);
$('#buttons').cleanWhitespace();
showPopup('#levelStartPopup');
var T = new Date().getTime();
resizeCanvas();
loadLevelToDOM(level);
loadCodeAndReset();
pauseSimulation();
animate();