# Custom Data Parser
## Simple Data Parser for fetching table

Data parser is built on top of puppeteer and jsdom for custom element selector.

## Features

- Page Limit
- custom table or list row selector
- custom table area selector 
- Work for both SPA and server side rendering.

Data Parser is a lightweight markup language based on the puppeteer

## Tech
Data Parser uses a number of open source projects to work properly:

- [puppeteer] - Puppeteer!
- [JSDOM] - awesome light weight html parser

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v14+ to run.

Clone the git repo and start the server.

```sh
cd data-parser-nodejs
npm i
npm start
```

## Development

Want to contribute? Great!

### Example


For Simple Site Scraping:

```html
<tr>
   <td>1</td>
   <td class="text-left">12334</td>
   <td class="text-left" title="ProgressiveFinance Limited">TEST</td>
   <td class="text-right" title="TEST NAME"> 38 </td>
   <td class="text-right" title="Shree Krishna Securities Ltd."> 28 </td>
   <td class="text-right">11,100</td>
   <td class="text-right">11,523.00</td>
   <td class="text-right">52,11,300.00</td>
</tr>
```

```javascript

// rowTableSelectorFunc:  
 // it is the function to pass in CommonPage.
 // it gives you the current row data or div element and you should select which element should be returned in form of object.
 // in this example. the parameters 'data' give you the current dom in form of string.
 // it is then parsed by JSDOM element and returned as a nodelist element.
// in this example we got data from parameters as above html element.
// so we can select the format of the data we want.

function rowTableSelectorFunc(data) {
        const dom = JSDOM.fragment(data);
        const { textContent: contractTextContent } = dom.querySelector('td:nth-child(2)');
        const { textContent: companyNameTextContent, title: companyFullName } = dom.querySelector('td:nth-child(3)');
        const { textContent: buyerBroker } = dom.querySelector('td:nth-child(4)');
        const { textContent: sellerBroker } = dom.querySelector('td:nth-child(5)');
        const { textContent: quantity } = dom.querySelector('td:nth-child(6)');
        const { textContent: rate } = dom.querySelector('td:nth-child(7)');
        const { textContent: amount } = dom.querySelector('td:nth-child(8)');

        return {
            contractNumber: contractTextContent,
            symbol: companyNameTextContent,
            companyName: companyFullName,
            buyerBroker,
            sellerBroker,
            quantity,
            rate,
            amount,
        };
    }

// import the CommonPage and initialize it. 
// pageRoute : Page Route you want to fetch
// dataArea: Div area you want to wait and load first.
// dataTextArea: table area you want to fetch. It is generally list of div. i.e. table, List
// pageLimit: Limit page while fetching.
// nextPageLink: Generally the link which should be click while fetching additional data.

const floorsheetParser = new CommonPage(
        {
            pageRoute: 'https://newweb.nepalstock.com.np/floor-sheet',
            dataArea: 'body > app-root > div > main > div > app-floor-sheet > div > div.table-responsive > table > tbody',
            dataTableArea: 'body > app-root > div > main > div > app-floor-sheet > div > div.table-responsive > table > tbody',
            nextPage: null,
            pageLimit: 1,
            nextPageLink: 'body > app-root > div > main > div > app-floor-sheet > div > div.table__pagination.d-flex.flex-column.flex-md-row.justify-content-between.align-items-center > div.table__pagination--main.d-flex.mt-3.mt-md-0.align-items-center > pagination-controls > pagination-template > ul > li.pagination-next > a',
            rowTableSelectorFunc,
        },
    );
```

Second Tab:

## Another example
#### what if our div element have pagination and headers which we dont want ? 
```javascript
   const data = new CommonPage(
        {
            pageRoute: 'http://www.nepalstock.com/main/floorsheet/index/0/?contract-no=&stock-symbol=&buyer=&seller=&_limit=500',
            pageLimit: null,
            dataArea: '#home-contents > table > tbody',
            nextPageLink: '#home-contents > table > tbody > tr:nth-child(503) > td > div > a:nth-child(13)',
            rowTableSelectorFunc: pageRowExtractor,
            tableSelectorFunc: (length) => [0, 1, length - 3, length - 2, length - 1],
        },
    );
    // here tableSelectorFunc object gives the functions with length of current table or list area as a parameters.
    (length) => [0, 1, length - 3, length - 2, length - 1]
    // here we have removed the first, second, and last 3 div elements from the table.
```

   [puppeteer]: <https://npmjs.com/package/puppeteer>
   [JSDOM]: <https://github.com/jsdom/jsdom>