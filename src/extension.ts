import * as vscode from 'vscode';
import axios from 'axios';
import cheerio from 'cheerio';
import { Match, fetchLiveCricketMatches } from './Match';
import { log } from 'console';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "cricket" is now active!');

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
      );
    console.log(statusBarItem);
    statusBarItem.text = "VS Cricket";
    statusBarItem.command = "cricket.askQuestion";
    statusBarItem.show();

    let askQuestion = vscode.commands.registerCommand(
        "cricket.askQuestion",
        async function () {
          const items = [
            {
              label: "Live Scores",
              detail: "Display live cricket scores",
              command: "cricket.liveScores",
            },
            {
              label: "Latest News",
              detail: "Display latest cricket news",
              command: "cricket.latestNews",
            },
          ];
          const response = await vscode.window.showQuickPick(items);
          if (response != undefined)
          {
              vscode.commands.executeCommand(response.command);
          }
        }
      );

     
  let disposable = vscode.commands.registerCommand(
    "cricket.liveScores",
    function () {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Fetching Scores...",
          cancellable: true,
        },
        async (progress, token) => {
          // Update progress
          progress.report({ increment: 0 });
          const matches = await fetchLiveCricketMatches();
          progress.report({ increment: 100 });

          if (matches.length === 0) {
              vscode.window.showInformationMessage('No live matches available.');
              return;
          }

          matches.map(m=>{
            console.log(m);
            
          })

          const scores = matches.map(match => ({
              label: match.teamsHeading,
              description: `${match.matchNumberVenue} - ${match.score} vs ${match.bowlTeamScore}`,
              detail: match.textLive || match.textComplete,
              match // Store the whole match object for further use
          }));

          const selected = await vscode.window.showQuickPick(scores, {
              placeHolder: 'Select a live match to view details'
          });

          if (selected) {
              vscode.window.showInformationMessage(`You selected: ${selected.label}`);
          }
      }

      );
    }
  );

  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
