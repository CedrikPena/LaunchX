const pokemonNameInput = document.getElementById('pokemon-name');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonNumberName = document.getElementById('pokemon-number-name');
const pokemonHeight = document.getElementById('height');
const pokemonWeight = document.getElementById('weight');
const pokemonTypes = document.getElementById('pokemon-types');
const pokemonWeakness = document.getElementById('pokemon-weakness');
const pokemonStats = document.getElementById('pokemon-stats');
const pokemonMoves = document.getElementById('pokemon-moves');

const fetchPokemon = () => {
    let pokemon_name = pokemonNameInput.value;
    pokemon_name = pokemon_name.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon_name}`;

    fetch(url).then( (res) => {
        if(res.status != 200){
            console.log(res);
            pokemonImageChange('Images/sad-pikachu.gif');
            pokemonNumberName.innerHTML = "Pokemon Not Found!"
        } else {
            return res.json();
        }
    }).then( (data) => {
        if(data) {
            //Get the pokemon offical artwork from the API
            pokemonImageChange(data.sprites.other["official-artwork"].front_default);
            //Get the pokemon height and weight and format it to Meters and Kilograms respectevely
            height_format = data.height / 10;
            weight_format = data.weight / 10;
            pokemonHeight.innerHTML = height_format.toLocaleString('en-IN', {style: 'unit', unit: 'meter'});
            pokemonWeight.innerHTML = weight_format.toLocaleString('en-IN', {style: 'unit', unit: 'kilogram'})
            //Format the pokemon index to three digits
            formatted_index = formatToThreeDigits(data.id, 3);
            //Concat pokemon pokedex number with name
            pokemonNumberName.innerHTML = "#" + formatted_index + " - " + data.name;
            pokemonTypes.innerHTML = "<h1> Type: </h1>";
            //traverse and add the pokemon types to the pokemon types html
            data.types.forEach( (types) => {
                pokemonTypes.innerHTML += '<p id="' + types.type.name + '">' + types.type.name + '</p>';
                pokemonWeakness.innerHTML = "<h1> Debilidades: </h1>"
                fetchPokemonWeakness(types.type.url);
            });
            //traverse and add the pokemon stats to the pokemon types html
            pokemonStats.innerHTML = '';
            data.stats.forEach( (stats) => {
                pokemonStats.innerHTML += '<div class="pokemon-stats-card"> <h3> ' + stats.stat.name + ': </h3> ' + '<p> ' + stats.base_stat + ' </p> </div>';
            });
            console.log(data.moves);
            pokemonMoves.innerHTML = '<h1> Possible learned moves: </h1>';
            data.moves.forEach( (moves) => {
                if( moves.version_group_details[moves.version_group_details.length-1].level_learned_at != 0){
                    pokemonMoves.innerHTML += '<div class="pokemon-move-card">' 
                    +'<h2> Name </h2> <p>' + moves.move.name + '</p>'
                    + '<h2> Level learned at: </h2> <p> ' + moves.version_group_details[moves.version_group_details.length-1].level_learned_at + '</p>'
                    + '<h2> Move Learned Method: </h2> <p> ' + moves.version_group_details[moves.version_group_details.length-1].move_learn_method.name + '</p>'
                    + '</div>';
                }
            });
        }
    });
}

const pokemonImageChange = (url) => {
    pokemonImage.src = url;
}

const fetchPokemonWeakness = (typeUrl) => {

    fetch(typeUrl).then( (res) => {
        if(res.status != 200){
            console.log(res);
            alert("Couldn't return pokemon weakness types");
        } else {
            return res.json();
        }
    }).then( (type) => {
        type.damage_relations.double_damage_from.forEach( (weakness) => {
            pokemonWeakness.innerHTML += '<p id="' + weakness.name + '"> ' + weakness.name + '</p>'
        });
    });
}

function formatToThreeDigits(value, padding) {
    var zeroes = new Array(padding+1).join("0");
    return (zeroes + value).slice(-padding);
}