import { FC, useState, useEffect } from "react";
import axios from "axios";

type Person = {
    id: number;
    name: string;
};

const Persons: FC = () => {

    const [persons, setPersons] = useState<Person[]>([]);

    useEffect(() => {
      axios.get("http://localhost:3000/mysql/persons")
        .then(res => {
          setPersons(res.data);
        })
        .catch(err => {
          console.error("Error fetching persons:", err);
        });
    }, []);

    return (
        <div>
            {persons.map((person, index) => (
                <div key={index}>
                    {person.name}
                </div>
            ))}
        </div>
    )
}

export default Persons;