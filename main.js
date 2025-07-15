const backgroundToggle = document.querySelector('#background-toggle');
const searchInput = document.querySelector('#search');
const filterInput = document.querySelector('#filter-input');
let allCountries = [];

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode")
}
backgroundToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if(document.body.classList.contains("dark-mode")) {
        localStorage.setItem('theme', "dark")
    } else {
        localStorage.setItem('theme', 'light')
    }
})

function onSearchInput() {
    return searchInput.value.toLowerCase().trim();   
}

function onFilterInput() {
    return filterInput.value;   
}

function searchResults(countries, searchQuery) {
    if (countries.length =='') {
        countries = allCountries
    }

    return countries.filter(country => country.name.toLowerCase().includes(searchQuery))
}

function filterResults(countries, filterOptions) {
    return countries.filter(country => 
    country.region.toLowerCase().includes(filterOptions.toLowerCase()))
}


async function countryResults () {
    const searchTerm = onSearchInput()
    const selectedFilter = onFilterInput()

    const filteredResults = filterResults(allCountries, selectedFilter)
    const searchTermResults = searchResults(filteredResults, searchTerm)

    displayCountriesInfo(searchTermResults)
}

async function fetchAPIData() {
    const response = await fetch('./data.json');
    const data = await response.json();
    allCountries = data

    displayCountriesInfo(data)
    return data;
}

function displayCountriesInfo(results) {
    document.querySelector('#country-info').innerHTML = '';
    results.forEach(country => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <img src="${country.flags.png}" alt="">
                            <div class="card-body">
                            <ul>
                                <h4 class="country-title">${country.name}</h4>
                                <h5>Population: <span>${addCommasToNumber(country.population)}</span></h5>
                                <h5>Region: <span>${country.region}</span></h5>
                                <h5>Capital: <span>${country.capital}</span></h5>
                            </ul>    
                            </div>`

       document.querySelector('#country-info').
       appendChild(div);
       
       div.addEventListener('click', () => {
        document.querySelector('.main').style.display = 'none';

        document.querySelector('#country-details').classList.add('active')
        displayCountriesDetails(country)
       })
    });
}

function displayCountriesDetails(selectedCountry) {
    const countryDetails = document.querySelector('#country-details')
    countryDetails.innerHTML = `
    <button id= "back-btn" class="back-btn btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
    <div class="country-details-wrapper">
                <div class="country-details-img">
                    <img src="${selectedCountry.flags.svg}" alt="">
                </div>
                <div class="country-details-content">
                    <div class="country-details-name">
                        <h2>${selectedCountry.name}</h2>
                    </div>
                    <div class="country-details-info">
                        <div class="country-details-info-left">
                        <ul>
                            <li><strong>Native Name: </strong>${selectedCountry.nativeName}</li>
                            <li><strong>Population: </strong>${addCommasToNumber(selectedCountry.population)}</li>
                            <li><strong>Region: </strong>${selectedCountry.region}</li>
                            ${selectedCountry.subregion ? 
                                `<li><strong>Sub Region: </strong>${selectedCountry.subregion}</li>`
                                :
                                `<li><strong>Sub Region: </strong>none</li>`
                            }
                            <li><strong>Capital: </strong>${selectedCountry.capital}</li>
                            
                        </ul>    
                        </div>
                        <div class="country-details-info-right">
                        <ul>
                            <li><strong>Top Level Domain: </strong>${selectedCountry.topLevelDomain}</li>
                            <li><strong>Currencies: </strong>${selectedCountry.currencies[Object.keys(selectedCountry.currencies)].name}</li>
                            <li><strong>Languages: </strong>${Object.values(selectedCountry.languages).map(item => `${item.name}`).join(', ')}</li>
                        </ul>    
                        </div>
                    </div>
                    <div class="country-details-borders">
                    
                       ${selectedCountry.borders && selectedCountry.borders.length > 0 
                        ?
                        `<div>
                        <strong>Border Countries: </strong>
                        ${selectedCountry.borders.map(border => ` <span>${border}</span>`).join(' ')}
                        </div> 
                        `
                        :
                        `<div>
                        <strong>Border Countries: </strong>
                        none
                        </div> 
                        `
                    }
                    </div>
                </div>
            </div>`
            document.querySelector('#back-btn').addEventListener('click', () => {
                document.querySelector('.main').style.display = 'block'
                document.querySelector('#country-details').classList.remove('active')
            })          
}   
    


document.addEventListener('DOMContentLoaded', fetchAPIData);
searchInput.addEventListener('input', countryResults);
filterInput.addEventListener('change', countryResults);

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
