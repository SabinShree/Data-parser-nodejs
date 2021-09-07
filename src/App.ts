import express, { Application, Request, Response } from 'express';
import BizmanduSiteParser, { getNepseOldSiteData, getNepseSinglePageData, shareKarobar } from './Services/Controller/Controller';

const app: Application = express();

const PORT = process.env.PORT || 4014;

app.get('/nepse', async (req: Request, res: Response): Promise<void> => {
    const data = await getNepseSinglePageData();
    console.log(data);

    res.send(data);
});

app.get('/bizmandu', async (req: Request, res: Response): Promise<void> => {
    const data = await BizmanduSiteParser();
    res.send(data);
});

app.get('/nepseOldSite', async (req: Request, res: Response): Promise<void> => {
    const data = await getNepseOldSiteData();
    res.send(data);
});

app.get('/shareKarobar', async (req: Request, res: Response): Promise<void> => {
    const data = await shareKarobar();
    res.send(data);
});

app.listen(PORT, (): void => {
    console.log(`Server Running here http://localhost:${PORT}`);
});
