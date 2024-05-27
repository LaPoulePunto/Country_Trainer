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
let coords = document.getElementById("map");
let abondonner = document.getElementById("surrend");
let pays1 = document.getElementById("pays1");
let pays2 = document.getElementById("pays2");
let isBlanc = false;
let joeur = document.getElementById('jouer');
let desactiver_pays_aleatoire = document.getElementById('desactiver_pays_aleatoire');
let compteur = 0;
let disparitre = document.getElementsByClassName('disparaitre');

erreur_pays.style.display = 'none';
titleContainer.style.display = 'none';
formulairePaysFrontaliers.style.display = 'none';


pays_aleatoire.addEventListener("click", AleatoireFonction);
submit_pays.addEventListener('submit', formPays);
formulaireDifficile.addEventListener("click", fondBlanc)
formulairePaysFrontaliers.addEventListener('keypress', paysFrontaliersFunction);
formulairePaysFrontaliers.addEventListener('submit', paysFrontaliersFunction);
abondonner.addEventListener("click", abandonnerFunction);
// pays1.addEventListener("keydown", suggestionFunction);




const svg = d3.select('svg')
    .attr('width', carteX / 1.6)
    .attr('height', carteY / 1.4)
    .attr("viewBox", "0 0 " + carteX / 1.6 + " " + carteY / 1.35)
    .call(d3.zoom().on("zoom", function (event) {
        // Sélectionne le groupe à l'intérieur du SVG


        // Applique la transformation de zoom/déplacement
        g.attr("transform", event.transform);
    }));

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

// function zoomFunction(event) {
//     const svgElement = document.querySelector('svg');
//     const point = svgElement.createSVGPoint();
//     point.x = event.clientX;
//     point.y = event.clientY;
//     const svgCoords = point.matrixTransform(svgElement.getScreenCTM().inverse());
//     console.log();
//     const coordXm = svgCoords.x-( (carteX/1.6)*0.1 );
//     const coordYm = svgCoords.y-( (carteY/1.4)*0.1 )*(carteY/carteX);
//     const coordXp = svgCoords.x+( (carteX/1.6)*0.1 );
//     const coordYp = svgCoords.y+( (carteY/1.4)*0.1 )*(carteY/carteX);
//     svgElement.setAttribute("viewBox", `${coordXm} ${coordYm} ${coordXp} ${coordYp}`);
// }

function zoomed({ transform }) {
    const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
    const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
    gDot.attr("transform", transform).attr("stroke-width", 5 / transform.k);
    gx.call(xAxis, zx);
    gy.call(yAxis, zy);
    gGrid.call(grid, zx, zy);
}





function formPays(event) {
    event.preventDefault();

    if ((carteX / carteY) < 1.3) {
        paysForm.style.display = 'none';
        pays_aleatoire.style.display = 'none';
    }

    pays_depart = document.getElementById('pays1').value.trim();
    pays_arriver = document.getElementById('pays2').value.trim();
    if (!Object.keys(borders).includes(pays_depart)) {
        pays_depart = enToFr(capitalizeFirstLetter(pays_depart));
    }
    if (!Object.keys(borders).includes(pays_arriver)) {
        pays_arriver = enToFr(capitalizeFirstLetter(pays_arriver));
    }
    if (pays_depart in borders && pays_arriver in borders && !borders[pays_depart].includes(pays_arriver)) {
        formulairePaysFrontaliers.style.display = 'block';
        pays_references = pays_depart;

        paysColores[pays_depart] = "green";
        paysColores[pays_arriver] = "red";
        pays1.disabled = true;
        pays2.disabled = true;
        joeur.disabled = true;
        desactiver_pays_aleatoire.disabled = true;
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
            erreur_pays.innerHTML = "";
        }, 3000);
    }
}

function paysFrontaliersFunction(event) {
    console.log(Object.values("S. Sudan"))
    if (event.key === 'Enter') {
        event.preventDefault();
        compteur += 1;
        formulairePaysFrontaliers.focus();
        let nv_pays = document.getElementById('paysFront').value.trim();

        if (!Object.keys(borders).includes(nv_pays)) {
            nv_pays = capitalizeFirstLetter(nv_pays);
        }

        nv_pays = enToFr(nv_pays);
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
                let keysPays = Object.keys(borders);


                // var graph = new Graph({
                //     'A': { 'B': 1, 'C': 4 },
                //     'B': { 'A': 1, 'C': 2, 'D': 5 },
                //     'C': { 'A': 4, 'B': 2, 'D': 1 },
                //     'D': { 'B': 5, 'C': 1 }
                // });
                //
                // var chemin = graph.findShortestPath('A', 'D');


                let graph = new Graph(matrice);
                let shortest = graph.findShortestPath(pays_depart, pays_arriver);
                let coupMin = shortest.length - 2;
                title.textContent = `Bravo, vous avez gagné en ${compteur} coups , le chemin le plus rapide était en ${coupMin} étapes ! par exemple : ` + shortest.join("->");
                titleContainer.appendChild(title);

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

function enToFr(pays) {
    if (paysFr.includes(pays)) {
        let cles = Object.keys(borders);
        let indexPaysFR = paysFr.indexOf(pays);
        pays = cles[indexPaysFR];
    }
    return pays;
}

function fondBlanc(event) {
    event.preventDefault()
    if (!isBlanc) {
        d3.select('svg')
            .style("fill", function (d) {
                return "white";
            });
    }
    else {
        d3.select('svg')
            .style("fill", function (d) {
                return "black";
            });
    }
    isBlanc = !isBlanc;
}

function capitalizeFirstLetter(word) {
    if (word.length === 0) {
        return word; // Si la chaîne est vide, retourne-la telle quelle
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
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

function abandonnerFunction(event) {
    event.preventDefault();
    let title = document.createElement('h1');
    titleContainer.style.display = 'block';
    title.textContent = 'Vous avez décidez de rejouer, une partie se relancera dans 1,5 secondes !';
    titleContainer.appendChild(title);
    setTimeout(function () {
        window.location.reload();
    }, 1500);
}

let Graph = (function () {

    let extractKeys = function (obj) {
        let keys = [], key;
        for (key in obj) {
            Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
        }
        return keys;
    }

    ////////////////////////////////////Code gitHub///////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    let sorter = function (a, b) {
        return parseFloat(a) - parseFloat(b);
    }

    let findPaths = function (map, start, end, infinity) {
        infinity = infinity || Infinity;

        let costs = {},
            open = { '0': [start] },
            predecessors = {},
            keys;

        let addToOpen = function (cost, vertex) {
            let key = "" + cost;
            if (!open[key]) open[key] = [];
            open[key].push(vertex);
        }

        costs[start] = 0;

        while (open) {
            if (!(keys = extractKeys(open)).length) break;

            keys.sort(sorter);

            let key = keys[0],
                bucket = open[key],
                node = bucket.shift(),
                currentCost = parseFloat(key),
                adjacentNodes = map[node] || {};

            if (!bucket.length) delete open[key];

            for (let vertex in adjacentNodes) {
                if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
                    let cost = adjacentNodes[vertex],
                        totalCost = cost + currentCost,
                        vertexCost = costs[vertex];

                    if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                        costs[vertex] = totalCost;
                        addToOpen(totalCost, vertex);
                        predecessors[vertex] = node;
                    }
                }
            }
        }

        if (costs[end] === undefined) {
            return null;
        } else {
            return predecessors;
        }

    }

    let extractShortest = function (predecessors, end) {
        let nodes = [],
            u = end;

        while (u !== undefined) {
            nodes.push(u);
            u = predecessors[u];
        }

        nodes.reverse();
        return nodes;
    }

    let findShortestPath = function (map, nodes) {
        let start = nodes.shift(),
            end,
            predecessors,
            path = [],
            shortest;

        while (nodes.length) {
            end = nodes.shift();
            predecessors = findPaths(map, start, end);

            if (predecessors) {
                shortest = extractShortest(predecessors, end);
                if (nodes.length) {
                    path.push.apply(path, shortest.slice(0, -1));
                } else {
                    return path.concat(shortest);
                }
            } else {
                return null;
            }

            start = end;
        }
    }

    let toArray = function (list, offset) {
        try {
            return Array.prototype.slice.call(list, offset);
        } catch (e) {
            let a = [];
            for (let i = offset || 0, l = list.length; i < l; ++i) {
                a.push(list[i]);
            }
            return a;
        }
    }

    let Graph = function (map) {
        this.map = map;
    }

    Graph.prototype.findShortestPath = function (start, end) {
        if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(this.map, start);
        } else if (arguments.length === 2) {
            return findShortestPath(this.map, [start, end]);
        } else {
            return findShortestPath(this.map, toArray(arguments));
        }
    }

    Graph.findShortestPath = function (map, start, end) {
        if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(map, start);
        } else if (arguments.length === 3) {
            return findShortestPath(map, [start, end]);
        } else {
            return findShortestPath(map, toArray(arguments, 1));
        }
    }

    return Graph;

})();

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

let matrice = {
    "Afghanistan": {
        "China": 1,
        "Iran": 1,
        "Pakistan": 1,
        "Tajikistan": 1,
        "Turkmenistan": 1,
        "Uzbekistan": 1
    },
    "Albania": {
        "Greece": 1,
        "Kosovo": 1,
        "Montenegro": 1,
        "North Macedonia": 1
    },
    "Algeria": {
        "Libya": 1,
        "Mali": 1,
        "Mauritania": 1,
        "Morocco": 1,
        "Niger": 1,
        "Tunisia": 1,
        "W. Sahara": 1
    },
    "Angola": {
        "Dem. Rep. Congo": 1,
        "Namibia": 1,
        "Congo": 1,
        "Zambia": 1
    },
    "Argentina": {
        "Bolivia": 1,
        "Brazil": 1,
        "Chile": 1,
        "Paraguay": 1,
        "Uruguay": 1
    },
    "Armenia": {
        "Azerbaijan": 1,
        "Georgia": 1,
        "Iran": 1,
        "Turkey": 1
    },
    "Austria": {
        "Czechia": 1,
        "Germany": 1,
        "Hungary": 1,
        "Italy": 1,
        "Slovakia": 1,
        "Slovenia": 1,
        "Switzerland": 1
    },
    "Azerbaijan": {
        "Armenia": 1,
        "Georgia": 1,
        "Iran": 1,
        "Russia": 1,
        "Turkey": 1
    },
    "Bangladesh": {
        "India": 1,
        "Myanmar": 1
    },
    "Belarus": {
        "Latvia": 1,
        "Lithuania": 1,
        "Poland": 1,
        "Russia": 1,
        "Ukraine": 1
    },
    "Belgium": {
        "France": 1,
        "Germany": 1,
        "Luxembourg": 1,
        "Netherlands": 1
    },
    "Belize": {
        "Guatemala": 1,
        "Mexico": 1
    },
    "Benin": {
        "Burkina Faso": 1,
        "Niger": 1,
        "Nigeria": 1,
        "Togo": 1
    },
    "Bhutan": {
        "China": 1,
        "India": 1
    },
    "Bolivia": {
        "Argentina": 1,
        "Brazil": 1,
        "Chile": 1,
        "Paraguay": 1,
        "Peru": 1
    },
    "Bosnia and Herz.": {
        "Croatia": 1,
        "Montenegro": 1,
        "Serbia": 1
    },
    "Botswana": {
        "Namibia": 1,
        "South Africa": 1,
        "Zambia": 1,
        "Zimbabwe": 1
    },
    "Brazil": {
        "France": 1,
        "Argentina": 1,
        "Bolivia": 1,
        "Colombia": 1,
        "Guyana": 1,
        "Paraguay": 1,
        "Peru": 1,
        "Suriname": 1,
        "Uruguay": 1,
        "Venezuela": 1,
        "France (French Guiana)": 1
    },
    "Brunei": {
        "Malaysia": 1
    },
    "Bulgaria": {
        "Greece": 1,
        "North Macedonia": 1,
        "Romania": 1,
        "Serbia": 1,
        "Turkey": 1
    },
    "Burkina Faso": {
        "Benin": 1,
        "Cote d'Ivoire": 1,
        "Ghana": 1,
        "Mali": 1,
        "Niger": 1,
        "Togo": 1
    },
    "Burundi": {
        "Dem. Rep. Congo": 1,
        "Rwanda": 1,
        "Tanzania": 1
    },
    "Cambodia": {
        "Laos": 1,
        "Thailand": 1,
        "Vietnam": 1
    },
    "Cameroon": {
        "cacan Republic": 1,
        "Chad": 1,
        "Congo": 1,
        "Equatorial Guinea": 1,
        "Gabon": 1,
        "Nigeria": 1
    },
    "Canada": {
        "United States of America": 1
    },
    "Central African Rep.": {
        "Cameroon": 1,
        "Chad": 1,
        "Dem. Rep. Congo": 1,
        "Congo": 1,
        "S. Sudan": 1,
        "Sudan": 1
    },
    "Chad": {
        "Cameroon": 1,
        "Central African Rep.": 1,
        "Libya": 1,
        "Niger": 1,
        "Nigeria": 1,
        "Sudan": 1
    },
    "Chile": {
        "Argentina": 1,
        "Bolivia": 1,
        "Peru": 1
    },
    "China": {
        "Afghanistan": 1,
        "Bhutan": 1,
        "India": 1,
        "Kazakhstan": 1,
        "Kyrgyzstan": 1,
        "Laos": 1,
        "Mongolia": 1,
        "Myanmar": 1,
        "Nepal": 1,
        "North Korea": 1,
        "Pakistan": 1,
        "Russia": 1,
        "Tajikistan": 1,
        "Vietnam": 1
    },
    "Colombia": {
        "Brazil": 1,
        "Ecuador": 1,
        "Panama": 1,
        "Peru": 1,
        "Venezuela": 1
    },
    "Dem. Rep. Congo": {
        "Angola": 1,
        "Burundi": 1,
        "Central African Rep.": 1,
        "Congo": 1,
        "Rwanda": 1,
        "S. Sudan": 1,
        "Tanzania": 1,
        "Uganda": 1,
        "Zambia": 1
    },
    "Congo": {
        "Angola": 1,
        "Cameroon": 1,
        "Central African Rep.": 1,
        "Dem. Rep. Congo": 1,
        "Gabon": 1
    },
    "Costa Rica": {
        "Nicaragua": 1,
        "Panama": 1
    },
    "Croatia": {
        "Bosnia and Herz.": 1,
        "Hungary": 1,
        "Montenegro": 1,
        "Serbia": 1,
        "Slovenia": 1
    },
    "Czechia": {
        "Austria": 1,
        "Germany": 1,
        "Poland": 1,
        "Slovakia": 1
    },
    "Denmark": {
        "Germany": 1
    },
    "Djibouti": {
        "Eritrea": 1,
        "Ethiopia": 1,
        "Somalia": 1
    },
    "East Timor": {
        "Indonesia": 1
    },
    "Ecuador": {
        "Colombia": 1,
        "Peru": 1
    },
    "Egypt": {
        "Israel": 1,
        "Libya": 1,
        "Sudan": 1
    },
    "El Salvador": {
        "Guatemala": 1,
        "Honduras": 1
    },
    "Equatorial Guinea": {
        "Cameroon": 1,
        "Gabon": 1
    },
    "Eritrea": {
        "Djibouti": 1,
        "Ethiopia": 1,
        "Sudan": 1
    },
    "Estonia": {
        "Latvia": 1,
        "Russia": 1
    },
    "eSwatini": {
        "Mozambique": 1,
        "South Africa": 1
    },
    "Ethiopia": {
        "Djibouti": 1,
        "Eritrea": 1,
        "Kenya": 1,
        "Somalia": 1,
        "S. Sudan": 1,
        "Sudan": 1
    },
    "Finland": {
        "Norway": 1,
        "Russia": 1,
        "Sweden": 1
    },
    "France": {
        "Suriname": 1,
        "Belgium": 1,
        "Germany": 1,
        "Italy": 1,
        "Luxembourg": 1,
        "Monaco": 1,
        "Spain": 1,
        "Switzerland": 1,
        "Brazil": 1
    },
    "Gabon": {
        "Cameroon": 1,
        "Equatorial Guinea": 1,
        "Congo": 1
    },
    "Gambia": {
        "Senegal": 1
    },
    "Georgia": {
        "Armenia": 1,
        "Azerbaijan": 1,
        "Russia": 1,
        "Turkey": 1
    },
    "Germany": {
        "Austria": 1,
        "Belgium": 1,
        "Czechia": 1,
        "Denmark": 1,
        "France": 1,
        "Luxembourg": 1,
        "Netherlands": 1,
        "Poland": 1,
        "Switzerland": 1
    },
    "Ghana": {
        "Burkina Faso": 1,
        "Cote d'Ivoire": 1,
        "Togo": 1
    },
    "Greece": {
        "Albania": 1,
        "Bulgaria": 1,
        "North Macedonia": 1,
        "Turkey": 1
    },
    "Guatemala": {
        "Belize": 1,
        "El Salvador": 1,
        "Honduras": 1,
        "Mexico": 1
    },
    "Guinea": {
        "Cote d'Ivoire": 1,
        "Guinea-Bissau": 1,
        "Liberia": 1,
        "Mali": 1,
        "Senegal": 1,
        "Sierra Leone": 1
    },
    "Guinea-Bissau": {
        "Guinea": 1,
        "Senegal": 1
    },
    "Guyana": {
        "Brazil": 1,
        "Suriname": 1,
        "Venezuela": 1
    },
    "Honduras": {
        "El Salvador": 1,
        "Guatemala": 1,
        "Nicaragua": 1
    },
    "Hungary": {
        "Austria": 1,
        "Croatia": 1,
        "Romania": 1,
        "Serbia": 1,
        "Slovakia": 1,
        "Slovenia": 1,
        "Ukraine": 1
    },
    "India": {
        "Bangladesh": 1,
        "Bhutan": 1,
        "China": 1,
        "Myanmar": 1,
        "Nepal": 1,
        "Pakistan": 1
    },
    "Indonesia": {
        "East Timor": 1,
        "Malaysia": 1,
        "Papua New Guinea": 1
    },
    "Iran": {
        "Afghanistan": 1,
        "Armenia": 1,
        "Azerbaijan": 1,
        "Iraq": 1,
        "Pakistan": 1,
        "Turkey": 1,
        "Turkmenistan": 1
    },
    "Iraq": {
        "Iran": 1,
        "Jordan": 1,
        "Kuwait": 1,
        "Saudi Arabia": 1,
        "Syria": 1,
        "Turkey": 1
    },
    "Israel": {
        "Egypt": 1,
        "Jordan": 1,
        "Lebanon": 1,
        "Syria": 1
    },
    "Italy": {
        "Austria": 1,
        "France": 1,
        "San Marino": 1,
        "Slovenia": 1,
        "Switzerland": 1,
    },
    "Jordan": {
        "Iraq": 1,
        "Israel": 1,
        "Saudi Arabia": 1,
        "Syria": 1
    },
    "Kazakhstan": {
        "China": 1,
        "Kyrgyzstan": 1,
        "Russia": 1,
        "Turkmenistan": 1,
        "Uzbekistan": 1
    },
    "Kenya": {
        "Ethiopia": 1,
        "Somalia": 1,
        "S. Sudan": 1,
        "Tanzania": 1,
        "Uganda": 1
    },
    "Kuwait": {
        "Iraq": 1,
        "Saudi Arabia": 1
    },
    "Kyrgyzstan": {
        "China": 1,
        "Kazakhstan": 1,
        "Tajikistan": 1,
        "Uzbekistan": 1
    },
    "Laos": {
        "Cambodia": 1,
        "China": 1,
        "Myanmar": 1,
        "Thailand": 1,
        "Vietnam": 1
    },
    "Latvia": {
        "Belarus": 1,
        "Estonia": 1,
        "Lithuania": 1,
        "Russia": 1
    },
    "Lebanon": {
        "Israel": 1,
        "Syria": 1
    },
    "Lesotho": {
        "South Africa": 1
    },
    "Liberia": {
        "Cote d'Ivoire": 1,
        "Guinea": 1,
        "Sierra Leone": 1
    },
    "Libya": {
        "Algeria": 1,
        "Chad": 1,
        "Egypt": 1,
        "Niger": 1,
        "Sudan": 1,
        "Tunisia": 1
    },
    "Lithuania": {
        "Belarus": 1,
        "Latvia": 1,
        "Poland": 1,
        "Russia": 1
    },
    "Luxembourg": {
        "Belgium": 1,
        "France": 1,
        "Germany": 1
    },
    "Malawi": {
        "Mozambique": 1,
        "Tanzania": 1,
        "Zambia": 1
    },
    "Malaysia": {
        "Brunei": 1,
        "Indonesia": 1,
        "Thailand": 1
    },
    "Mali": {
        "Algeria": 1,
        "Burkina Faso": 1,
        "Guinea": 1,
        "Ivory Coast": 1,
        "Mauritania": 1,
        "Niger": 1,
        "Senegal": 1
    },
    "Mauritania": {
        "Algeria": 1,
        "Mali": 1,
        "Senegal": 1,
        "W. Sahara": 1
    },
    "Mexico": {
        "Belize": 1,
        "Guatemala": 1,
        "United States of America": 1
    },
    "Moldova": {
        "Romania": 1,
        "Ukraine": 1
    },
    "Monaco": {
        "France": 1
    },
    "Mongolia": {
        "China": 1,
        "Russia": 1
    },
    "Montenegro": {
        "Albania": 1,
        "Bosnia and Herz.": 1,
        "Croatia": 1,
        "Kosovo": 1,
        "Serbia": 1
    },
    "Morocco": {
        "Algeria": 1,
        "W. Sahara": 1
    },
    "Mozambique": {
        "eSwatini": 1,
        "Malawi": 1,
        "South Africa": 1,
        "Tanzania": 1,
        "Zambia": 1,
        "Zimbabwe": 1
    },
    "Myanmar": {
        "Bangladesh": 1,
        "China": 1,
        "India": 1,
        "Laos": 1,
        "Thailand": 1
    },
    "Namibia": {
        "Angola": 1,
        "Botswana": 1,
        "South Africa": 1,
        "Zambia": 1
    },
    "Nepal": {
        "China": 1,
        "India": 1
    },
    "Netherlands": {
        "Belgium": 1,
        "Germany": 1
    },
    "Nicaragua": {
        "Costa Rica": 1,
        "Honduras": 1
    },
    "Niger": {
        "Algeria": 1,
        "Benin": 1,
        "Burkina Faso": 1,
        "Chad": 1,
        "Libya": 1,
        "Mali": 1,
        "Nigeria": 1
    },
    "Nigeria": {
        "Benin": 1,
        "Cameroon": 1,
        "Chad": 1,
        "Niger": 1
    },
    "North Korea": {
        "China": 1,
        "South Korea": 1,
        "Russia": 1
    },
    "North Macedonia": {
        "Albania": 1,
        "Bulgaria": 1,
        "Greece": 1,
        "Kosovo": 1,
        "Serbia": 1
    },
    "Norway": {
        "Finland": 1,
        "Russia": 1,
        "Sweden": 1
    },
    "Oman": {
        "Saudi Arabia": 1,
        "United Arab Emirates": 1,
        "Yemen": 1
    },
    "Pakistan": {
        "Afghanistan": 1,
        "China": 1,
        "India": 1,
        "Iran": 1
    },
    "Palestine": {
        "Israel": 1,
        "Jordan": 1
    },
    "Panama": {
        "Colombia": 1,
        "Costa Rica": 1
    },
    "Papua New Guinea": {
        "Indonesia": 1
    },
    "Paraguay": {
        "Argentina": 1,
        "Bolivia": 1,
        "Brazil": 1
    },
    "Peru": {
        "Bolivia": 1,
        "Brazil": 1,
        "Chile": 1,
        "Colombia": 1,
        "Ecuador": 1
    },
    "Poland": {
        "Belarus": 1,
        "Czechia": 1,
        "Germany": 1,
        "Lithuania": 1,
        "Russia": 1,
        "Slovakia": 1,
        "Ukraine": 1
    },
    "Portugal": {
        "Spain": 1
    },
    "Qatar": {
        "Saudi Arabia": 1
    },
    "Romania": {
        "Bulgaria": 1,
        "Hungary": 1,
        "Moldova": 1,
        "Serbia": 1,
        "Ukraine": 1
    },
    "Russia": {
        "Azerbaijan": 1,
        "Belarus": 1,
        "China": 1,
        "Estonia": 1,
        "Finland": 1,
        "Georgia": 1,
        "Kazakhstan": 1,
        "Latvia": 1,
        "Lithuania": 1,
        "Mongolia": 1,
        "North Korea": 1,
        "Norway": 1,
        "Poland": 1,
        "Ukraine": 1
    },
    "Rwanda": {
        "Burundi": 1,
        "Dem. Rep. Congo": 1,
        "Tanzania": 1,
        "Uganda": 1
    },
    "San Marino": {
        "Italy": 1
    },
    "Saudi Arabia": {
        "Iraq": 1,
        "Jordan": 1,
        "Kuwait": 1,
        "Oman": 1,
        "Qatar": 1,
        "United Arab Emirates": 1,
        "Yemen": 1
    },
    "Senegal": {
        "Gambia": 1,
        "Guinea": 1,
        "Guinea-Bissau": 1,
        "Mali": 1,
        "Mauritania": 1
    },
    "Serbia": {
        "Bosnia and Herz.": 1,
        "Bulgaria": 1,
        "Croatia": 1,
        "Hungary": 1,
        "Kosovo": 1,
        "Montenegro": 1,
        "North Macedonia": 1,
        "Romania": 1
    },
    "Sierra Leone": {
        "Guinea": 1,
        "Liberia": 1
    },
    "Slovakia": {
        "Austria": 1,
        "Czechia": 1,
        "Hungary": 1,
        "Poland": 1,
        "Ukraine": 1
    },
    "Slovenia": {
        "Austria": 1,
        "Croatia": 1,
        "Hungary": 1,
        "Italy": 1
    },
    "Somalia": {
        "Djibouti": 1,
        "Ethiopia": 1,
        "Kenya": 1
    },
    "South Africa": {
        "Botswana": 1,
        "eSwatini": 1,
        "Lesotho": 1,
        "Mozambique": 1,
        "Namibia": 1,
        "Zimbabwe": 1
    },
    "South Korea": {
        "North Korea": 1
    },
    "S. Sudan": {
        "Central African Rep.": 1,
        "Dem. Rep. Congo": 1,
        "Ethiopia": 1,
        "Kenya": 1,
        "Sudan": 1,
        "Uganda": 1
    },
    "Spain": {
        "France": 1,
        "Gibraltar": 1,
        "Portugal": 1
    },
    "Sudan": {
        "Central African Rep.": 1,
        "Chad": 1,
        "Egypt": 1,
        "Eritrea": 1,
        "Ethiopia": 1,
        "Libya": 1,
        "S. Sudan": 1
    },
    "Suriname": {
        "Brazil": 1,
        "French Guiana": 1,
        "Guyana": 1
    },
    "Sweden": {
        "Finland": 1,
        "Norway": 1
    },
    "Switzerland": {
        "Austria": 1,
        "France": 1,
        "Germany": 1,
        "Italy": 1,
    },
    "Syria": {
        "Iraq": 1,
        "Israel": 1,
        "Jordan": 1,
        "Lebanon": 1,
        "Turkey": 1
    },
    "Tajikistan": {
        "Afghanistan": 1,
        "China": 1,
        "Kyrgyzstan": 1,
        "Uzbekistan": 1
    },
    "Tanzania": {
        "Burundi": 1,
        "Dem. Rep. Congo": 1,
        "Kenya": 1,
        "Malawi": 1,
        "Mozambique": 1,
        "Rwanda": 1,
        "Uganda": 1,
        "Zambia": 1
    },
    "Thailand": {
        "Cambodia": 1,
        "Laos": 1,
        "Malaysia": 1,
        "Myanmar": 1
    },
    "Togo": {
        "Benin": 1,
        "Burkina Faso": 1,
        "Ghana": 1
    },
    "Tunisia": {
        "Algeria": 1,
        "Libya": 1
    },
    "Turkey": {
        "Armenia": 1,
        "Azerbaijan": 1,
        "Bulgaria": 1,
        "Georgia": 1,
        "Greece": 1,
        "Iran": 1,
        "Iraq": 1,
        "Syria": 1
    },
    "Turkmenistan": {
        "Afghanistan": 1,
        "Iran": 1,
        "Kazakhstan": 1,
        "Uzbekistan": 1
    },
    "Uganda": {
        "Dem. Rep. Congo": 1,
        "Kenya": 1,
        "Rwanda": 1,
        "S. Sudan": 1,
        "Tanzania": 1
    },
    "Ukraine": {
        "Belarus": 1,
        "Hungary": 1,
        "Moldova": 1,
        "Poland": 1,
        "Romania": 1,
        "Russia": 1,
        "Slovakia": 1
    },
    "United Arab Emirates": {
        "Oman": 1,
        "Saudi Arabia": 1
    },
    "United States of America": {
        "Canada": 1,
        "Mexico": 1
    },
    "Uruguay": {
        "Argentina": 1,
        "Brazil": 1
    },
    "Uzbekistan": {
        "Afghanistan": 1,
        "Kazakhstan": 1,
        "Kyrgyzstan": 1,
        "Tajikistan": 1,
        "Turkmenistan": 1
    },
    "Venezuela": {
        "Brazil": 1,
        "Colombia": 1,
        "Guyana": 1
    },
    "Vietnam": {
        "Cambodia": 1,
        "China": 1,
        "Laos": 1
    },
    "Yemen": {
        "Oman": 1,
        "Saudi Arabia": 1
    },
    "Zambia": {
        "Angola": 1,
        "Botswana": 1,
        "Dem. Rep. Congo": 1,
        "Malawi": 1,
        "Mozambique": 1,
        "Namibia": 1,
        "Tanzania": 1,
        "Zimbabwe": 1
    },
    "Zimbabwe": {
        "Botswana": 1,
        "Mozambique": 1,
        "South Africa": 1,
        "Zambia": 1
    },
    "W. Sahara": {
        "Morocco": 1,
        "Mauritania": 1,
        "Algeria": 1
    }
};




const borders = {
    "Afghanistan": ["China", "Iran", "Pakistan", "Tajikistan", "Turkmenistan", "Uzbekistan"],
    "Albania": ["Greece", "Kosovo", "Montenegro", "North Macedonia"],
    "Algeria": ["Libya", "Mali", "Mauritania", "Morocco", "Niger", "Tunisia", "W. Sahara"],
    "Angola": ["Dem. Rep. Congo", "Namibia", "Congo", "Zambia"],
    "Argentina": ["Bolivia", "Brazil", "Chile", "Paraguay", "Uruguay"],
    "Armenia": ["Azerbaijan", "Georgia", "Iran", "Turkey"],
    "Austria": ["Czechia", "Germany", "Hungary", "Italy", "Slovakia", "Slovenia", "Switzerland"],
    "Azerbaijan": ["Armenia", "Georgia", "Iran", "Russia", "Turkey"],
    "Bangladesh": ["India", "Myanmar"],
    "Belarus": ["Latvia", "Lithuania", "Poland", "Russia", "Ukraine"],
    "Belgium": ["France", "Germany", "Luxembourg", "Netherlands"],
    "Belize": ["Guatemala", "Mexico"],
    "Benin": ["Burkina Faso", "Niger", "Nigeria", "Togo"],
    "Bhutan": ["China", "India"],
    "Bolivia": ["Argentina", "Brazil", "Chile", "Paraguay", "Peru"],
    "Bosnia and Herz.": ["Croatia", "Montenegro", "Serbia"],
    "Botswana": ["Namibia", "South Africa", "Zambia", "Zimbabwe"],
    "Brazil": ["France", "Argentina", "Bolivia", "Colombia", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela", "France (French Guiana)"],
    "Brunei": ["Malaysia"],
    "Bulgaria": ["Greece", "North Macedonia", "Romania", "Serbia", "Turkey"],
    "Burkina Faso": ["Benin", "Côte d'Ivoire", "Ghana", "Mali", "Niger", "Togo"],
    "Burundi": ["Dem. Rep. Congo", "Rwanda", "Tanzania"],
    "Cambodia": ["Laos", "Thailand", "Vietnam"],
    "Cameroon": ["Central African Rep.", "Chad", "Congo", "Equatorial Guinea", "Gabon", "Nigeria"],
    "Canada": ["United States of America"],
    "Central African Rep.": ["Cameroon", "Chad", "Dem. Rep. Congo", "Congo", "S. Sudan", "Sudan"],
    "Chad": ["Cameroon", "Central African Rep.", "Libya", "Niger", "Nigeria", "Sudan"],
    "Chile": ["Argentina", "Bolivia", "Peru"],
    "China": ["Afghanistan", "Bhutan", "India", "Kazakhstan", "Kyrgyzstan", "Laos", "Mongolia", "Myanmar", "Nepal", "North Korea", "Pakistan", "Russia", "Tajikistan", "Vietnam"],
    "Colombia": ["Brazil", "Ecuador", "Panama", "Peru", "Venezuela"],
    "Dem. Rep. Congo": ["Angola", "Burundi", "Central African Rep.", "Congo", "Rwanda", "S. Sudan", "Tanzania", "Uganda", "Zambia"],
    "Congo": ["Angola", "Cameroon", "Central African Rep.", "Dem. Rep. Congo", "Gabon"],
    "Costa Rica": ["Nicaragua", "Panama"],
    "Croatia": ["Bosnia and Herz.", "Hungary", "Montenegro", "Serbia", "Slovenia"],
    "Czechia": ["Austria", "Germany", "Poland", "Slovakia"],
    "Denmark": ["Germany"],
    "Djibouti": ["Eritrea", "Ethiopia", "Somalia"],
    "East Timor": ["Indonesia"],
    "Ecuador": ["Colombia", "Peru"],
    "Egypt": ["Israel", "Libya", "Sudan"],
    "El Salvador": ["Guatemala", "Honduras"],
    "Equatorial Guinea": ["Cameroon", "Gabon"],
    "Eritrea": ["Djibouti", "Ethiopia", "Sudan"],
    "Estonia": ["Latvia", "Russia"],
    "eSwatini": ["Mozambique", "South Africa"],
    "Ethiopia": ["Djibouti", "Eritrea", "Kenya", "Somalia", "S. Sudan", "Sudan"],
    "Finland": ["Norway", "Russia", "Sweden"],
    "France": ["Suriname", "Belgium", "Germany", "Italy", "Luxembourg", "Monaco", "Spain", "Switzerland", "Brazil"],
    "Gabon": ["Cameroon", "Equatorial Guinea", "Congo"],
    "Gambia": ["Senegal"],
    "Georgia": ["Armenia", "Azerbaijan", "Russia", "Turkey"],
    "Germany": ["Austria", "Belgium", "Czechia", "Denmark", "France", "Luxembourg", "Netherlands", "Poland", "Switzerland"],
    "Ghana": ["Burkina Faso", "Côte d'Ivoire", "Togo"],
    "Greece": ["Albania", "Bulgaria", "North Macedonia", "Turkey"],
    "Guatemala": ["Belize", "El Salvador", "Honduras", "Mexico"],
    "Guinea": ["Côte d'Ivoire", "Guinea-Bissau", "Liberia", "Mali", "Senegal", "Sierra Leone"],
    "Guinea-Bissau": ["Guinea", "Senegal"],
    "Guyana": ["Brazil", "Suriname", "Venezuela"],
    "Honduras": ["El Salvador", "Guatemala", "Nicaragua"],
    "Hungary": ["Austria", "Croatia", "Romania", "Serbia", "Slovakia", "Slovenia", "Ukraine"],
    "India": ["Bangladesh", "Bhutan", "China", "Myanmar", "Nepal", "Pakistan"],
    "Indonesia": ["East Timor", "Malaysia", "Papua New Guinea"],
    "Iran": ["Afghanistan", "Armenia", "Azerbaijan", "Iraq", "Pakistan", "Turkey", "Turkmenistan"],
    "Iraq": ["Iran", "Jordan", "Kuwait", "Saudi Arabia", "Syria", "Turkey"],
    "Israel": ["Egypt", "Jordan", "Lebanon", "Syria"],
    "Italy": ["Austria", "France", "San Marino", "Slovenia", "Switzerland"],
    "Jordan": ["Iraq", "Israel", "Saudi Arabia", "Syria"],
    "Kazakhstan": ["China", "Kyrgyzstan", "Russia", "Turkmenistan", "Uzbekistan"],
    "Kenya": ["Ethiopia", "Somalia", "S. Sudan", "Tanzania", "Uganda"],
    "Kuwait": ["Iraq", "Saudi Arabia"],
    "Kyrgyzstan": ["China", "Kazakhstan", "Tajikistan", "Uzbekistan"],
    "Laos": ["Cambodia", "China", "Myanmar", "Thailand", "Vietnam"],
    "Latvia": ["Belarus", "Estonia", "Lithuania", "Russia"],
    "Lebanon": ["Israel", "Syria"],
    "Lesotho": ["South Africa"],
    "Liberia": ["Côte d'Ivoire", "Guinea", "Sierra Leone"],
    "Libya": ["Algeria", "Chad", "Egypt", "Niger", "Sudan", "Tunisia"],
    "Lithuania": ["Belarus", "Latvia", "Poland", "Russia"],
    "Luxembourg": ["Belgium", "France", "Germany"],
    "Malawi": ["Mozambique", "Tanzania", "Zambia"],
    "Malaysia": ["Brunei", "Indonesia", "Thailand"],
    "Mali": ["Algeria", "Burkina Faso", "Guinea", "Ivory Coast", "Mauritania", "Niger", "Senegal"],
    "Mauritania": ["Algeria", "Mali", "Senegal", "W. Sahara"],
    "Mexico": ["Belize", "Guatemala", "United States of America"],
    "Moldova": ["Romania", "Ukraine"],
    "Monaco": ["France"],
    "Mongolia": ["China", "Russia"],
    "Montenegro": ["Albania", "Bosnia and Herz.", "Croatia", "Kosovo", "Serbia"],
    "Morocco": ["Algeria", "W. Sahara"],
    "Mozambique": ["eSwatini", "Malawi", "South Africa", "Tanzania", "Zambia", "Zimbabwe"],
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
    "Poland": ["Belarus", "Czechia", "Germany", "Lithuania", "Russia", "Slovakia", "Ukraine"],
    "Portugal": ["Spain"],
    "Qatar": ["Saudi Arabia"],
    "Romania": ["Bulgaria", "Hungary", "Moldova", "Serbia", "Ukraine"],
    "Russia": ["Azerbaijan", "Belarus", "China", "Estonia", "Finland", "Georgia", "Kazakhstan", "Latvia", "Lithuania", "Mongolia", "North Korea", "Norway", "Poland", "Ukraine"],
    "Rwanda": ["Burundi", "Dem. Rep. Congo", "Tanzania", "Uganda"],
    "San Marino": ["Italy"],
    "Saudi Arabia": ["Iraq", "Jordan", "Kuwait", "Oman", "Qatar", "United Arab Emirates", "Yemen"],
    "Senegal": ["Gambia", "Guinea", "Guinea-Bissau", "Mali", "Mauritania"],
    "Serbia": ["Bosnia and Herz.", "Bulgaria", "Croatia", "Hungary", "Kosovo", "Montenegro", "North Macedonia", "Romania"],
    "Sierra Leone": ["Guinea", "Liberia"],
    "Slovakia": ["Austria", "Czechia", "Hungary", "Poland", "Ukraine"],
    "Slovenia": ["Austria", "Croatia", "Hungary", "Italy"],
    "Somalia": ["Djibouti", "Ethiopia", "Kenya"],
    "South Africa": ["Botswana", "eSwatini", "Lesotho", "Mozambique", "Namibia", "Zimbabwe"],
    "South Korea": ["North Korea"],
    "S. Sudan": ["Central African Rep.", "Dem. Rep. Congo", "Ethiopia", "Kenya", "Sudan", "Uganda"],
    "Spain": ["France", "Gibraltar", "Portugal"],
    "Sudan": ["Central African Rep.Central African Rep.", "Chad", "Egypt", "Eritrea", "Ethiopia", "Libya", "S. Sudan"],
    "Suriname": ["Brazil", "French Guiana", "Guyana"],
    "Sweden": ["Finland", "Norway"],
    "Switzerland": ["Austria", "France", "Germany", "Italy"],
    "Syria": ["Iraq", "Israel", "Jordan", "Lebanon", "Turkey"],
    "Tajikistan": ["Afghanistan", "China", "Kyrgyzstan", "Uzbekistan"],
    "Tanzania": ["Burundi", "Dem. Rep. Congo", "Kenya", "Malawi", "Mozambique", "Rwanda", "Uganda", "Zambia"],
    "Thailand": ["Cambodia", "Laos", "Malaysia", "Myanmar"],
    "Togo": ["Benin", "Burkina Faso", "Ghana"],
    "Tunisia": ["Algeria", "Libya"],
    "Turkey": ["Armenia", "Azerbaijan", "Bulgaria", "Georgia", "Greece", "Iran", "Iraq", "Syria"],
    "Turkmenistan": ["Afghanistan", "Iran", "Kazakhstan", "Uzbekistan"],
    "Uganda": ["Dem. Rep. Congo", "Kenya", "Rwanda", "S. Sudan", "Tanzania"],
    "Ukraine": ["Belarus", "Hungary", "Moldova", "Poland", "Romania", "Russia", "Slovakia"],
    "United Arab Emirates": ["Oman", "Saudi Arabia"],
    "United States of America": ["Canada", "Mexico"],
    "Uruguay": ["Argentina", "Brazil"],
    "Uzbekistan": ["Afghanistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"],
    "Venezuela": ["Brazil", "Colombia", "Guyana"],
    "Vietnam": ["Cambodia", "China", "Laos"],
    "Yemen": ["Oman", "Saudi Arabia"],
    "Zambia": ["Angola", "Botswana", "Dem. Rep. Congo", "Malawi", "Mozambique", "Namibia", "Tanzania", "Zimbabwe"],
    "Zimbabwe": ["Botswana", "Mozambique", "South Africa", "Zambia"],
    "W. Sahara": ["Morocco", "Mauritania", "Algeria"]
};



const paysFr = [
    "Afghanistan",
    "Albanie",
    "Algerie",
    "Angola",
    "Argentine",
    "Armenie",
    "Autriche",
    "Azerbaidjan",
    "Bangladesh",
    "Belarus",
    "Belgique",
    "Belize",
    "Benin",
    "Bhoutan",
    "Bolivie",
    "Bosnie-herzegovine",
    "Botswana",
    "Bresil",
    "Brunei",
    "Bulgarie",
    "Burkina faso",
    "Burundi",
    "Cambodge",
    "Cameroun",
    "Canada",
    "Republique centrafricaine",
    "Tchad",
    "Chili",
    "Chine",
    "Colombie",
    "Republique democratique du congo",
    "Congo",
    "Costa rica",
    "Croatie",
    "Republique tcheque",
    "Danemark",
    "Djibouti",
    "Timor oriental",
    "Equateur",
    "Egypte",
    "El salvador",
    "Guinee equatoriale",
    "erythree",
    "Estonie",
    "Eswatini",
    "Ethiopie",
    "Finlande",
    "France",
    "Gabon",
    "Gambie",
    "Georgie",
    "Allemagne",
    "Ghana",
    "Grece",
    "Guatemala",
    "Guinee",
    "Guinee-Bissau",
    "Guyana",
    "Honduras",
    "Hongrie",
    "Inde",
    "Indonesie",
    "Iran",
    "Irak",
    "Israel",
    "Italie",
    "Jordanie",
    "Kazakhstan",
    "Kenya",
    "Koweit",
    "Kirghizistan",
    "Laos",
    "Lettonie",
    "Liban",
    "Lesotho",
    "Liberia",
    "Libye",
    "Lituanie",
    "Luxembourg",
    "Malawi",
    "Malaisie",
    "Mali",
    "Mauritanie",
    "Mexique",
    "Moldavie",
    "Monaco",
    "Mongolie",
    "Montenegro",
    "Maroc",
    "Mozambique",
    "Myanmar",
    "Namibie",
    "Nepal",
    "Pays-Bas",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Coree du nord",
    "Macedoine du nord",
    "Norvege",
    "Oman",
    "Pakistan",
    "Palestine",
    "Panama",
    "Papouasie-nouvelle-Guinee",
    "Paraguay",
    "Perou",
    "Pologne",
    "Portugal",
    "Qatar",
    "Roumanie",
    "Russie",
    "Rwanda",
    "Saint-Marin",
    "Arabie saoudite",
    "Senegal",
    "Serbie",
    "Sierra leone",
    "Slovaquie",
    "Slovenie",
    "Somalie",
    "Afrique du sud",
    "Coree du sud",
    "Soudan du sud",
    "Espagne",
    "Soudan",
    "Suriname",
    "Suede",
    "Suisse",
    "Syrie",
    "Tadjikistan",
    "Tanzanie",
    "Thailande",
    "Togo",
    "Tunisie",
    "Turquie",
    "Turkmenistan",
    "Ouganda",
    "Ukraine",
    "Emirats arabes unis",
    "Etats-unis",
    "Uruguay",
    "Ouzbekistan",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambie",
    "Zimbabwe",
    "Sahara occidental"
];

// function CreationMatrice() {
//     lstKeys = Object.keys(borders);
//     for (let i = 0; i < lstKeys.length; i++) {
//         let ligne = Array.from({length:lstKeys.length}, () => Infinity);
//         borders[lstKeys[i]].forEach((elmt) =>  {
//             let cle = lstKeys.indexOf(elmt);
//             ligne[cle] = 1;
//         });
//         matrice.push(ligne);
//
//     }
// }


