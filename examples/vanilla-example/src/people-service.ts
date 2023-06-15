type PersonRequest = {
  name: string;
};

type Person = {
  id: number;
  name: string;
};

export type PeopleService = {
  getPerson: (id: number) => Promise<Person | undefined>;
  getPeopleByName: (name: string) => Promise<Person[]>;
  putPerson: (props: PersonRequest) => Promise<Person>;
};

export const PeopleService = (): PeopleService => {
  let counter = 0;
  const database: Record<number, Person> = {};
  return {
    getPerson: (id: number) => Promise.resolve(database[id]),
    getPeopleByName: (name) =>
      Promise.resolve(Object.values(database).filter((p) => p.name === name)),
    putPerson: (props: PersonRequest | Person) => {
      const id = (props as Person).id || ++counter;
      const newPerson = { id, ...props };
      database[id] = newPerson;
      return Promise.resolve(newPerson);
    },
  };
};
