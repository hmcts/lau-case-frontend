import { getById } from './selectors';

const form = getById('case-search-form') as HTMLFormElement | null;
if (form) {
  // On search button click, disable button and fields until search is complete.
  // On search completion, the page will reload and re-enable the button and fields.
  const searchButton: HTMLButtonElement | null = document.getElementsByName('search-btn')[0] as HTMLButtonElement;
  if (searchButton) {
    searchButton.onclick = function() {
      searchButton.textContent = 'Searching...';
      searchButton.disabled = true;

      form.submit();

      const fieldset = form.getElementsByClassName('govuk-fieldset')[0] as HTMLFieldSetElement;
      fieldset.disabled = true;
    };
  }

}
