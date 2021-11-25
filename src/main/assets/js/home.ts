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

  const csvOnClick = function(btn: HTMLButtonElement, uri: string) {
    return function() {
      btn.disabled = true;

      const innerHtml = btn.innerHTML;
      btn.innerHTML = '<div class="spinner"></div> Generating CSV ...';

      fetch(uri)
        .then(res => res.json())
        .then(json => {
          // Need to create link element to set the filename
          const link = document.createElement('a');
          link.download = json.filename;
          link.href = 'data:text/csv;charset=utf-8,' + json.csv;
          link.click();
          link.remove();

          // Add a 1s timeout to account for the download dialog to display
          setTimeout(() => {
            btn.innerHTML = innerHtml;
            btn.disabled = false;
          }, 1000);
        });
    };
  };

  // On download CSV button press, disable button and add loading spinner
  const activityCsvButton: HTMLButtonElement | null = getById('activityCsvBtn') as HTMLButtonElement;
  const searchesCsvButton: HTMLButtonElement | null = getById('searchesCsvBtn') as HTMLButtonElement;
  if (activityCsvButton) {
    activityCsvButton.onclick = csvOnClick(activityCsvButton, '/case-activity/csv');
  }
  if (searchesCsvButton) {
    searchesCsvButton.onclick = csvOnClick(searchesCsvButton, '/case-searches/csv');
  }

  // On pagination load, display grey overlay with loading spinner
  const loadingOverlay = document.getElementsByClassName('loading-overlay')[0] as HTMLDivElement;
  const paginationLinks = document.getElementsByClassName('pagination-link') as HTMLCollectionOf<HTMLAnchorElement>;
  if (paginationLinks && paginationLinks.length > 0) {
    for (const link of Array.from(paginationLinks)) {
      link.onclick = function () {
        // Set display to flex, this will revert back to none after page loads
        loadingOverlay.style.display = 'flex';
      };
    }
  }
}
