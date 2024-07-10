import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../UserContext";
import { address } from "../Header";
import Grocery from "../Grocery";

export default function GroceryPage(){
    const {userInfo} = useContext(UserContext);
    const [groceryList, setGroceryList] = useState([]);
    const [groceryItem, setGroceryItem] = useState('');
    const [groceryQuantity, setGroceryQuantity] = useState(1);
    const dragItem = useRef(0);
    const draggedItem = useRef(0);

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
        if (ev && typeof ev.preventDefault === 'function') {
            ev.preventDefault();
        }
        const data = new FormData();
        data.set('groceryItem', groceryItem);
        data.set('groceryQuantity', groceryQuantity);
        const response  = await fetch(`${address}/${userInfo.id}/grocerylist`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok){
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                method: 'GET',
                credentials: 'include',
            }).then(response=>{response.json().then(
                grocery=>{
                    setGroceryList(grocery);
                }
            )});
        }
        setGroceryItem('');
        setGroceryQuantity(1);
    }

    const removeGrocery = async (ev)=>{
        const response = await fetch(`${address}/${userInfo.id}/grocerylist?item=${ev}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        if (response.ok) {
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                method: 'GET',
                credentials: 'include',
            }).then(response => {
                response.json().then(
                    grocery => {
                        setGroceryList(grocery);
                    }
                )
            });
        }
    }

    const handleSort = async()=>{
        if (dragItem.current !== draggedItem.current){
            const groceryCopy = [...groceryList];
            const [temp] = groceryCopy.splice(dragItem.current, 1);
            groceryCopy.splice(draggedItem.current, 0, temp);
            setGroceryList(groceryCopy);
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                method: 'PUT',
                body: JSON.stringify(groceryCopy),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            })
        }
    }

    const incrementGrocery = async (ev)=>{
        const num = 1;
        const response = await fetch(`${address}/${userInfo.id}/grocerylistquantity?num=${num}&name=${ev}`, {
            method: 'PUT',
            body: ev,
            credentials: 'include',
        })
        if (response.ok) {
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                method: 'GET',
                credentials: 'include',
            }).then(response => {
                response.json().then(
                    grocery => {
                        setGroceryList(grocery);
                    }
                )
            });
        }
    }

    const decrementGrocery = async (ev,quantity,id)=>{
        if (quantity== 1){
            removeGrocery(id);
            return;
        }
        const num = -1;
        const response = await fetch(`${address}/${userInfo.id}/grocerylistquantity?num=${num}&name=${ev}`, {
            method: 'PUT',
            credentials: 'include',
        })
        if (response.ok) {
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                method: 'GET',
                credentials: 'include',
            }).then(response => {
                response.json().then(
                    grocery => {
                        setGroceryList(grocery);
                    }
                )
            });
        }
    }

    return (
        <>
        {userInfo !== null && (
            <>
            {groceryList.length > 0 && groceryList.map((grocery,index) => (
                <div
                    draggable
                    onDragStart={()=>(dragItem.current = index)}
                    onDragEnter={()=>(draggedItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e)=>e.preventDefault()}
                    style={{ touchAction: 'none' }}
                >
                    <Grocery {...grocery} key={grocery._id}
                        removeGrocery={removeGrocery}
                        increment={incrementGrocery}
                        decrement={decrementGrocery} />
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