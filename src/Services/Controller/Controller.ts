/* eslint-disable max-len */

import jsdom from 'jsdom';

import CommonPage from '../Models/PageInfo';

const { JSDOM } = jsdom;

export default async function BizmanduSiteParser() {
    const bizmanduSelector = (element) => {
        console.log(element);

        const dom = new JSDOM(element);

        const { href, title } = dom.window.document.body.querySelector('a');
        return {
            href,
            title,
        };
    };

    const marketBizmandu = new CommonPage(
        {
            pageRoute: 'https://www.bizmandu.com/search/?category=market&day=&month=&search=&year=',
            dataArea: 'body > div.uk-container.uk-container-center > div > div > div.uk-width-medium-5-10.biz-cat-content > div > ul',
            dataTableArea: 'body > div.uk-container.uk-container-center > div > div > div.uk-width-medium-5-10.biz-cat-content > div > ul',
            nextPageLink: null,
            pageLimit: null,
            nextPage: null,
            rowTableSelectorFunc: bizmanduSelector,
        },
    );
    return { bizmandu: await marketBizmandu.formatData() };
}

export const shareKarobar = async () => {
    const rowTableSelectorFunc = (element) => {
        const dom = new JSDOM(element);
        const {
            href,
        } = dom.window.document.body.querySelector('div div.main div.p-2 a');
        const {
            textContent,
        } = dom.window.document.body.querySelector('div div.main div.p-2 a h5');
        return {
            href,
            title: textContent,
        };
    };

    const tableSelectorFunc = (length) => [0, length - 2, length - 1];

    const shareKarobar = new CommonPage(
        {
            pageRoute: 'https://www.karobardaily.com/category/share_bazaar',
            dataTableArea: 'body > div.wraper-section > div:nth-child(3) > div',
            dataArea: 'body > div.wraper-section > div:nth-child(3) > div',
            nextPage: 'https://www.karobardaily.com/category/share_bazaar',
            nextPageLink: 'body > div.wraper-section > div:nth-child(3) > div > div:nth-child(14) > ul > li:last-child > i > a',
            pageLimit: 5,
            rowTableSelectorFunc,
            tableSelectorFunc,
        },
    );
    return {
        shareKarobar: await shareKarobar.formatData(),
    };
};

export const getNepseSinglePageData = async () => {
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
    return { nepseSingleSite: await floorsheetParser.formatData() };
};

export const getNepseOldSiteData = async () => {
    const pageRowExtractor  = (data) => {
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
    };

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

    return {
        nepseOldSiteData: await data.formatData(),
    };
};
