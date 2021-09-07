import puppeteer from 'puppeteer';

interface PageDoc {
  formatData?: () => Promise<any[]>;
  pageRoute: string;
  nextPageLink: string;
  nextPage?: string;
  dataArea: string;
  dataTableArea?: string;
  pageLimit?: number;
  rowTableSelectorFunc?: any;
  tableSelectorFunc?: any;
  fetchPage?: () => Promise<any[]>;
}

function CommonPage(
    this: PageDoc,
    {
        pageRoute,
        nextPageLink,
        nextPage,
        dataArea,
        dataTableArea,
        pageLimit,
        rowTableSelectorFunc,
        tableSelectorFunc,
    }: PageDoc,
) {
    this.pageRoute = pageRoute;
    this.pageLimit = pageLimit;
    this.nextPageLink = nextPageLink;
    this.nextPage = nextPage;
    this.dataArea = dataArea;
    this.dataTableArea = dataTableArea;
    this.rowTableSelectorFunc = rowTableSelectorFunc;
    this.tableSelectorFunc = tableSelectorFunc;

    this.fetchPage = async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        if (!this.dataTableArea) {
            this.dataTableArea = this.dataArea;
        }

        let dataArray = [];
        try {
            await page.goto(this.pageRoute, { waitUntil: 'networkidle2' });
            page.setDefaultNavigationTimeout(0);
            let lastPage = true;
            let pageNumber = 0;
            const isFetching = () => (this.pageLimit ? lastPage && pageNumber <= this.pageLimit : lastPage);
            const exposeRowTableFunc = async (data: any) => this.rowTableSelectorFunc(data);

            await page.exposeFunction('exposeRowTableFunc', exposeRowTableFunc);
            await page.waitForSelector(this.dataTableArea, { visible: true });

            if (this.tableSelectorFunc) {
                await page.exposeFunction(
                    'exposeTableSelectorFunc',
                    async (data: string) => {
                        const parsedDataLength = parseInt(data, 10);
                        return this.tableSelectorFunc(parsedDataLength);
                    },
                );
            }
            while (isFetching()) {
                pageNumber++;
                const isContentExists = await page.evaluate(
                    (innerDataTable) => document.querySelector(innerDataTable) !== undefined,
                    this.dataArea,
                );
                console.log(pageNumber);
                if (!isContentExists) {
                    lastPage = false;
                    break;
                }
                await page.waitForSelector(this.dataTableArea, { visible: true });
                const newNewsArray = await page.evaluate(async (dataTableArea) => {
                    let htmlElement = document.querySelector(dataTableArea);
                    htmlElement = Array.from(htmlElement.children);
                    // @ts-ignore
                    if (typeof window.exposeTableSelectorFunc === 'function') {
                        // @ts-ignore
                        const toBeRemovedIndex = await window.exposeTableSelectorFunc(
                            `${htmlElement.length}`,
                        );
                        htmlElement = htmlElement.filter(
                            (value: any, index: number) => !toBeRemovedIndex.includes(index),
                        );
                    }
                    // @ts-ignore
                    return Promise.all(
                        htmlElement.map(async (item: Node) => {
                            const xml = new XMLSerializer();
                            // @ts-ignore
                            return window.exposeRowTableFunc(
                xml.serializeToString(item) as string,
                            );
                        }),
                    );
                }, this.dataTableArea);
                dataArray = dataArray.concat(newNewsArray);
                if (this.nextPageLink === null) {
                    break;
                }
                try {
                    await page.waitForSelector(this.nextPageLink);
                    await page.click(this.nextPageLink);
                    await page.waitForTimeout(500);
                    await page.waitForSelector(this.dataTableArea, { visible: true });
                } catch (ex) {
                    console.log('From here ', ex);
                    lastPage = true;
                    break;
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            await browser.close();
            // eslint-disable-next-line no-unsafe-finally
            return dataArray;
        }
    };
    this.formatData = async () => {
        const data = await this.fetchPage();
        return data;
    };
}

export default CommonPage;
