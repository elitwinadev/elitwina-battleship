//http://localhost:3030

export const logout = async ()=> {
    const url = 'http://localhost:3000/api/auth/logout';
    const headers = { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    const response = await (await fetch(url,{headers})).json()
    return response;
}
export const get_protected = async ({token})=> {
    const url = 'http://localhost:3000/api/protected';
    const headers = { 
        'x-access-token': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    const response = await (await fetch(url,{headers})).json()
    return response;
}