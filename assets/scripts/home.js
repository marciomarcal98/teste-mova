let filterOneValue = 'name';
let filterTwoValue = '';

const Select = {
  chooseFilterOne(value) {
    filterOneValue = value;
    if(value === 'region') this.createRegionSelect();
    if(value === 'lang') this.createLanguageSelect();
    if(value === 'capital') this.createCapitalSelect();
    if(value === 'name') this.createCountrySelect();
    if(value === 'callingcode') this.createCallingCodeSelect();
  },

  chooseFilterTwo(value) {
    filterTwoValue = value;
  },

  createRegionSelect() {
    let filter = document.querySelector('.filter');
    let select = document.querySelector('#filter-two');

    filter.querySelector('span').innerHTML = 'Região';
    select.innerHTML = '<option value="" selected disabled>Escolha uma opção</option>';

    for(let i in regions) {
      select.innerHTML += `<option value="${regions[i].id}">${regions[i].name}</option>`;
    }

    filter.style.display = 'flex';
  },

  createLanguageSelect() {
    let filter = document.querySelector('.filter');
    let select = document.querySelector('#filter-two');

    filter.querySelector('span').innerHTML = 'Língua';
    select.innerHTML = '<option value="" selected disabled>Escolha uma opção</option>';

    for(let i in lang) {
      select.innerHTML += `<option value="${lang[i].code}">${lang[i].name}</option>`;
    }

    filter.style.display = 'flex';
  },

  createCapitalSelect() {
    let filter = document.querySelector('.filter');
    let select = document.querySelector('#filter-two');
    const url = 'https://restcountries.eu/rest/v2/all?fields=capital';

    filter.querySelector('span').innerHTML = 'Capital';
    select.innerHTML = '<option value="" selected disabled>Escolha uma opção</option>';

    fetch(url).then((r) => r.json()).then((json) => {
      for(let i in json) {
        if(json[i].capital !== "") {
          select.innerHTML += `<option value="${json[i].capital}">${json[i].capital}</option>`;
        }
      }
    })

    filter.style.display = 'flex';
  },

  createCountrySelect() {
    let filter = document.querySelector('.filter');
    let select = document.querySelector('#filter-two');
    const url = 'https://restcountries.eu/rest/v2/all?fields=name;alpha3Code';

    filter.querySelector('span').innerHTML = 'País';
    select.innerHTML = '<option value="" selected disabled>Escolha uma opção</option>';

    fetch(url).then((r) => r.json()).then((json) => {
      for(let i in json) {
        select.innerHTML += `<option value="${json[i].name}">${json[i].name}</option>`;
      }
    })

    filter.style.display = 'flex';
  },

  createCallingCodeSelect() {
    let filter = document.querySelector('.filter');
    let select = document.querySelector('#filter-two');
    const url = 'https://restcountries.eu/rest/v2/all?fields=callingCodes';

    filter.querySelector('span').innerHTML = 'Código de Ligação';
    select.innerHTML = '<option value="" selected disabled>Escolha uma opção</option>';

    fetch(url).then((r) => r.json()).then((json) => {
      for(let i in json) {
        for(let j in json[i].callingCodes) {
          if(json[i].callingCodes[j] !== "") {
            select.innerHTML += `<option value="${json[i].callingCodes[j]}">${json[i].callingCodes[j]}</option>`;
          }
        }
      }
    })

    filter.style.display = 'flex';
  },

  async filterResults() {

    const url = `https://restcountries.eu/rest/v2/${filterOneValue}/${filterTwoValue}`;

    const result = await Connections.connectToApi(url);

    let resultsSize = Slider.createHomeSlider(result);

    Pagination.createPagination(resultsSize);
  }
}

const Navigation = {
  goBack() {
    Screens.showScreenOne();
  }
}

const Information = {
  async countryInformation(code) {
    let url = `https://restcountries.eu/rest/v2/alpha/${code}`
    let result = await Connections.connectToApi(url);
    let informations = document.querySelector('.country-informations');
    let lang = '';
    let count = result.languages.length;

    document.querySelector('.country-flag img').src = result.flag;
    informations.querySelector('#country-name').innerHTML = `Nome: ${result.name}`;
    informations.querySelector('#country-capital').innerHTML = `Capital: ${result.capital}`;
    informations.querySelector('#country-region').innerHTML = `Região: ${result.region}`;
    informations.querySelector('#country-subregion').innerHTML = `Sub-região: ${result.subregion}`;
    informations.querySelector('#country-population').innerHTML = `População: ${result.population}`;

    for(let i = 0; i < count; i++) {
      if((count - 1) === i) {
        lang += `${result.languages[i].name}`
      } else {
        lang += `${result.languages[i].name} `
      }
    }

    informations.querySelector('#country-lang').innerHTML = `Línguas: ${lang.replaceAll(' ', ', ')}`

    let resultsSize = await Slider.neighborsSlider(result.borders);

    Pagination.createPaginationNeighbors(resultsSize);

    await Screens.showScreenTwo();
  },
}

const Screens = {
  showScreenOne() {
    document.querySelector('main.screen-one').style.display = 'block';
    document.querySelector('.footer-one').style.display = 'block';
    document.querySelector('main.screen-two').style.display = 'none';
    document.querySelector('.footer-two').style.display = 'none';
    document.querySelector('.header-right').style.display = 'none';
  },

  showScreenTwo() {
    document.querySelector('main.screen-one').style.display = 'none';
    document.querySelector('.footer-one').style.display = 'none';
    document.querySelector('main.screen-two').style.display = 'block';
    document.querySelector('.footer-two').style.display = 'block';
    document.querySelector('.header-right').style.display = 'block';
  }
}

const Connections = {
  async firstConnect() {
    const url = 'https://restcountries.eu/rest/v2/all?fields=flag;alpha3Code';

    const country = await this.connectToApi(url);

    let resultsSize = Slider.createHomeSlider(country);
    
    Pagination.createPagination(resultsSize);
  },

  connectToApi(url) {
    let json = fetch(url).then((r) => r.json()).then((json) => {
      return json;
    })

    return json;
  }
}

const Slider = {
  createHomeSlider(country) {
    let results = document.querySelector('.results');
    results.innerHTML = "";
    results.style.marginLeft = '0';
    let resultsSize = 0;
    let i = 0;
    let divCount = 0; 

    while(i < country.length) {
      if(country[i]) {
        if(divCount === 0) {
          var newDiv = document.createElement('div');
          newDiv.classList.add('container-imgs');
          results.appendChild(newDiv);
          newDiv.innerHTML += `<div class="result-img" onclick="Information.countryInformation('${country[i].alpha3Code}')">
            <img src="${country[i].flag}" alt="">
          </div>`
        } else {
          newDiv.innerHTML += `<div class="result-img" onclick="Information.countryInformation('${country[i].alpha3Code}')">
              <img src="${country[i].flag}" alt="">
            </div>`
        }
      }

      i++;
      divCount++;

      if(divCount == 12) {
        divCount = 0;
        resultsSize++;
      }
    }

    if(divCount > 0) {
      resultsSize++;
    }

    results.style.width = `calc(1140px * ${(resultsSize)})`;

    return resultsSize;
  },

  async neighborsSlider(borders) {
    let flagsAndCode = [];
    let results = document.querySelector('.results--screen-two');
    let resultsSize = 0;
    let i = 0;
    let divCount = 0; 

    for(let i in borders) {
      let url = `https://restcountries.eu/rest/v2/alpha/${borders[i]}`
      await fetch(url).then((r) => r.json()).then((json) => {
        let resultJson = {
          code: json.alpha3Code,
          flag: json.flag
        }

        flagsAndCode.push(resultJson);
      })
    }

    results.innerHTML = "";
    results.style.marginLeft = '0';

    while(i < flagsAndCode.length) {
      if(flagsAndCode[i]) {
        if(divCount === 0) {
          var newDiv = document.createElement('div');
          newDiv.classList.add('container-imgs');
          results.appendChild(newDiv);
          newDiv.innerHTML += `<div class="result-img" onclick="Information.countryInformation('${flagsAndCode[i].code}')">
            <img src="${flagsAndCode[i].flag}" alt="">
          </div>`
        } else {
          newDiv.innerHTML += `<div class="result-img" onclick="Information.countryInformation('${flagsAndCode[i].code}')">
              <img src="${flagsAndCode[i].flag}" alt="">
            </div>`
        }
      }

      i++;
      divCount++;

      if(divCount == 6) {
        divCount = 0;
        resultsSize++;
      }
    }

    if(divCount > 0) {
      resultsSize++;
    }

    results.style.width = `calc(1140px * ${(resultsSize)})`;

    return resultsSize;
  }
}

const Pagination = {
  createPagination(size) {
    let i = 0;
    let resultsNumbers = document.querySelector('.result-pagination--numbers');
    resultsNumbers.innerHTML = `<div class="result-pagination--number number1 selected" onclick="Pagination.goToSlide(0)">1</div>`

    while(i < (size - 1)) {
      resultsNumbers.innerHTML += `<div class="result-pagination--number number${i+2}" onclick="Pagination.goToSlide(${(i+1) * -1})">${i+2}</div>`
      i++;
    }
  },

  goToSlide(value) {
    document.querySelector('.result-pagination--number.selected').classList.remove('selected');
    document.querySelector('.results').style.marginLeft = `calc(1140px * ${value})`
    document.querySelector(`.number${(value * -1) + 1}`).classList.add('selected');
  },

  goNext() {
    let page = parseInt(document.querySelector('.result-pagination--number.selected').textContent);
    let pixels = 1140 * ((page * -1) + 1);

    if(document.querySelector(`.number${page + 1}`)) {
      document.querySelector('.results').style.marginLeft = `${pixels - 1140}px`
      document.querySelector('.result-pagination--number.selected').classList.remove('selected');
      document.querySelector(`.number${page + 1}`).classList.add('selected');
    }
  },
  
  goPrev() {
    let page = parseInt(document.querySelector('.result-pagination--number.selected').textContent);
    if(page == 1) {
      return;
    } else {
      let pixels = 1140 * ((page * -1) + 1);
      document.querySelector('.results').style.marginLeft = `${pixels + 1140}px`
      document.querySelector('.result-pagination--number.selected').classList.remove('selected');
      document.querySelector(`.number${page - 1}`).classList.add('selected');
    }
  },

  createPaginationNeighbors(size) {
    let i = 0;
    let resultsNumbers = document.querySelector('.result-pagination--numbers-two');
    resultsNumbers.innerHTML = `<div class="result-pagination--number-two number1 selected" onclick="Pagination.goToSlideNeighbors(0)">1</div>`

    while(i < (size - 1)) {
      resultsNumbers.innerHTML += `<div class="result-pagination--number-two number${i+2}" onclick="Pagination.goToSlideNeighbors(${(i+1) * -1})">${i+2}</div>`
      i++;
    }
  },

  goToSlideNeighbors(value) {
    document.querySelector('.result-pagination--number-two.selected').classList.remove('selected');
    document.querySelector('.results--screen-two').style.marginLeft = `calc(1140px * ${value})`
    document.querySelector(`.result-pagination--number-two.number${(value * -1) + 1}`).classList.add('selected');
  },

  goNextNeighbors() {
    let page = parseInt(document.querySelector('.result-pagination--number-two.selected').textContent);
    let pixels = 1140 * ((page * -1) + 1);

    if(document.querySelector(`.result-pagination--number-two.number${page + 1}`)) {
      document.querySelector('.results--screen-two').style.marginLeft = `${pixels - 1140}px`
      document.querySelector('.result-pagination--number-two.selected').classList.remove('selected');
      document.querySelector(`.result-pagination--number-two.number${page + 1}`).classList.add('selected');
    }
  },
  
  goPrevNeighbors() {
    let page = parseInt(document.querySelector('.result-pagination--number-two.selected').textContent);
    if(page == 1) {
      return;
    } else {
      let pixels = 1140 * ((page * -1) + 1);
      document.querySelector('.results--screen-two').style.marginLeft = `${pixels + 1140}px`
      document.querySelector('.result-pagination--number-two.selected').classList.remove('selected');
      document.querySelector(`.result-pagination--number-two.number${page - 1}`).classList.add('selected');
    }
  },
}

const App = {
  init() {
    Connections.firstConnect();
  }
}

App.init();