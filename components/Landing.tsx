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
    <div className="m-auto max-w-4xl">
      <section className="py-8 flex">
        <div>
          <h1 className="text-8xl">
            Meet <mark className="font-bold text-rp-text block">Recipy</mark>
          </h1>
          <p className="text-3xl pb-8">Your weekly meal planner</p>
          {!isLoggedIn && (
            <Button onClick={handleLogin}>Sign in with Notion</Button>
          )}
          {isLoggedIn && (
            <Link href="/planner" onClick={handleLogin}>
              <a className="btn-primary">Open planner</a>
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
      <section className="py-20">
        <h1>How does it work?</h1>
        <p className="max-w-2xl">
          Sign up using your Notion account. Choose option to duplicate the
          template that is provided. The template includes databse with recipes
          and database with weekly meal plan.{' '}
        </p>
        <div className="flex gap-8">
          <div className="relative">
            <Image
              src="/icons/recommender_calendar.svg"
              height={300}
              width={400}
              alt="Recipy interface illustration."
            />
            <p>
              Use recipy.com to seee recommendations for you meals. Drag and
              drop recipes into columns with days of the week. Once ready, click
              ‘send to notion’ button.
            </p>
            <div className="absolute top-44 -right-20 z-10 ">
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
            <p>
              See your planned meals in Notion. Use it to create the shopping
              list, check what to cook on a given day and see how your food
              habits are changing over time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Landing;
