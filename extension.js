
const vscode = require('vscode');
const path = require('path');
/**
 * @param {vscode.ExtensionContext} context
 */

const quotes = [
	"Code is poetry written for machines.",
	"Every bug fixed is a lesson learned.",
	"You are one commit away from greatness.",
	"It works on my machine — ship the machine.",
	"First solve the problem, then write the code.",
	"Make it work, make it right, make it fast."
]

const doodles = ["stay-strong.gif","hii-excited.gif","you-got-this.gif","catcoding.gif","fire.gif"];
const colors = ["cyan","aquamarine","white","skyblue","lightcoral","lightblue","purple","beige"];
let timer = null;
let currentPanel = null;

function getWebViewContent(context,panel) {

	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
	const randomDoodle = doodles[Math.floor(Math.random() * doodles.length)];
	const randomColor = colors[Math.floor(Math.random() * colors.length)];

	const doodlePath = vscode.Uri.file(
		path.join(context.extensionPath,'doodles',randomDoodle)
	)
	const doodleURI = panel.webview.asWebviewUri(doodlePath);

	return `
<!DOCTYPE html>
  <html>
    <body style="text-align:center; background: #1e1e1e; color:${randomColor}; padding:40px;">
      <img src="${doodleURI}" width="200">
      <h2><i>"${randomQuote}"</i></h2>
    </body>
  </html>
	`
}
function showMotivation(context){
	if(currentPanel){
		currentPanel.reveal(vscode.ViewColumn.Two);
		currentPanel.webview.html = getWebViewContent(context,currentPanel);
		return;
	}
	currentPanel = vscode.window.createWebviewPanel(
			"doodlePanel",
			"Keep going",
			vscode.ViewColumn.Two,
			{}
		);
	currentPanel.webview.html = getWebViewContent(context,currentPanel);
	currentPanel.onDidDispose(()=> {currentPanel = null});

}
function activate(context) {
	timer = setInterval(()=> showMotivation(context), 10000);
	let command = vscode.commands.registerCommand('motivate-me', () => showMotivation(context));
	let stopCommand = vscode.commands.registerCommand('stop-motivation',()=> {
		if(timer){
			clearInterval(timer);
			timer = null;
			currentPanel.dispose();
			currentPanel = null;
		}
	})
	context.subscriptions.push(command);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
