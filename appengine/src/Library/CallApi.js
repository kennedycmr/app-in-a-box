//--------------------------------------------------------
// Generic function to call an API
//--------------------------------------------------------

export default async function CallApi(endpoint, options){

    return fetch(endpoint, options).then((results) =>{
        
        return results.json();

    }).catch((error) =>{

        throw new Error(`Failed to call api, error ${error}`);

    });
}

//--------------------------------------------------------