import { updateWeeklyPlan } from 'lib/notion-api';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const auth_token = JSON.parse(req.cookies['supabase-auth-token']);
      const provider_token = auth_token.provider_token;

      await updateWeeklyPlan(
        req.body.body,
        provider_token,
        req.body.mealPlanDatabaseId
      );
      res.json({ method: 'POST', endpoint: 'NotionPlanner' });
      break;
    default:
      console.log('DEFAULT');
      //res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
