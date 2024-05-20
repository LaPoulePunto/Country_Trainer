let pays_references = '';
let submit_pays = document.getElementById('paysForm');
let formulairePaysFrontaliers = document.getElementById('paysFrontalier');
let pays_arriver = "";
let pays_depart = "";
let paysColores = {};
let carteX = window.innerWidth;
let carteY = window.innerHeight;
let formulaireDifficile = document.getElementById('hard');
let titleContainer = document.getElementById('title-container');
let erreur_pays = document.getElementById("erreur_pays");
let pays_aleatoire = document.getElementById("pays_aleatoire");
erreur_pays.style.display='none';
titleContainer.style.display='none';
formulairePaysFrontaliers.style.display = 'none';

pays_aleatoire.addEventListener("click", AleatoireFonction);
submit_pays.addEventListener('submit', formPays);
formulaireDifficile.addEventListener("click", fondBlanc)
formulairePaysFrontaliers.addEventListener('keypress', paysFrontaliersFunction);
formulairePaysFrontaliers.addEventListener('submit', paysFrontaliersFunction);

// Sélection de l'élément SVG existant dans le HTML
const svg = d3.select('svg')
    .attr('width', carteX)
    .attr('height', carteY);

const g = svg.append("g");

const projection = d3.geoMercator()
    .scale(140)
    .translate([svg.attr('width') / 2, svg.attr('height') / 1.4]);

const path = d3.geoPath(projection);

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(data => {
        const countries = topojson.feature(data, data.objects.countries);
        g.selectAll("path")
            .data(countries.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path);
    });

function formPays(event) {
    event.preventDefault();
    pays_depart = document.getElementById('pays1').value.trim();
    pays_arriver = document.getElementById('pays2').value.trim();
    if (pays_depart in borders && pays_arriver in borders && !borders[pays_depart].includes(pays_arriver)) {
        formulairePaysFrontaliers.style.display = 'block';
        pays_references = pays_depart;

        // Mémoriser les couleurs pour chaque pays
        paysColores[pays_depart] = "green";
        paysColores[pays_arriver] = "red";

        // Appliquer les couleurs
        g.selectAll("path")
            .style("fill", function (d) {
                return paysColores[d.properties.name] || "";
            });
    }
    else {
        let title = document.createElement('h1');
        erreur_pays.style.display = 'block';
        title.textContent = pays_depart + " et/ou " + pays_arriver + " ne sont pas acceptables";
        erreur_pays.appendChild(title);
        setTimeout(function () {
            erreur_pays.style.display = 'none';
            erreur_pays.innerHTML="";
            console.log('test');
        }, 3000);
    }
}

function paysFrontaliersFunction(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        formulairePaysFrontaliers.focus();
        var nv_pays = document.getElementById('paysFront').value.trim();
        formulairePaysFrontaliers.reset();

        if (borders[pays_references].includes(nv_pays)) {
            paysColores[nv_pays] = "blue";

            g.selectAll("path")
                .style("fill", function (d) {
                    return paysColores[d.properties.name] || "";
                });


            if (borders[nv_pays].includes(pays_arriver)) {
                let title = document.createElement('h1');
                titleContainer.style.display = 'block';
                title.textContent = 'Vous avez gagné, une partie se relancera dans 3 secondes !';
                titleContainer.appendChild(title);
                setTimeout(function () {
                    window.location.reload();
                }, 3000);

            }

            pays_references = nv_pays;
        }
        else {
            let title = document.createElement('h1');
            erreur_pays.style.display = 'block';
            title.textContent = nv_pays + " n'est pas frontalier à : " + pays_references;
            erreur_pays.appendChild(title);
            setTimeout(function () {
                erreur_pays.style.display = 'none';
                erreur_pays.innerHTML = "";
            }, 3000);
        }
    }
}

function fondBlanc(event){
    event.preventDefault()
    d3.select('svg')
    .style("fill", function (d) {
            return "white";
        });
}

function obtenirCleAleatoire(objet) {
    let cle = Object.keys(objet);
    return cle[Math.floor(Math.random() * cle.length)];
}

function AleatoireFonction(event) {
    event.preventDefault();
    let pays1 = obtenirCleAleatoire(borders);
    let pays2 = obtenirCleAleatoire(borders);


    document.getElementById('pays1').value = pays1;
    document.getElementById('pays2').value = pays2;
}





let borders = {
    "Afghanistan": ["China", "Iran", "Pakistan", "Tajikistan", "Turkmenistan", "Uzbekistan"],
    "Albania": ["Greece", "Kosovo", "Montenegro", "North Macedonia"],
    "Algeria": ["Libya", "Mali", "Mauritania", "Morocco", "Niger", "Tunisia", "W. Sahara"],
    "Andorra": ["France", "Spain"],
    "Angola": ["Dem. Rep. Congo", "Namibia", "Republic of the Congo", "Zambia"],
    "Argentina": ["Bolivia", "Brazil", "Chile", "Paraguay", "Uruguay"],
    "Armenia": ["Azerbaijan", "Georgia", "Iran", "Turkey"],
    "Austria": ["Czech Republic", "Germany", "Hungary", "Italy", "Liechtenstein", "Slovakia", "Slovenia", "Switzerland"],
    "Azerbaijan": ["Armenia", "Georgia", "Iran", "Russia", "Turkey"],
    "Bangladesh": ["India", "Myanmar"],
    "Belarus": ["Latvia", "Lithuania", "Poland", "Russia", "Ukraine"],
    "Belgium": ["France", "Germany", "Luxembourg", "Netherlands"],
    "Belize": ["Guatemala", "Mexico"],
    "Benin": ["Burkina Faso", "Niger", "Nigeria", "Togo"],
    "Bhutan": ["China", "India"],
    "Bolivia": ["Argentina", "Brazil", "Chile", "Paraguay", "Peru"],
    "Bosnia and Herzegovina": ["Croatia", "Montenegro", "Serbia"],
    "Botswana": ["Namibia", "South Africa", "Zambia", "Zimbabwe"],
    "Brazil": ["France", "Argentina", "Bolivia", "Colombia", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela", "France (French Guiana)"],
    "Brunei": ["Malaysia"],
    "Bulgaria": ["Greece", "North Macedonia", "Romania", "Serbia", "Turkey"],
    "Burkina Faso": ["Benin", "Côte d'Ivoire", "Ghana", "Mali", "Niger", "Togo"],
    "Burundi": ["Dem. Rep. Congo", "Rwanda", "Tanzania"],
    "Cambodia": ["Laos", "Thailand", "Vietnam"],
    "Cameroon": ["Central African Republic", "Chad", "Republic of the Congo", "Equatorial Guinea", "Gabon", "Nigeria"],
    "Canada": ["United States"],
    "Central African Republic": ["Cameroon", "Chad", "Dem. Rep. Congo", "Republic of the Congo", "South Sudan", "Sudan"],
    "Chad": ["Cameroon", "Central African Republic", "Libya", "Niger", "Nigeria", "Sudan"],
    "Chile": ["Argentina", "Bolivia", "Peru"],
    "China": ["Afghanistan", "Bhutan", "India", "Kazakhstan", "Kyrgyzstan", "Laos", "Mongolia", "Myanmar", "Nepal", "North Korea", "Pakistan", "Russia", "Tajikistan", "Vietnam"],
    "Colombia": ["Brazil", "Ecuador", "Panama", "Peru", "Venezuela"],
    "Dem. Rep. Congo": ["Angola", "Burundi", "Central African Republic", "Republic of the Congo", "Rwanda", "South Sudan", "Tanzania", "Uganda", "Zambia"],
    "Congo (Republic of the)": ["Angola", "Cameroon", "Central African Republic", "Dem. Rep. Congo", "Gabon"],
    "Costa Rica": ["Nicaragua", "Panama"],
    "Croatia": ["Bosnia and Herzegovina", "Hungary", "Montenegro", "Serbia", "Slovenia"],
    "Czech Republic": ["Austria", "Germany", "Poland", "Slovakia"],
    "Denmark": ["Germany"],
    "Djibouti": ["Eritrea", "Ethiopia", "Somalia"],
    "Dominican Republic": ["Haiti"],
    "East Timor": ["Indonesia"],
    "Ecuador": ["Colombia", "Peru"],
    "Egypt": ["Israel", "Libya", "Sudan"],
    "El Salvador": ["Guatemala", "Honduras"],
    "Equatorial Guinea": ["Cameroon", "Gabon"],
    "Eritrea": ["Djibouti", "Ethiopia", "Sudan"],
    "Estonia": ["Latvia", "Russia"],
    "Eswatini": ["Mozambique", "South Africa"],
    "Ethiopia": ["Djibouti", "Eritrea", "Kenya", "Somalia", "South Sudan", "Sudan"],
    "Finland": ["Norway", "Russia", "Sweden"],
    "France": ["Suriname", "Andorra", "Belgium", "Germany", "Italy", "Luxembourg", "Monaco", "Spain", "Switzerland", "Brazil"],
    "Gabon": ["Cameroon", "Equatorial Guinea", "Republic of the Congo"],
    "Gambia": ["Senegal"],
    "Georgia": ["Armenia", "Azerbaijan", "Russia", "Turkey"],
    "Germany": ["Austria", "Belgium", "Czech Republic", "Denmark", "France", "Luxembourg", "Netherlands", "Poland", "Switzerland"],
    "Ghana": ["Burkina Faso", "Côte d'Ivoire", "Togo"],
    "Greece": ["Albania", "Bulgaria", "North Macedonia", "Turkey"],
    "Guatemala": ["Belize", "El Salvador", "Honduras", "Mexico"],
    "Guinea": ["Côte d'Ivoire", "Guinea-Bissau", "Liberia", "Mali", "Senegal", "Sierra Leone"],
    "Guinea-Bissau": ["Guinea", "Senegal"],
    "Guyana": ["Brazil", "Suriname", "Venezuela"],
    "Haiti": ["Dominican Republic"],
    "Honduras": ["El Salvador", "Guatemala", "Nicaragua"],
    "Hungary": ["Austria", "Croatia", "Romania", "Serbia", "Slovakia", "Slovenia", "Ukraine"],
    "India": ["Bangladesh", "Bhutan", "China", "Myanmar", "Nepal", "Pakistan"],
    "Indonesia": ["East Timor", "Malaysia", "Papua New Guinea"],
    "Iran": ["Afghanistan", "Armenia", "Azerbaijan", "Iraq", "Pakistan", "Turkey", "Turkmenistan"],
    "Iraq": ["Iran", "Jordan", "Kuwait", "Saudi Arabia", "Syria", "Turkey"],
    "Ireland": ["United Kingdom"],
    "Israel": ["Egypt", "Jordan", "Lebanon", "Syria"],
    "Italy": ["Austria", "France", "San Marino", "Slovenia", "Switzerland", "Vatican"],
    "Jordan": ["Iraq", "Israel", "Saudi Arabia", "Syria"],
    "Kazakhstan": ["China", "Kyrgyzstan", "Russia", "Turkmenistan", "Uzbekistan"],
    "Kenya": ["Ethiopia", "Somalia", "South Sudan", "Tanzania", "Uganda"],
    "Kuwait": ["Iraq", "Saudi Arabia"],
    "Kyrgyzstan": ["China", "Kazakhstan", "Tajikistan", "Uzbekistan"],
    "Laos": ["Cambodia", "China", "Myanmar", "Thailand", "Vietnam"],
    "Latvia": ["Belarus", "Estonia", "Lithuania", "Russia"],
    "Lebanon": ["Israel", "Syria"],
    "Lesotho": ["South Africa"],
    "Liberia": ["Côte d'Ivoire", "Guinea", "Sierra Leone"],
    "Libya": ["Algeria", "Chad", "Egypt", "Niger", "Sudan", "Tunisia"],
    "Liechtenstein": ["Austria", "Switzerland"],
    "Lithuania": ["Belarus", "Latvia", "Poland", "Russia"],
    "Luxembourg": ["Belgium", "France", "Germany"],
    "Malawi": ["Mozambique", "Tanzania", "Zambia"],
    "Malaysia": ["Brunei", "Indonesia", "Thailand"],
    "Mali": ["Algeria", "Burkina Faso", "Guinea", "Ivory Coast", "Mauritania", "Niger", "Senegal"],
    "Mauritania": ["Algeria", "Mali", "Senegal", "W. Sahara"],
    "Mexico": ["Belize", "Guatemala", "United States"],
    "Moldova": ["Romania", "Ukraine"],
    "Monaco": ["France"],
    "Mongolia": ["China", "Russia"],
    "Montenegro": ["Albania", "Bosnia and Herzegovina", "Croatia", "Kosovo", "Serbia"],
    "Morocco": ["Algeria", "W. Sahara"],
    "Mozambique": ["Eswatini", "Malawi", "South Africa", "Tanzania", "Zambia", "Zimbabwe"],
    "Myanmar": ["Bangladesh", "China", "India", "Laos", "Thailand"],
    "Namibia": ["Angola", "Botswana", "South Africa", "Zambia"],
    "Nepal": ["China", "India"],
    "Netherlands": ["Belgium", "Germany"],
    "Nicaragua": ["Costa Rica", "Honduras"],
    "Niger": ["Algeria", "Benin", "Burkina Faso", "Chad", "Libya", "Mali", "Nigeria"],
    "Nigeria": ["Benin", "Cameroon", "Chad", "Niger"],
    "North Korea": ["China", "South Korea", "Russia"],
    "North Macedonia": ["Albania", "Bulgaria", "Greece", "Kosovo", "Serbia"],
    "Norway": ["Finland", "Russia", "Sweden"],
    "Oman": ["Saudi Arabia", "United Arab Emirates", "Yemen"],
    "Pakistan": ["Afghanistan", "China", "India", "Iran"],
    "Palestine": ["Israel", "Jordan"],
    "Panama": ["Colombia", "Costa Rica"],
    "Papua New Guinea": ["Indonesia"],
    "Paraguay": ["Argentina", "Bolivia", "Brazil"],
    "Peru": ["Bolivia", "Brazil", "Chile", "Colombia", "Ecuador"],
    "Poland": ["Belarus", "Czech Republic", "Germany", "Lithuania", "Russia", "Slovakia", "Ukraine"],
    "Portugal": ["Spain"],
    "Qatar": ["Saudi Arabia"],
    "Romania": ["Bulgaria", "Hungary", "Moldova", "Serbia", "Ukraine"],
    "Russia": ["Azerbaijan", "Belarus", "China", "Estonia", "Finland", "Georgia", "Kazakhstan", "Latvia", "Lithuania", "Mongolia", "North Korea", "Norway", "Poland", "Ukraine"],
    "Rwanda": ["Burundi", "Dem. Rep. Congo", "Tanzania", "Uganda"],
    "San Marino": ["Italy"],
    "Saudi Arabia": ["Iraq", "Jordan", "Kuwait", "Oman", "Qatar", "United Arab Emirates", "Yemen"],
    "Senegal": ["Gambia", "Guinea", "Guinea-Bissau", "Mali", "Mauritania"],
    "Serbia": ["Bosnia and Herzegovina", "Bulgaria", "Croatia", "Hungary", "Kosovo", "Montenegro", "North Macedonia", "Romania"],
    "Sierra Leone": ["Guinea", "Liberia"],
    "Slovakia": ["Austria", "Czech Republic", "Hungary", "Poland", "Ukraine"],
    "Slovenia": ["Austria", "Croatia", "Hungary", "Italy"],
    "Somalia": ["Djibouti", "Ethiopia", "Kenya"],
    "South Africa": ["Botswana", "Eswatini", "Lesotho", "Mozambique", "Namibia", "Zimbabwe"],
    "South Korea": ["North Korea"],
    "South Sudan": ["Central African Republic", "Dem. Rep. Congo", "Ethiopia", "Kenya", "Sudan", "Uganda"],
    "Spain": ["Andorra", "France", "Gibraltar", "Portugal"],
    "Sudan": ["Central African Republic", "Chad", "Egypt", "Eritrea", "Ethiopia", "Libya", "South Sudan"],
    "Suriname": ["Brazil", "French Guiana", "Guyana"],
    "Sweden": ["Finland", "Norway"],
    "Switzerland": ["Austria", "France", "Germany", "Italy", "Liechtenstein"],
    "Syria": ["Iraq", "Israel", "Jordan", "Lebanon", "Turkey"],
    "Tajikistan": ["Afghanistan", "China", "Kyrgyzstan", "Uzbekistan"],
    "Tanzania": ["Burundi", "Dem. Rep. Congo", "Kenya", "Malawi", "Mozambique", "Rwanda", "Uganda", "Zambia"],
    "Thailand": ["Cambodia", "Laos", "Malaysia", "Myanmar"],
    "Togo": ["Benin", "Burkina Faso", "Ghana"],
    "Tunisia": ["Algeria", "Libya"],
    "Turkey": ["Armenia", "Azerbaijan", "Bulgaria", "Georgia", "Greece", "Iran", "Iraq", "Syria"],
    "Turkmenistan": ["Afghanistan", "Iran", "Kazakhstan", "Uzbekistan"],
    "Uganda": ["Dem. Rep. Congo", "Kenya", "Rwanda", "South Sudan", "Tanzania"],
    "Ukraine": ["Belarus", "Hungary", "Moldova", "Poland", "Romania", "Russia", "Slovakia"],
    "United Arab Emirates": ["Oman", "Saudi Arabia"],
    "United Kingdom": ["Ireland"],
    "United States": ["Canada", "Mexico"],
    "Uruguay": ["Argentina", "Brazil"],
    "Uzbekistan": ["Afghanistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"],
    "Vatican": ["Italy"],
    "Venezuela": ["Brazil", "Colombia", "Guyana"],
    "Vietnam": ["Cambodia", "China", "Laos"],
    "Yemen": ["Oman", "Saudi Arabia"],
    "Zambia": ["Angola", "Botswana", "Dem. Rep. Congo", "Malawi", "Mozambique", "Namibia", "Tanzania", "Zimbabwe"],
    "Zimbabwe": ["Botswana", "Mozambique", "South Africa", "Zambia"],
    "W. Sahara" : ["Morocco", "Mauritania", "Algeria"]
};