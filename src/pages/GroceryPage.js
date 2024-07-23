import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../UserContext";
import { address } from "../Header";
import Grocery from "../Grocery";

import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

export default function GroceryPage(){
    const {userInfo} = useContext(UserContext);
    const [groceryList, setGroceryList] = useState([]);
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

    const handleDragDrop = async (results)=>{
        const {source, destination, type} = results;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (type === 'group') {
            const groceryCopy = [...groceryList];
            const sIndex = source.index;
            const dIndex = destination.index;
            const [temp] = groceryCopy.splice(sIndex, 1);
            groceryCopy.splice(dIndex, 0, temp)
            setGroceryList(groceryCopy);
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                method: 'PUT',
                body: JSON.stringify(groceryCopy),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })
        }
    }

    return (
        <>
        {userInfo !== null && (
            <>
            <div>
                <h1>Grocery List</h1>
            </div>
            <form className="groceryForm" onSubmit={addGrocery}>
                <div className="input-container">
                    <input className="groceryText"
                        type="text"
                        placeholder="Grocery"
                        value={groceryItem}
                        required
                        onChange={ev => setGroceryItem(ev.target.value)} />
                    <input className="groceryQuantity"
                        type="number"
                        value={groceryQuantity}
                        onChange={ev => setGroceryQuantity(ev.target.value)}
                        min={1}
                        max={100}
                        required
                    />
                </div>
                <button id="grocerySubmit" style={{ marginTop: '5px' }}>Add Item</button>
            </form>
            <DragDropContext
                onDragEnd={handleDragDrop}
            >
                <Droppable droppableId="ROOT" type="group">
                    {(provided)=>(
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {groceryList.length > 0 && groceryList.map((grocery, index) => (
                                <Draggable draggableId={grocery._id} key={grocery._id} index={index}>
                                    {(provided)=>(
                                        <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                            <Grocery {...grocery} key={grocery._id}
                                                removeGrocery={removeGrocery}
                                                increment={incrementGrocery}
                                                decrement={decrementGrocery} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            
            </>
        )}
        </>
    );
}