import * as vscode from 'vscode';
import axios from 'axios';
import cheerio from 'cheerio';

export class Match {
    teamsHeading: string;
    matchNumberVenue: string;
    battingTeam: string;
    score: string;
    bowlTeam: string;
    bowlTeamScore: string;
    textLive: string;
    textComplete: string;

    constructor(
        teamsHeading: string,
        matchNumberVenue: string,
        battingTeam: string,
        score: string,
        bowlTeam: string,
        bowlTeamScore: string,
        textLive: string,
        textComplete: string
    ) {
        this.teamsHeading = teamsHeading;
        this.matchNumberVenue = matchNumberVenue;
        this.battingTeam = battingTeam;
        this.score = score;
        this.bowlTeam = bowlTeam;
        this.bowlTeamScore = bowlTeamScore;
        this.textLive = textLive;
        this.textComplete = textComplete;
    }

    displayMatchInfo(): string {
        return `
        Teams: ${this.teamsHeading}
        Venue: ${this.matchNumberVenue}
        Batting Team: ${this.battingTeam}
        Score: ${this.score}
        Bowling Team: ${this.bowlTeam}
        Bowling Team Score: ${this.bowlTeamScore}
        Live Text: ${this.textLive}
        Completion Text: ${this.textComplete}
        `;
    }
}


export async function fetchLiveCricketMatches(): Promise<Match[]> {
    const url = "https://www.cricbuzz.com/cricket-match/live-scores";
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const liveScoreElements = $('div.cb-mtch-lst.cb-tms-itm');
        const matches: Match[] = [];

        liveScoreElements.each((index, element) => {
            const teamsHeading = $(element).find('h3.cb-lv-scr-mtch-hdr a').text();
            const matchNumberVenue = $(element).find('span').text();
            const matchBatTeamInfo = $(element).find('div.cb-hmscg-bat-txt');
            const battingTeam = matchBatTeamInfo.find('div.cb-hmscg-tm-nm').text();
            const score = matchBatTeamInfo.find('div.cb-hmscg-tm-nm + div').text();
            const bowlTeamInfo = $(element).find('div.cb-hmscg-bwl-txt');
            const bowlTeam = bowlTeamInfo.find('div.cb-hmscg-tm-nm').text();
            const bowlTeamScore = bowlTeamInfo.find('div.cb-hmscg-tm-nm + div').text();
            const textLive = $(element).find('div.cb-text-live').text();
            const textComplete = $(element).find('div.cb-text-complete').text();

            matches.push(new Match(
                teamsHeading,
                matchNumberVenue,
                battingTeam,
                score,
                bowlTeam,
                bowlTeamScore,
                textLive,
                textComplete
            ));
        });

        return matches;
    } catch (error) {
        console.error("Error fetching live cricket matches:", error);
        vscode.window.showErrorMessage('Error fetching live cricket matches. Please try again later.');
        return [];
    }
}