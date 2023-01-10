import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { updateWeeklyPlan } from 'lib/notion-api';

export default async function handler(req, res) {
  const { method } = req;
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  });

  switch (method) {
    case 'POST':
      const { data } = await supabaseServerClient.auth.getSession();
      const provider_token =
        data.session.provider_token || data.session.refresh_token;

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
