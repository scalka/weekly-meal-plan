import { updateWeeklyPlan } from 'lib/notion-api';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      console.log(req.body);
      const plan = await updateWeeklyPlan(req.body);
      res.json({ method: 'POST', endpoint: 'NotionPlanner' });
      break;
    default:
      console.log('DEFAULT');
      //res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
