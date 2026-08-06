import React, { useEffect, useState } from 'react'

const Home = () => {

    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8001/api/')
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    return (
        <div>
            <h1>Hello</h1>

            {data && (
                <div>
                    <p>{data.message}</p>
                    <p>Status: {data.status}</p>
                    <p>Name: {data.name}</p>
                </div> 
            )}

        </div>
    )
}

export default Home
