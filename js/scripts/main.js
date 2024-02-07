//slides
var slide_hero = new Swiper(".slide-hero", {
    effect: "fade",
    pagination: {
        el: ".slide-hero .main-area .area-explorer .swiper-pagination",
    },
});

//select

const btnDropDownSelect = document.querySelector(".item-selected");

btnDropDownSelect.addEventListener("click", () => {
    btnDropDownSelect.parentElement.classList.toggle("active");
});

//chamada api
const quantidadePokemon = document.querySelector(".quantidade-pokemons");
const listaPokemon = document.querySelector(".list");

function primeiraLetraMaiuscula(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function criarCardPokemon(name, code, imagem, tipo) {
    let card = document.createElement("button");
    card.classList = `card-pokemon ${tipo}`;
    card.setAttribute("code-pokemon", code);
    listaPokemon.appendChild(card);

    let image = document.createElement("div");
    image.classList = "image";
    card.appendChild(image);

    let imageSrc = document.createElement("img");
    imageSrc.classList = "imagePok";
    imageSrc.setAttribute("src", imagem);
    image.appendChild(imageSrc);

    let infoCard = document.createElement("div");
    infoCard.classList = "info";
    card.appendChild(infoCard);

    let infoText = document.createElement("div");
    infoText.classList = "text";
    infoCard.appendChild(infoText);

    let indexPokemon = document.createElement("span");
    indexPokemon.textContent =
        code < 10 ? `#00${code}` : code < 100 ? `#0${code}` : `${code}`;
    infoText.appendChild(indexPokemon);

    let namePokemon = document.createElement("h3");
    namePokemon.textContent = primeiraLetraMaiuscula(name);
    infoText.appendChild(namePokemon);

    let infoIcon = document.createElement("div");
    infoIcon.classList = "icon";
    infoCard.appendChild(infoIcon);

    let iconPokemon = document.createElement("img");
    iconPokemon.setAttribute("src", `img/icon-types/${tipo}.svg`);
    iconPokemon.setAttribute("alt", `${tipo}`);
    infoIcon.appendChild(iconPokemon);
}

function listaPokemons(urlApi) {
    axios({
        method: "GET",
        url: urlApi,
    }).then((response) => {
        const { results, next, count } = response.data;
        quantidadePokemon.innerText = count;

        results.forEach((pokemon) => {
            let urlDetalhes = pokemon.url;

            axios({
                method: "GET",
                url: `${urlDetalhes}`,
            }).then((res) => {
                const { name, id, sprites, types } = res.data;
                const infoCard = {
                    nome: name,
                    code: id,
                    image: sprites.other.dream_world.front_default,
                    tipo: types[0].type.name,
                };
                criarCardPokemon(
                    infoCard.nome,
                    infoCard.code,
                    infoCard.image,
                    infoCard.tipo
                );

                const cardPokemon = document.querySelectorAll(".card-pokemon");

                cardPokemon.forEach((card) => {
                    card.addEventListener("click", openPokemon);
                });
            });
        });
    });
}

listaPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");

//menu de filtros
const typeArea = document.querySelector(".typeArea");
const typeAreaMobile = document.querySelector(".dorpdown-select");

axios({
    method: "GET",
    url: "https://pokeapi.co/api/v2/type",
}).then((res) => {
    const { results } = res.data;

    results.forEach((type, index) => {
        if (index < 18) {
            let itemType = document.createElement("li");
            typeArea.appendChild(itemType);

            let buttonType = document.createElement("button");
            buttonType.classList = `type-filter ${type.name}`;
            buttonType.setAttribute("code-type", index + 1);
            itemType.appendChild(buttonType);

            let iconType = document.createElement("div");
            iconType.classList = `icon`;
            buttonType.appendChild(iconType);

            let srcTyper = document.createElement("img");
            srcTyper.setAttribute("src", `img/icon-types/${type.name}.svg`);
            iconType.appendChild(srcTyper);

            let nameType = document.createElement("span");
            nameType.textContent = primeiraLetraMaiuscula(`${type.name}`);
            buttonType.appendChild(nameType);

            //mobile

            let itemTypeMobile = document.createElement("li");
            typeAreaMobile.appendChild(itemTypeMobile);

            let buttonTypeMobile = document.createElement("button");
            buttonTypeMobile.classList = `type-filter ${type.name}`;
            buttonTypeMobile.setAttribute("code-type", index + 1);
            itemTypeMobile.appendChild(buttonTypeMobile);

            let iconTypeMobile = document.createElement("div");
            iconTypeMobile.classList = `icon`;
            buttonTypeMobile.appendChild(iconTypeMobile);

            let srcTyperMobile = document.createElement("img");
            srcTyperMobile.setAttribute(
                "src",
                `img/icon-types/${type.name}.svg`
            );
            iconTypeMobile.appendChild(srcTyperMobile);

            let nameTypeMobile = document.createElement("span");
            nameTypeMobile.textContent = primeiraLetraMaiuscula(`${type.name}`);
            buttonTypeMobile.appendChild(nameTypeMobile);

            const allTypes = document.querySelectorAll(".type-filter");
            allTypes.forEach((btn) => {
                btn.addEventListener("click", filterByTypes);
            });
        }
    });
});

//Carregar mais pokemons
const btnLoadMore = document.querySelector(".btn-load-more");
let paginationPokemon = 10;

function showMorePokemon() {
    listaPokemons(
        `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${paginationPokemon}`
    );
    paginationPokemon = paginationPokemon + 9;
}

btnLoadMore.addEventListener("click", showMorePokemon);

//Filtrar pokemons por tipos

function filterByTypes() {
    let idPokemon = this.getAttribute("code-type");

    const areaPokemons = document.querySelector(".list");
    const allTypes = document.querySelectorAll(".type-filter");
    const sectionPokemon = document.querySelector(".area-all");

    areaPokemons.innerHTML = "";
    btnLoadMore.style.display = "none";

    const topSection = sectionPokemon.offsetTop;
    window.scrollTo({
        top: topSection + 288,
        behavior: "smooth",
    });

    allTypes.forEach((type) => {
        type.classList.remove("active");
    });

    this.classList.add("active");

    if (idPokemon) {
        axios({
            method: "GET",
            url: `https://pokeapi.co/api/v2/type/${idPokemon}`,
        }).then((res) => {
            const { pokemon } = res.data;
            quantidadePokemon.textContent = pokemon.length;

            pokemon.forEach((pok) => {
                const { url } = pok.pokemon;
                axios({
                    method: "GET",
                    url: `${url}`,
                }).then((res) => {
                    const { name, id, sprites, types } = res.data;
                    const infoCard = {
                        nome: name,
                        code: id,
                        image: sprites.other.dream_world.front_default,
                        tipo: types[0].type.name,
                    };

                    if (infoCard.image) {
                        criarCardPokemon(
                            infoCard.nome,
                            infoCard.code,
                            infoCard.image,
                            infoCard.tipo
                        );
                    }

                    const cardPokemon =
                        document.querySelectorAll(".card-pokemon");

                    cardPokemon.forEach((card) => {
                        card.addEventListener("click", openPokemon);
                    });
                });
            });
        });
    } else {
        areaPokemons.innerHTML = "";
        btnLoadMore.style.display = "block";
        listaPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");
    }
}

//Pesquisa do pokemon
const btnSearch = document.querySelector(".btn-search");
const inputSearch = document.querySelector(".input-search");
const areaPokemons = document.querySelector(".list");
btnSearch.addEventListener("click", searchPokemon);
inputSearch.addEventListener("keyup", (e) => {
    if (e.code == "Enter") {
        searchPokemon();
    }
});

function searchPokemon() {
    const allTypes = document.querySelectorAll(".type-filter");
    let valueInput = inputSearch.value.toLowerCase();

    allTypes.forEach((type) => {
        type.classList.remove("active");
    });

    axios({
        method: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`,
    })
        .then((res) => {
            areaPokemons.innerHTML = "";
            btnLoadMore.style.display = "none";
            quantidadePokemon.textContent = 1;

            const { name, id, sprites, types } = res.data;
            const infoCard = {
                nome: name,
                code: id,
                image: sprites.other.dream_world.front_default,
                tipo: types[0].type.name,
            };

            if (infoCard.image) {
                criarCardPokemon(
                    infoCard.nome,
                    infoCard.code,
                    infoCard.image,
                    infoCard.tipo
                );
            }

            const cardPokemon = document.querySelectorAll(".card-pokemon");

            cardPokemon.forEach((card) => {
                card.addEventListener("click", openPokemon);
            });
        })
        .catch((error) => {
            areaPokemons.innerHTML = "";
            btnLoadMore.style.display = "none";
            quantidadePokemon.textContent = 0;
            alert("Não foi possivel encontrar um resultado");
        });
}

//card

const btnClosePokemon = document.querySelector(".close");

function openPokemon() {
    document.documentElement.classList.add("open-modal");
    let imagePok = this.querySelector(".imagePok");
    let iconPok = this.querySelector(".info .icon img");
    let namePok = this.querySelector(".info h3");
    let codePok = this.querySelector(".info span");
    let imageModal = document.querySelector(".image-modal");
    let codePokemon = this.getAttribute("code-pokemon");
    const modalDetails = document.querySelector(".box");
    const iconModal = document.querySelector(".icon-modal");
    const nomeModal = document.querySelector(".name-modal");
    const codeModal = document.querySelector(".code-modal");
    const heightPokemon = document.querySelector(".height-pok");
    const weightPokemon = document.querySelector(".weight-pok");
    const abilitiesPokemon = document.querySelector(".abilities-pok");
    imageModal.setAttribute("src", imagePok.getAttribute("src"));
    iconModal.setAttribute("src", iconPok.getAttribute("src"));
    nomeModal.textContent = namePok.textContent;
    codeModal.textContent = codePok.textContent;

    modalDetails.setAttribute("type-pokemon-modal", this.classList[1]);

    axios({
        method: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`,
    }).then((res) => {
        let data = res.data;

        let infoPokemon = {
            mainAbilities: primeiraLetraMaiuscula(
                data.abilities[0].ability.name
            ),
            types: data.types,
            weight: data.weight,
            height: data.height,
            abilities: data.abilities,
            stats: data.stats,
            urlType: data.types[0].type.url,
        };

        function listingTypesPokemon() {
            const typeArea = document.querySelector(".type");
            typeArea.innerHTML = "";
            let arraytypes = infoPokemon.types;

            arraytypes.forEach((item) => {
                let itemList = document.createElement("li");
                typeArea.appendChild(itemList);

                let spanList = document.createElement("span");
                spanList.classList = `tag-type ${item.type.name}`;
                spanList.textContent = primeiraLetraMaiuscula(item.type.name);
                itemList.appendChild(spanList);
            });
        }

        function listingWeaknesses() {
            const areaWeak = document.querySelector(".area-weak");
            areaWeak.innerHTML = "";

            axios ({
                method: 'GET',
                url: `${infoPokemon.urlType}`
            }).then(res => {
                let fraquesas = res.data.damage_relations.double_damage_from

                    fraquesas.forEach((item) => {
                    let itemListWek = document.createElement("li");
                    areaWeak.appendChild(itemListWek);
    
                    let spanList = document.createElement("span");
                    spanList.classList = `tag-type ${item.name}`;
                    spanList.textContent = primeiraLetraMaiuscula(item.name);
                    itemListWek.appendChild(spanList);
                });
            })

            
        }

        const statsHP = document.querySelector('.hp')
        statsHP.style.width = `${infoPokemon.stats[0].base_stat}%`

        const statsAttack = document.querySelector('.attack')
        statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`

        const statsDefense = document.querySelector('.defense')
        statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`

        const statsSpAttack = document.querySelector('.sp-attack')
        statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`

        const statsSpDefense = document.querySelector('.sp-defense')
        statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`

        const statsSpeed = document.querySelector('.speed')
        statsAttack.style.width = `${infoPokemon.stats[5].base_stat}%`



        heightPokemon.textContent = `${infoPokemon.height / 10} m`;
        weightPokemon.textContent = `${infoPokemon.weight / 10} kg`;
        abilitiesPokemon.textContent = infoPokemon.mainAbilities;

        listingTypesPokemon();
        listingWeaknesses()
    });
}

function closePokemon() {
    document.documentElement.classList.remove("open-modal");
}

btnClosePokemon.addEventListener("click", closePokemon);
