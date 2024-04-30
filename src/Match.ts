import axios from 'axios';
import cheerio from 'cheerio';


console.log("Amin");

async function fetchLiveCricketMatches() {
    const url = "https://www.cricbuzz.com/cricket-match/live-scores";
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const liveScoreElements = $('div.cb-mtch-lst.cb-tms-itm');
        liveScoreElements.each((index, element) => {
            const liveMatchInfo: { [key: string]: string } = {};
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

            // Do something with the fetched data (e.g., store it in an array or object)
            console.log({
                teamsHeading,
                matchNumberVenue,
                battingTeam,
                score,
                bowlTeam,
                bowlTeamScore,
                textLive,
                textComplete
            });
        });
    } catch (error) {
        console.error("Error fetching live cricket matches:", error);
    }
}

fetchLiveCricketMatches()
    // .then((data) => {
    //     // Handle successful fetch
    //     console.log(data);
    // })
    // .catch((error) => {
    //     // Handle error
    //     console.error("Error fetching live cricket matches:", error);
    // });
