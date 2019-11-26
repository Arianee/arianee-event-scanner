const contractKey='contractKey';

export const reset=()=>localStorage.removeItem(contractKey);

export  const isEntered=(token)=>getList().includes(token);

const save=(value)=>localStorage.setItem('contractKey',JSON.stringify(value));

export const getList=()=>localStorage.getItem('contractKey');

export const pushNewToken=(token)=>{
    const tokens=   JSON.parse(getList());
    tokens.push(token);
    save(token)
}
