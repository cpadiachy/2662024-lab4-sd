async function FetchCountry() {
    let countryName = document.getElementById("userInput").value.trim();

    if (!countryName){
        displayError("Please enter a country name.");
        return;
    }

    try {
        let response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if (!response.ok) {
            throw new Error("Country not found.");
        }

        let data = await response.json();  
        let country = data[0];

        let capital = country.capital ? country.capital[0] : "No capital city.";
        let population = country.population.toLocaleString();
        let region = country.region;
        let flag = country.flags.png;
        let borders = country.borders || [];

        let neighbors = await fetchNeighbouringCountries(borders);
        displayCountryInfo(countryName, capital, population, region, flag, neighbors);
    } catch (error) {
        displayError(error.message);
    }
}

async function fetchNeighbouringCountries(borders){
    if (borders.length === 0) return [];

    try {
        let response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`);
        let data = await response.json();

        return data.map(country => ({
            name: country.name.common,
            flag: country.flags.png
        }));
    } catch {
        return [];
    }
}

function displayCountryInfo(countryName, capital, population, region, flag, neighbors){
    let output = document.getElementById("output");

    output.innerHTML = "";

    output.innerHTML += `<h2>${countryName}</h2>`;
    output.innerHTML += `<p><strong>Capital:</strong> ${capital}</p>`;
    output.innerHTML += `<p><strong>Population:</strong> ${population}</p>`;
    output.innerHTML += `<p><strong>Region:</strong> ${region}</p>`;
    output.innerHTML += `<img src="${flag}" alt="Flag of ${countryName}" width="150">`;

    output.innerHTML += `<h3>Neighboring Countries:</h3>`;

    if (neighbors.length > 0) {
        output.innerHTML += `<ul>`;
        for (let neighbor of neighbors) {
            output.innerHTML += `<li>${neighbor.name} <br> <img src="${neighbor.flag}" alt="Flag of ${neighbor.name}" width="100"></li>`;
        }
        output.innerHTML += `</ul>`;
    } else {
        output.innerHTML += `<p>No neighboring countries.</p>`;
    }
}

function displayError(message) {
    document.getElementById("output").innerHTML = `<p style="color: red;">${message}</p>`;
}
