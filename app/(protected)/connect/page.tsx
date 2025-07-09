import Person from "@/features/users/components/connectBox/Person";
import ConnectSearch from "@/features/users/components/connectBox/search";
import { fetchPeople } from "@/features/users/db/users";
import { auth } from "@clerk/nextjs/server";

export default async function Connect() {
  const { userId } = await auth();
  const people = await fetchPeople(userId!);

  return (
    <div>
      <div className="flex flex-col px-4 pb-4 bg-white">
        <h1 className="text-xl font-semibold py-2">Find Connects</h1>
        <ConnectSearch />
      </div>
      <section>
        {people &&
          people.length > 0 &&
          people.map((person) => (
            <div key={person.email}>
              <Person person={person} />
            </div>
          ))}
      </section>
    </div>
  );
}
