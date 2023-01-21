import { Octokit} from "https://cdn.skypack.dev/octokit";

const octokit = new Octokit()

const input = document.querySelector('.search__input');
const autocomplete = document.querySelector('.autocomplete');
const results = document.querySelector('.results');


async function updateAutocomplete(value) {
    const response = await octokit.request(`GET /search/repositories{?q,per_page}`, {q: value, per_page: 5})
    const data = response.data;

    autocomplete.innerHTML = '';

    data.items.map(el => {
      const item = document.createElement('li');
      item.classList.add('autocomplete__item');
      item.textContent = el.name;
      item.addEventListener('click', (e) => {
          const resultsItem = document.createElement('li');
          resultsItem.classList.add('results__item');
          const text = document.createElement('div');
          text.classList.add('text');
          const p1 = document.createElement('p');
          const p2 = document.createElement('p');
          const p3 = document.createElement('p');
          p1.textContent = `Name: ${el.name}`;
          p2.textContent = `Owner: ${el.owner.login}`;
          p3.textContent = `Stars: ${el.stargazers_count}`

          const delBtn = document.createElement('button');

          delBtn.classList.add('delete-btn');
          delBtn.textContent = 'x';
          delBtn.addEventListener('click', () => {
              results.removeChild(resultsItem);
          })
          text.appendChild(p1);
          text.appendChild(p2);
          text.appendChild(p3);

          resultsItem.appendChild(text);
          resultsItem.appendChild(delBtn);

          results.appendChild(resultsItem);

          input.value = '';
          autocomplete.innerHTML = '';
          autocomplete.style.display = 'none';
      })
      autocomplete.appendChild(item);
    })
}

function debounce(f, ms) {
    let timeout;

    return function(...args) {
        const fnCall = () => {f(...args)}
        clearTimeout(timeout)
        timeout = setTimeout(() => fnCall(), ms);
    };
}

const debouncedUpdateAutocomplete = debounce(updateAutocomplete, 600)



input.addEventListener('input', (e) => {
    if (e.target.value !== ''){
        debouncedUpdateAutocomplete(e.target.value)
        autocomplete.style.display = 'block';
    } else {
        autocomplete.innerHTML = '';
        autocomplete.style.display = 'none';
    }
})

