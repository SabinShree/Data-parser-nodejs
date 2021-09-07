function Website(name: string, languageId: string) {
    this.name = name;
    this.languageId = languageId;
}

export default Website;

type StringConversion = string | null;

export interface CrawlingInfo {
    siteName: string;
    url: string;
    uniqueId: string;
    languageId: string;
    parsedDate: string;
    headline: string;
    publishedDate?: StringConversion;
    rawHtmlData?: StringConversion;
    newsBody?: Blob;
    snippet?: Blob;
    category: StringConversion;
    ticker: StringConversion;
    display: number;
    duplicateof: number | undefined;
}
