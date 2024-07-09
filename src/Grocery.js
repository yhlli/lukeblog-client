

export default function Grocery({name, quantity, _id, removeGrocery, increment, decrement}){

    return(
    <>
        <div className="grocery">
            <p>{name} (Quantity: {quantity})</p>
            <button onClick={()=>removeGrocery(_id)}>Delete</button>
            <button onClick={() => increment(name)}>+</button>
            <button onClick={() => decrement(name,quantity, _id)}>-</button>
        </div>
    </>
    );
}