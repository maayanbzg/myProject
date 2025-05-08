import { FC, useEffect, useState } from "react";
import axios from "axios";

type Dog = {
    id: string;
    name: string;
    person_id: string;
}

const Dogs: FC = () => {

    const [dogs, setDogs] = useState<Dog[]>([]);

    useEffect(() => {
        axios.get("http://localhost:3000/mysql/dogs")
        .then(res => {
            setDogs(res.data);
        })
        .catch(err => {
            console.error("Error fetching dogs:", err);
        });
    }, []);

    return(
        <div>
            {dogs.map((dog, index) => 
                <div key={index}>{dog.name}</div>
            )}
        </div>
    )
}

export default Dogs;