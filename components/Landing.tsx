import Image from 'next/image';
import Link from 'next/link';
import Button from '../components/Button';

type LandingProps = {
  [x: string]: any;
};

const Landing = ({
  variation = 'primary',
  children,
  size = 'medium',
  customStyle = '',
  handleLogin,
  name,
  isLoggedIn,
  ...props
}: LandingProps) => {
  return (
    <div className="m-auto max-w-4xl px-4">
      <section className="py-8 flex">
        <div>
          <h1 className="text-6xl md:text-8xl">
            Meet <mark className="font-bold text-rp-text block">Recipy</mark>
          </h1>
          <p className="text-3xl pb-8">Your weekly meal planner</p>
          {!isLoggedIn && (
            <Button onClick={handleLogin}>Sign in with Notion</Button>
          )}
          {isLoggedIn && (
            <Link href="/planner" className="btn-primary">
              Open planner
            </Link>
          )}
        </div>
        <div>
          <Image
            src="/icons/fruit.svg"
            height={300}
            width={300}
            alt="Fruits."
          />
        </div>
      </section>
      <section className="py-5 md:py-20">
        <h2>How does it work?</h2>
        <p className="max-w-[70ch] pb-4">
          Sign up using your Notion account. Choose the option to duplicate the
          template that is provided. The template includes one database with
          recipes and second database with weekly meal plan. Later on you can
          add more recipes to the database, just keep the provided template. The
          recipes will be used in the weekly meal plan generator. From there you
          can assign them to days of the week and save it to access later in
          Notion.
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative">
            <Image
              src="/icons/recommender_calendar.svg"
              height={300}
              width={400}
              alt="Recipy interface illustration."
            />
            <p className="py-4">
              Use recipy.com to see recommendations for you meals. Drag and drop
              recipes into columns with days of the week. Once ready, click
              &apos;Send to Notion&apos; button.
            </p>
            <div className="hidden md:block absolute top-44 -right-20 z-10 ">
              <Image src="/icons/arrow.svg" height={110} width={150} alt="" />
            </div>
          </div>
          <div>
            <Image
              src="/icons/notion_calendar.svg"
              height={300}
              width={400}
              alt="Notion weekly planner illustration."
            />
            <p className="py-4">
              See your planned meals in Notion. Use it to create the shopping
              list, check what to cook on a given day and see how your food
              habits are changing over time.
            </p>
          </div>
        </div>
        <div className="max-w-[70ch] ">
          <h2>Practical information</h2>
          <p className="">
            You can decide to only keep using the Notion template. If you want
            to use this app as well, make sure to follow the guidelines below.
          </p>

          <ul className="list-disc list-inside">
            <li>
              You can rename the pages and databases but keep &apos;Meals
              database&apos; and &apos;Meal plan&apos; in the titles.
            </li>
            <li>
              To connect to existing Notion meal planner database, choose
              &apos;Select pages to share with Recipy planner&apos; when
              authenticating.
            </li>
            <li>For now you can only plan diners with this app.</li>
            <li>
              I save my recipes in{' '}
              <a href="https://raindrop.io/">Raindrop.io</a> and using{' '}
              <a href="https://zapier.com/">Zapier</a> I import them
              automatically into Notion. You can try to do the same, add them
              manually or use one of the Notion web clippers.
            </li>
            <li>This app is still Work In Progress, so expect bugs.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
export default Landing;
