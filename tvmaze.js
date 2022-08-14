
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";

const showsList = document.querySelector("#shows-list");
const searchForm = document.querySelector("#search-form");
const queryInput = document.querySelector("#search-query");

/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
// TODO: Make an ajax request to the searchShows api.  Remove
// hard coded data.

    const res = await axios.get('https://api.tvmaze.com/search/shows', { params: { q: query } });
    const shows = res.data.map((result) => {
        const show = result.show;
        return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : MISSING_IMAGE_URL,
        };
    });
    
    return shows;     
}
      
      
      
/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
      
function populateShows(shows) {
    
    showsList.innerHTML = '';
      
    for (let show of shows) {
        const showList = document.createElement('div');
        showList.classList.add("col-md-6", "col-lg-3", "Show");
        showList.setAttribute('data-showId', show.id);
        let item =
            `  <div class="card" data-show-id="${show.id}">
                 <img class="card-img-top" src="${show.image}">
                 <div class="card-body">
                   <h5 class="card-title">${show.name}</h5>
                   <p class="card-text">${show.summary}</p>
                   <button type="button" class="btn btn-primary get-episodes" data-toggle="modal" data-target="#episodeModal">Episodes</button>
                 </div>
               </div>
            `;
      
        showList.innerHTML = item;

        showsList.append(showList);
    }
}
      
      
/** Handle search form submission:
*    - hide episodes area
*    - get list of matching shows and show in shows list
*/

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleSearch();
})

async function handleSearch() {
    
    const queryValue = queryInput.value;

    if (!queryValue) return;

    const shows = await searchShows(queryValue);

    populateShows(shows);
}


/** Given a show ID, return list of episodes:
*      { id, name, season, number }
*/
      
async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
    
    const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
    
    const episodes = res.data.map((episode) => {
        return {
            id: episode.id,
            name: episode.name,
            season: episode.season,
            number: episode.number
        };
    });

    populateEpisodes(episodes);
}
 
// Function to show all the episodes on the DOM
function populateEpisodes(episodes) {

    // This is to display episodes by the end
    // const episodeList = document.querySelector("#episodes-list");
    // episodeList.innerHTML = '';
    // for (let episode of episodes) {
    //     const li = document.createElement('li');
    //     li.innerText = `${episode.name} (season ${episode.season}, number ${episode.number})`;

    //     episodeList.append(li);
    // }

    // To EPISODES SECTION when episodes button is clicked
    // document.querySelector("#episodes-area").style.display = 'block';


    // Have done to display episodes in a MODAL
    const episodeList = document.querySelector("#episodes-list");
    episodeList.innerHTML = '';
    for (let episode of episodes) {
        const li = document.createElement('li');
        li.innerText = `${episode.name} (season ${episode.season}, number ${episode.number})`;

        episodeList.append(li);
    }

}

// Event Listener to show the episodes when "EPISODE" button is clicked 
// Inorder to show the episodes we need to have the "SHOW ID" for which we retrieve it based on the "data-showId" attribute we set when a card for each show is created

showsList.addEventListener('click', function (e) {
    const target = e.target.closest('.get-episodes').closest('.Show');
    getEpisodes(target.getAttribute('data-showId'));
})