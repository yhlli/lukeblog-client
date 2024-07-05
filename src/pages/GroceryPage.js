import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { address } from "../Header";
import Grocery from "../Grocery";

export default function GroceryPage(){
    const {userInfo} = useContext(UserContext);
    const [groceryList, setGroceryList] = useState('');
    const [groceryItem, setGroceryItem] = useState('');
    const [groceryQuantity, setGroceryQuantity] = useState(1);
    useEffect(()=>{
        fetch(`${address}/${userInfo.id}/grocerylist`, {
            method: 'GET',
            credentials: 'include',
        }).then(response=>{response.json().then(
            grocery=>{
                setGroceryList(grocery);
            }
        )});
    },[]);

    const addGrocery = async (ev)=>{
        ev.preventDefault();
        const data = new FormData();
        data.set('groceryItem', groceryItem);
        data.set('groceryQuantity', groceryQuantity);
        const response  = await fetch(`${address}/${userInfo.id}/grocerylist`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok){
            const updatedList = await fetch(`${address}/${userInfo.id}/grocerylist`, {
                method: 'GET',
                credentials: 'include',
            }).then(response=>{response.json().then(
                grocery=>{
                    setGroceryList(grocery);
                }
            )});
        }
        setGroceryItem('');
    }

    const removeGrocery = async (ev)=>{
        const response = await fetch(`${address}/${userInfo.id}/grocerylist?item=${ev}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        if (response.ok){
            setGroceryList(groceryList.filter(item => item._id !== ev));
        }
    }

    return (
        <>
        {userInfo !== null && (
            <>
            {groceryList.length > 0 && groceryList.map(grocery => (
                <div>
                    <Grocery {...grocery} key={grocery._id} removeGrocery={removeGrocery} />
                </div>
            ))}
            
            <form className="groceryForm" onSubmit={addGrocery}>
                <input className="groceryText"
                    type="text"
                    placeholder="Grocery"
                    value={groceryItem}
                    required
                    onChange={ev=>setGroceryItem(ev.target.value)} />
                <input className="groceryQuantity"
                    type="number"
                    value={groceryQuantity}
                    onChange={ev=>setGroceryQuantity(ev.target.value)}
                    min={1}
                    max={100}
                    required
                    />
                <button id="grocerySubmit" style={{ marginTop: '5px' }}>Add Item</button>
            </form>

            </>
        )}
        </>
    );
}